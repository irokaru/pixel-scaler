# デザインドキュメント：処理フロー効率化リファクタリング

> **ステータス**: デザイン確定（プランドキュメント作成待ち）  
> **作成日**: 2026-03-13  
> **対象ブランチ**: `refactor/twice-call-ps-image-init`  
> **目的**: 現在の画像変換処理フローにある冗長処理・メモリ非効率を解消し、将来のアニメーション GIF 対応も見据えた設計へ刷新する。

---

## 1. 現状の処理フロー（As-Is）

```
File (DnD / FilePicker)
  └─ PSImageData.init(file)
       ├─ HTMLImageElement.decode() → Canvas 2D → ImageData ┐
       ├─ GIF の場合: FileReader → base64 data URL          │ 1回目のデコード
       └─ validate() → fetch(toUrl()) でURL疎通確認         ┘
  └─ toObject() → PSImageDataObject { imageData, url, ... }
  └─ ImageEntry → inputImageStore.entries[]

変換ボタン
  └─ convertStore.convertAnyChecked(checkedMap)
       └─ for...of (逐次)
            └─ convertImage(entry)
                 └─ algorithm(image, scaleSizePercent)
                      ├─ [NearestNeighbor] resizeImageData → imageDataToFile → PSImageData.init() ┐
                      └─ [xBR] resizeToOriginalPixelSize                                          │ 2回目のデコード
                                → xBR passes                                                      │
                                → adjustImageData                                                 │
                                → imageDataToFile → PSImageData.init() ──────────────────────────┘
  └─ scaledImageStore.entries[] に push
```

---

## 2. 問題点・非効率箇所の整理

### 2-1. アルゴリズム内での `PSImageData.init()` 二重呼び出し ★★★

| | |
|---|---|
| **場所** | `Nearestneighbor.ts`, `xBR.ts` — どちらも変換後の `File` を再度 `PSImageData.init()` に渡している |
| **内容** | `init()` は内部で `HTMLImageElement.decode()` + Canvas 2D → `getImageData()` を実行する。変換後の `ImageData` は既にメモリ上にあるにもかかわらず、一度 `File`（Blob）に変換してから再デコードしている |
| **影響** | 変換のたびに Canvas 生成・decode・getImageData が余分に走る |

**現状のコード（概略）:**
```ts
// Nearestneighbor.ts
const resized = await resizeImageData(imageData, w, h, false);
const file = await imageDataToFile(resized, filename, fileType);
const result = await PSImageData.init(file);  // ← 再デコード（無駄）
```

**改善案（案A）: アルゴリズムが `PSImageData` を直接構築する**

`PSImageData` に `ImageData` から直接インスタンスを生成できる静的メソッドを追加し、`File` 経由のラウンドトリップを廃除する。

```ts
// PSImageData への追加メソッド案
static fromImageData(imageData: ImageData, source: PSImageDataObject): PSImageData

// アルゴリズム側
const resized = await resizeImageData(imageData, w, h, false);
return PSImageData.fromImageData(resized, source);  // ← File を経由しない
```

> **Q1**: `PSImageData` に `fromImageData` を追加するアプローチで問題ないか？  
> あるいは、アルゴリズムの返り値の型ごと変えて `ImageData` を直接返す設計を好むか？

---

### 2-2. 逐次変換（`convertAnyChecked` の `for...of`） ★★★

| | |
|---|---|
| **場所** | `convertStore.ts` — `convertAnyChecked` |
| **内容** | チェック済みエントリを1枚ずつ順番に変換しており、前の変換完了まで次が始まらない |
| **影響** | 複数枚選択時のスループット低下 |

**現状:**
```ts
for (const entry of entries) {
  await convertOne(entry);  // 逐次
}
```

**改善案（案B）: `Promise.all` で並列変換**
```ts
await Promise.all(entries.map((entry) => convertOne(entry)));
```

ただし、並列実行時の副作用（`scaledImageStore.addEntry` の競合や順序保証）を確認する必要がある。

> **Q2**: 変換結果の**表示順序**は入力順を維持する必要があるか？  
> → 必要な場合: `Promise.allSettled` + 結果を入力順に並べ直す処理が必要

> **Q3**: 並列変換時に UI がフリーズしないよう、WebWorker への移動を検討するか？  
> → WebWorker 化は大きな工数になるため、本リファクタの対象外とするか否かを確認したい

---

### 2-3. `ImageData` をストアに永続保持するメモリ圧迫 ★★

| | |
|---|---|
| **場所** | `PSImageDataObject.imageData: ImageData` — `inputImageStore.entries[]` および `scaledImageStore.entries[]` |
| **内容** | 生ピクセルデータ（例: 4K なら ≈33 MB/枚）を全エントリ分メモリに保持し続ける |
| **影響** | 多数ファイルを扱う際のメモリ枯渇リスク。とくに変換済みエントリは `url` さえあればプレビュー・ダウンロードに足りる |

**改善案（案C）: 変換完了後に `imageData` を破棄**

- `status: "scaled"` になったエントリは `imageData` を `null` / 削除し、`url`（data URL or Object URL）のみ保持する
- ダウンロード時は URL から Blob を再生成できる

> **Q4**: `scaledImageStore` 側のエントリは `imageData` を保持し続けることに意義はあるか？  
> （例: 変換後にさらに再変換する機能は想定しているか？）


---

### 2-4. `validate()` 内の不要な `fetch` ★

| | |
|---|---|
| **場所** | `PSImageData.validate()` |
| **内容** | URL の疎通確認のために `fetch(this.toUrl())` を呼んでいる。`toUrl()` が Object URL または data URL を返すため、ネットワーク往復は発生しないが、GIF 以外では `Canvas.toDataURL()` + fetch が走る |
| **影響** | `validate()` のたびに Canvas 描画 + fetch が余分に走る |

**改善案（案D）: fetch 廃止、型チェックのみに絞る**

MIME タイプと `imageData` の幅・高さが正常値かをチェックするだけで十分なはず。

> **Q5**: `validate()` で URL 疎通確認を行っている設計意図は何か？  
> 何らかのエラーを実際に拾えているケースがあれば、代替手段を検討する。

---

### 2-5. `gif.ts` の `hasTransparentPixels` の非効率な配列生成 ★

| | |
|---|---|
| **場所** | `src/core/utils/gif.ts` — `hasTransparentPixels()` |
| **内容** | `Array.from({length: N}, (_, i) => imageData.data[i * 4 + 3])` で全アルファ値の配列を一時確保してから `.some()` |
| **影響** | 大きな画像で不要な配列アロケーション |

**改善案（案E）: 早期 break できる `for` ループへ変更**
```ts
for (let i = 3; i < imageData.data.length; i += 4) {
  if (imageData.data[i] < 255) return true;
}
return false;
```

---

### 2-6. xBR の「縮小 → xBR → 拡大」の二重 Canvas 操作 ★

| | |
|---|---|
| **場所** | `xBR.ts` — `resizeToOriginalPixelSize` + `adjustImageData` |
| **内容** | xBR アルゴリズムの前後にそれぞれ `resizeImageData`（`createImageBitmap` + Canvas）が走る |
| **影響** | Canvas 生成・破棄のオーバーヘッドが 2 倍 |

xBR 自体のアルゴリズム構造上、この前後リサイズは必須のため、**Canvas の再利用**（同一 Canvas オブジェクトを使い回す）ことで多少軽減できる可能性がある。ただし効果は限定的のため、後期対応でもよい。

---

### 2-7. `inputImageStore.downloadCheckedEntries()` の GIF 処理 ✅ 確認済み（バグではなかった）

| | |
|---|---|
| **場所** | `inputImageStore.ts` — `downloadCheckedEntries()` |
| **内容** | `downloadString(url, name, outputPath)` のみ使用 |
| **確認結果** | スケール前 GIF の `toUrl()` は `_url`（base64 data URL）を返す。`downloadString` に data URL を渡す形で正常動作するため、`downloadBytes` 分岐は不要。Q6 にて動作確認済み。 |

対応不要。

---

### 2-8. `PSImageData` クラスと `PSImageDataObject` の二重管理 ★★

| | |
|---|---|
| **場所** | `PSImageData` (class, `InputImageData.ts`) ↔ `PSImageDataObject` (plain object, `types/convert.ts`) |
| **内容** | モデルクラスとストア保持用の plain object が分離されており、`toObject()` / `PSImageData.init(file)` / (追加予定の) `fromImageData()` で相互変換が発生する |
| **影響** | 変換コストの分散・責務の曖昧さ・テストの複雑化 |

**現状の型の関係:**
```
PSImageData (class)
  ├─ static init(file): Promise<PSImageData>  ← File からデコード
  ├─ toObject(): PSImageDataObject            ← ストア保存用に変換
  └─ toUrl(): string                          ← プレビュー用 URL 取得

PSImageDataObject (plain object)
  └─ ストア保持 / アルゴリズムへの引数として使用
```

Q4 の回答より「PSImageData に一旦変換することへの懐疑」が浮上。設計の方向性として以下 2 案がある。

**案F（小変更）: クラスを内部処理専用として維持、ストア型を整理**
- `fromImageData()` を追加して 2-1 を解消（案 A）
- `scaledImageStore` 向けに `imageData` を持たない軽量型 `ScaledImageDataObject` を別途定義
- `PSImageData` クラス自体は `core/` 内部専用として残す
- 今回のブランチスコープに収まる

**案G（大変更）: `PSImageData` クラスを廃止し plain object + ファクトリ関数に統一**
- `PSImageData.init()` をトップレベルの非同期ファクトリ関数に変える
- クラス継承・`this` 参照が不要になりテストが書きやすくなる
- 影響範囲が広く、今回のブランチスコープを大きく超える

> **Q7**: 今回のスコープとして、型設計はどこまで変更するか？
> - **最小**: 案 A（`fromImageData` 追加のみ）で 2-1 を解消し、型設計は現状維持
> - **中程度（案F）**: `fromImageData` 追加 + 変換済みエントリ用の軽量型を新設（`imageData` 不要）
> - **大規模（案G）**: `PSImageData` クラス廃止と全体型設計の刷新（別ブランチ推奨）

---

## 3. 改善案サマリー

| # | 問題 | 優先度 | 改善案 | 工数感 |
|---|---|---|---|---|
| 2-1 | `PSImageData.init()` 二重呼び出し | 高 | 案A: `fromImageData` 追加（方向性確定） | 中 |
| 2-2 | 逐次変換 | 高 | 案B: `Promise.allSettled` + 入力順マッピング（方向性確定） | 小 |
| 2-3 | `ImageData` 永続保持 | 中 | 案C: 変換後に `imageData` 破棄（方向性確定） | 中 |
| 2-4 | `validate()` の不要 fetch | 低 | 案D: fetch 廃止 →**別ブランチで対応**（`PSImageData` 再設計と一緒に） | 小 |
| 2-5 | `hasTransparentPixels` の非効率配列 | 低 | 案E: for ループ化 | 極小 |
| 2-6 | xBR 二重 Canvas | 低 | Canvas 再利用（後期対応でも可） | 小 |
| 2-7 | GIF ダウンロード | ~~高（バグ）~~ 対応不要 | base64 data URL で正常動作確認済み | — |
| 2-8 | `PSImageData` クラスと型設計 | 中 | 案G: クラス廃止・全体刷新 →**別ブランチで対応** | 中〜大 |

---

## 4. スコープ外（今回対象外）

- WebWorker への移行（別タスクとして後日検討）
- アニメーション GIF 対応（別 feature として進行中）
- UI 側のチェック機構（`useImageCheckable` の `deep: true`）の最適化
- `PSImageData` クラス廃止 + plain object + ファクトリ関数への全体刷新（案G）→ 別ブランチ
- `validate()` 内の `fetch` 除去（案D）→ 案G の別ブランチと同時対応

---

## 5. 未決事項 Q&A

> ✅ = 決定済み / 🔍 = 要追加確認

| # | 質問 | 回答 | ステータス |
|---|---|---|---|
| **Q1** | `PSImageData.fromImageData()` の追加アプローチで問題ないか？アルゴリズムの返り値型ごと `ImageData` 直接返しにする案と比較してどちらを好むか？ | `fromImageData` アプローチの方が、アルゴリズムの責務が「変換処理の実装」に集中できるため好ましい。 | ✅ **案A採用確定** |
| **Q2** | 変換結果の表示順序は入力順を維持する必要があるか？ | 維持したい。`Promise.allSettled` で全変換完了を待ち、結果を入力順にマッピングして `scaledImageStore` に追加する形でよい。 | ✅ **案B（順序保証あり）採用確定** |
| **Q3** | WebWorker 化を今回のスコープに含めるか？ | 含めない。 | ✅ **スコープ外確定** |
| **Q4** | `scaledImageStore` 側のエントリで `imageData` を保持し続ける必要はあるか（再変換機能の想定など）？ | 再変換の想定はないため破棄してよい。型定義を含めてもう少し綺麗にしたい。`PSImageData` に一旦変換するアプローチにも懐疑的。 | ✅ **破棄確定 → 型設計議論は Q7 へ** |
| **Q5** | `validate()` の `fetch` は何のために追加されたか？除去できるか？ | 変換途中でファイルが削除された場合に `fetch` でエラーになるケースを想定。エッジケースではある。 | 🔍 **Q8 参照** |
| **Q6** | `inputImageStore.downloadCheckedEntries()` の GIF 未処理バグは認識済みか？ | 手元確認でエラーなく正常ダウンロードできている。 | ✅ **バグではなかった（2-7 参照）** |
| **Q7** | 今回のスコープとして型設計はどこまで変更するか？（2-8 参照）<br>・最小: `fromImageData` 追加のみで現状の型設計を維持<br>・中程度（案F）: 変換済みエントリ用の軽量型も新設<br>・大規模（案G）: `PSImageData` クラス廃止と全体刷新 | Q8 の回答より、`PSImageData` の大規模な再設計は別ブランチで行う方針。このため**今回のブランチでは「最小（案A + 案C）」**のみに留める。案G は別ブランチで扱う。 | ✅ **今回ブランチ = 最小、案G = 別ブランチ確定** |
| **Q8** | `validate()` 内の `fetch` について：`PSImageData.toUrl()` が返すのは data URL または Object URL であり、どちらもブラウザのメモリ管理下（`URL.createObjectURL` は File オブジェクトへの参照）。ファイルシステム上のファイルが削除されても Object URL は有効なため、`fetch` は実際には常に成功するはず。このエッジケースの検知として `fetch` が機能しているか疑わしいが、除去してよいか？ | 大規模改修だが、別ブランチで作業する方針。 | ✅ **`validate()` fetch 除去 = 別ブランチで対応確定** |
