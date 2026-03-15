# 実装計画：処理フロー効率化リファクタリング

> **ベースドキュメント**: [DESIGN_REFACTOR_PROCESSING.md](./DESIGN_REFACTOR_PROCESSING.md)  
> **ステータス**: 実装中  
> **作成日**: 2026-03-13

---

## ブランチ構成

| ブランチ名 | 対応する改善案 | 前提条件 |
|---|---|---|
| [`refactor/twice-call-ps-image-init`](#branch-1-refactortwice-call-ps-image-init) | 案E・案A・案B・案C | なし |
| [`refactor/psimage-redesign`](#branch-2-refactorpsimage-redesign) | 案G・案D | Branch 1 のマージ後 |

---

## Branch 1: `refactor/twice-call-ps-image-init`

### 対象改善案のまとめ

| 案 | 内容 | 変更ファイル |
|---|---|---|
| 案E | `hasTransparentPixels` の for ループ化 | `src/core/utils/gif.ts` |
| 案A | `PSImageData.fromImageData()` 静的メソッド追加 | `src/core/models/InputImageData.ts` |
| 案A (続) | `Nearestneighbor.ts` の二重デコード廃除 | `src/core/algorithm/Nearestneighbor.ts` |
| 案A (続) | `xBR.ts` の二重デコード廃除 | `src/core/algorithm/xBR.ts` |
| 案B | `convertAnyChecked` の並列化 | `src/stores/convertStore.ts`, `src/core/services/image/convertService.ts` |
| 案C | 変換後 `imageData` の破棄 | `src/types/convert.ts`, `src/stores/convertStore.ts` |

---

### ステップ 0: ブランチ作成・現状確認

```bash
git checkout -b refactor/twice-call-ps-image-init
bun run test
```

全テストがグリーンであることを確認してから実装に入る。

---

### ステップ 1: 案E — `hasTransparentPixels` の for ループ化

**目的**: 大きな画像で全アルファ値の一時配列を生成しているムダを、早期 return できる `for` ループに置き換える。

**変更ファイル**: `src/core/utils/gif.ts`

**Before:**
```ts
export const hasTransparentPixels = (data: Uint8ClampedArray): boolean => {
  return Array.from(
    { length: data.length / 4 },
    (_, i) => data[i * 4 + 3],
  ).some((a) => a < 255);
};
```

**After:**
```ts
export const hasTransparentPixels = (data: Uint8ClampedArray): boolean => {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
};
```

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
perf: optimize hasTransparentPixels with early-exit for loop
```

---

### ステップ 2: 案A — `PSImageData.fromImageData()` 静的メソッド追加

**目的**: アルゴリズムが変換済み `ImageData` を `PSImageData` に変換する際、`File` への再エンコード → `PSImageData.init()` によるデコードのラウンドトリップを廃除する静的ファクトリメソッドを追加する。

**変更ファイル**: `src/core/models/InputImageData.ts`

**追加するメソッドのシグネチャ:**
```ts
static async fromImageData(
  imageData: ImageData,
  source: PSImageDataObject,
): Promise<PSImageData>
```

**実装方針:**
- `new PSImageData(source.data)` でインスタンスを生成（`data` はファイル名・MIMEタイプの引き継ぎ用）
- `uuid` は新たに `uuidv4()` で生成
- `imageData`, `width`, `height`, `originalPixelSize` を直接セット
- 非 GIF の場合: `_url` のセットは不要（`toUrl()` が `imageData` から遅延生成する）
- GIF の場合: `imageDataToFile` で再エンコード（`encodeAsGif`）→ `readFileAsDataUrl()` で `_url` をセット
- `validate()` は呼ばない（型チェックのため `data.type` で MIMEタイプを確認する程度）

**テスト対象**: `tests/unit/core/models/InputImageData.test.ts`（存在しない場合は新規作成）

テストで確認すること:
- `fromImageData()` でインスタンスが正しく生成される
- `uuid` が `source` と異なる
- `width`, `height` が `imageData` のサイズと一致する
- `originalPixelSize` が引き継がれる
- `toUrl()` が空文字でない URL を返す（GIF・非 GIF 両方）

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
feat: add PSImageData.fromImageData() static factory method
```

---

### ステップ 3: 案A (続) — `Nearestneighbor.ts` の二重デコード廃除

**目的**: リサイズ済みの `ImageData` を `File` に変換してから `PSImageData.init()` で再デコードする無駄を除去する。

**変更ファイル**: `src/core/algorithm/Nearestneighbor.ts`

**Before:**
```ts
const resizedImageData = await resizeImageData(...);
const resizedFile = await imageDataToFile(resizedImageData, ...);
const resizedPSImageData = await PSImageData.init(resizedFile);
resizedPSImageData.originalPixelSize = inputImageData.originalPixelSize;
return resizedPSImageData;
```

**After:**
```ts
const resizedImageData = await resizeImageData(...);
return PSImageData.fromImageData(resizedImageData, inputImageData);
// originalPixelSize は fromImageData 内部で source から引き継ぐ
```

`imageDataToFile` のインポートも不要になるため削除する。

**テスト対象**: `tests/unit/core/algorithm/Nearestneighbor.browser.spec.ts`  

テストで確認すること:
- 変換後の `PSImageData` が正しい `width`, `height` を持つ
- `originalPixelSize` が正しく引き継がれる
- `toUrl()` が有効な URL を返す

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
refactor: remove double decode in nearestNeighbor via fromImageData
```

---

### ステップ 4: 案A (続) — `xBR.ts` の二重デコード廃除

**目的**: `Nearestneighbor.ts` と同様に、`xBR.ts` でも `imageDataToFile` + `PSImageData.init()` のラウンドトリップを廃除する。

**変更ファイル**: `src/core/algorithm/xBR.ts`

**Before（概略）:**
```ts
const adjusted = await adjustImageData(...);
const file = await imageDataToFile(adjusted, ...);
return PSImageData.init(file);
```

**After:**
```ts
const adjusted = await adjustImageData(...);
return PSImageData.fromImageData(adjusted, inputImageData);
```

`imageDataToFile` のインポートも不要になるため削除する。

**テスト対象**: `tests/unit/core/algorithm/xBR.browser.spec.ts`

テストで確認すること:
- xBR 変換後の `PSImageData` が正しい `width`, `height` を持つ
- `originalPixelSize` が引き継がれる
- `toUrl()` が有効な URL を返す

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
refactor: remove double decode in xBR via fromImageData
```

---

### ステップ 5: 案B — `convertAnyChecked` の並列化（入力順保証あり）

**目的**: チェック済みエントリの変換を `Promise.allSettled` で並列化し、スループットを向上させる。表示順は入力順を維持する。

**現状の問題点**: `convertOne` が `scaledImageStore.addEntry()` を内部で呼んでいるため、並列実行すると追加順序が非決定的になる。これを解消するために `convertOne` の処理を分離する。

**変更ファイル**: 
- `src/core/services/image/convertService.ts`
- `src/stores/convertStore.ts`

#### 5-1. `convertService.ts` への変更（または `convertStore.ts` 内でのリストラクチャ）

**変更方針:**
- `convertOne` を「変換 + ストア追加」から「変換のみ」に分割する
- 変換結果 (`ImageEntry | null`) を返す内部ヘルパーを作成する
- `convertAnyChecked` では全エントリを並列変換し、結果を入力順にストアへ追加する

**After (`convertStore.ts` の `convertAnyChecked` 部分):**
```ts
const convertAnyChecked = async (checkedList: ImageCheckList): Promise<void> => {
  const inputImageStore = useInputImageStore();
  const checkedEntries = filterEntriesByChecked(
    inputImageStore.entries,
    checkedList,
  );

  // 並列変換（入力順は results[] のインデックスで保証）
  const results = await Promise.allSettled(
    checkedEntries.map((entry) => buildScaledEntry(entry)),
  );

  // 入力順にストアへ追加
  const scaledImageStore = useScaledImageStore();
  for (const result of results) {
    if (result.status === "fulfilled" && result.value !== null) {
      scaledImageStore.addEntry(result.value);
    }
  }
};
```

`buildScaledEntry` はエラー処理込みで `ImageEntry | null` を返す内部関数（エラー時は `entry.errors` に追加し `null` を返す）。

**テスト対象**: `tests/unit/stores/convertStore.browser.spec.ts`

テストで確認すること:
- `convertAnyChecked` 後のストアエントリ順が入力と一致する
- 変換失敗エントリのエラーが `entry.errors` に追加される
- 変換成功エントリが `scaledImageStore` に追加される

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
perf: parallelize convertAnyChecked with Promise.allSettled preserving order
```

---

### ステップ 6: 案C — 変換後 `imageData` の破棄

**目的**: 変換済みエントリ（`scaledImageStore`）は `url` のみあればプレビュー・ダウンロードが可能なため、生ピクセルデータ（`imageData`）を即座に解放してメモリを削減する。

**変更ファイル**:
- `src/types/convert.ts`（`imageData` を nullable に変更）
- `src/stores/convertStore.ts`（`scaledEntry` 追加前に `imageData` をクリア）

#### 6-1. 型変更 (`src/types/convert.ts`)

**Before:**
```ts
export type PSImageDataObject = {
  ...
  imageData: ImageData;
  ...
};
```

**After:**
```ts
export type PSImageDataObject = {
  ...
  imageData: ImageData | null;
  ...
};
```

#### 6-2. `imageData` のクリア

`scaledImageStore.addEntry()` に渡す直前に `imageData` を `null` にする。
場所は `convertStore.ts` の `buildScaledEntry`（ステップ 5 で追加）もしくは `convertService.ts` の `convertImage` 内。

```ts
const scaledObject = await convertImage(entry);
scaledObject.imageData = null;  // メモリ解放
```

#### 6-3. null ガードの追加

`imageData` を参照するコードに null チェックを追加する。主な影響箇所:

| ファイル | 対象 | 対応 |
|---|---|---|
| `PSImageData.toUrl()` | `this.imageData` を canvas に描画 | `imageData` が null の場合はキャッシュ済み `_url` を返す。`_url` も未定義の場合は例外を投げる |
| アルゴリズム (`Nearestneighbor.ts`, `xBR.ts`) | `inputImageData.imageData` | `inputImageStore` のエントリが対象なので null にならないが、型ガードを追加 |

**`PSImageData.toUrl()` の実装方針（PQ2）:**
```ts
public toUrl(): string {
  // NOTE: imageData is nulled out after scaling to free memory.
  // In that case, _url must have been set at init time (GIF) or by a prior toUrl() call.
  if (this.imageData === null) {
    if (this._url === undefined) {
      throw new InputError("canvas-is-unsupported", { filename: this.data.name });
    }
    return this._url;
  }
  if (this._url !== undefined) {
    return this._url;
  }
  // ... canvas で生成
}
```

> **注意**: `inputImageStore` 側のエントリは変換時に `imageData` が必要なため、null クリアを行わない。`imageData` が null になるのは `scaledImageStore` 側のエントリのみ。

**テスト対象**: 
- `tests/unit/stores/convertStore.browser.spec.ts`
- `tests/unit/stores/scaledImageStore.browser.spec.ts`

テストで確認すること:
- 変換後の `scaledImageStore` エントリの `imageData` が `null`
- `scaledImageStore.downloadEntry()` が成功する（`url` ベースのダウンロード）
- `inputImageStore` エントリの `imageData` は非 null のまま

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
perf: discard imageData from scaled entries to reduce memory usage
```

---

### ステップ 7: Branch 1 最終確認

```bash
bun run test
bun run build
```

ビルドエラー・型エラーがないことを確認したうえでプルリクエストを作成する。

---

## Branch 2: `refactor/psimage-redesign`

> **前提**: Branch 1 (`refactor/twice-call-ps-image-init`) がマージ済みであること

**対象**: 案G（`PSImageData` クラス廃止 + plain object + ファクトリ関数への統一）+ 案D（`validate()` の `fetch` 廃止）

### 対象改善案のまとめ

| 案 | 内容 | 変更ファイル（予定） |
|---|---|---|
| 案D | `PSImageData.validate()` の `fetch` 廃止 → 型チェックのみに | `src/core/models/InputImageData.ts` |
| 案G | `PSImageData` クラスを廃止し、ファクトリ関数 + plain object に統一 | `src/core/models/InputImageData.ts`、`src/types/convert.ts`、全アルゴリズム・サービス・ストア |

---

### ステップ 0: ブランチ作成・現状確認

```bash
git checkout main  # または Branch 1 のマージ先
git checkout -b refactor/psimage-redesign
bun run test
```

---

### ステップ 1: 案D — `validate()` の `fetch` 廃止

**目的**: `validate()` が呼ぶ `fetch(this.toUrl())` は Object URL / data URL に対して常に成功するため、URL 疎通確認として機能していない。MIMEタイプ・サイズチェックのみに絞る。

**変更ファイル**: `src/core/models/InputImageData.ts`

**Before:**
```ts
protected validate() {
  if (!this.data.type.startsWith("image/")) {
    throw new InputError("invalid-image-type", { ... });
  }
  try {
    fetch(this.toUrl());
  } catch {
    throw new InputError("file-not-found", { ... });
  }
}
```

**After:**
```ts
protected validate() {
  if (!this.data.type.startsWith("image/")) {
    throw new InputError("invalid-image-type", { ... });
  }
  if (this.width <= 0 || this.height <= 0) {
    throw new InputError("invalid-image-size", { ... });
  }
}
```

> **対応（PQ3）**: `invalid-image-size` エラーキーを i18n に新規追加する。`src/core/config/i18n/` 内の各言語ファイル（`ja.ts`, `en.ts` 等）に追加すること。

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
refactor: remove fetch call from validate(), use type/size check only
```

---

### ステップ 2: 案G — 設計方針の確定

> ⚠️ **大規模変更** — 影響範囲が広いため、設計を十分に固めてから実装に入る。

**廃止対象**:
- `PSImageData` クラス（`src/core/models/InputImageData.ts`）

**置き換え案**:
```ts
// Before: クラス
const ps = await PSImageData.init(file);
ps.originalPixelSize = 4;
const obj = ps.toObject();

// After: ファクトリ関数 + plain object
const obj = await createPSImageData(file);
obj.originalPixelSize = 4;
// toObject() は不要。obj 自体が PSImageDataObject
```

**変更が必要な全ファイル（予定）**:

| ファイル | 変更内容 |
|---|---|
| `src/core/models/InputImageData.ts` | `PSImageData` クラス → `createPSImageData` 関数に置き換え |
| `src/core/services/image/convertService.ts` | `ScaleMethod` の返り値型を `PSImageData` → `PSImageDataObject` に変更 |
| `src/core/algorithm/Nearestneighbor.ts` | `PSImageData` → `PSImageDataObject` を返すよう変更 |
| `src/core/algorithm/xBR.ts` | 同上 |
| `src/stores/inputImageStore.ts` | `PSImageData.init()` → `createPSImageData()` に変更 |
| `src/types/convert.ts` | `PSImageDataObject` の型整理（`imageData: ImageData | null` は維持） |
| 関連テストファイル全般 | モック・テストケースの更新 |

---

### ステップ 3: 案G — `createPSImageData` ファクトリ関数の実装

**変更ファイル**: `src/core/models/InputImageData.ts`（またはリネーム後のファイル）

**実装方針**:
- `PSImageData.init(file)` → `createPSImageData(file): Promise<PSImageDataObject>` に変換
- `PSImageData.fromImageData(imageData, source)` → `createPSImageDataFromImageData(imageData, source): Promise<PSImageDataObject>` に変換
- `PSImageDataSetting` クラスは plain object 型 `PSImageDataSettingType` で代替する

**PQ4: `_url`（GIF data URL）の移し方**  
現在の `PSImageData._url` プライベートフィールドは、plain object では既存の `PSImageDataObject.url` フィールドに統合する。
- ファクトリ関数内で `url` を事前計算して格納する（`createPSImageData` 完了時点で `url` が確定済み）
- GIF: `readFileAsDataUrl()` で取得した base64 data URL を `url` に格納
- 非 GIF: Canvas の `toDataURL()` で生成した data URL を `url` に格納
- `getPSImageDataUrl(obj): string` は単に `obj.url` を返す（遅延生成は不要）
- `案C`（`imageData` null クリア）後も `url` は維持されるため、プレビュー・ダウンロードは継続可能

```ts
// createPSImageData のイメージ（概略）
export const createPSImageData = async (file: File): Promise<PSImageDataObject> => {
  const imageData = await loadImageData(file);         // Canvas → ImageData
  const url = file.type === "image/gif"
    ? await readFileAsDataUrl(file)                     // base64 data URL
    : imageDataToDataUrl(imageData, file.type);         // Canvas toDataURL
  return {
    uuid: uuidv4(),
    data: file,
    imageData,
    width: imageData.width,
    height: imageData.height,
    originalPixelSize: 0,
    url,
    status: "loaded",
  };
};
```

**テスト対象**: 既存の `InputImageData.test.ts` をファクトリ関数ベースに書き直す

**テスト確認:**
```bash
bun run test
```

**コミット:**
```
refactor: introduce createPSImageData factory function
```

---

### ステップ 4: 案G — アルゴリズム・サービス・ストアの更新

**変更ファイル（全て）**:
- `src/core/algorithm/Nearestneighbor.ts`
- `src/core/algorithm/xBR.ts`
- `src/core/services/image/convertService.ts`
- `src/stores/inputImageStore.ts`
- `src/stores/convertStore.ts`（`convertService` の型が変わるため）

目安として 1 ファイルずつ変更しテストを確認すること。

**各ファイルの変更後にテスト確認:**
```bash
bun run test
```

**全ファイル更新完了後のコミット:**
```
refactor: replace PSImageData class usage with factory functions across services and stores
```

---

### ステップ 5: 案G — `PSImageData` クラスの完全削除

不要になった `PSImageData` クラスを削除し、`PSImageDataSetting` クラスも plain object に置換する。

**テスト確認:**
```bash
bun run test
bun run build  # 型チェック含め
```

**コミット:**
```
refactor: remove PSImageData class, complete migration to factory functions
```

---

### ステップ 6: Branch 2 最終確認

```bash
bun run test
bun run build
```

---

## Q&A（不明点・追加確認事項）

> ✅ = 決定済み / 🔍 = 要確認

| # | 質問 | 回答 | ステータス |
|---|---|---|---|
| **PQ1** | ステップ 5 (案B) で `convertOne` を分割する際、現在の `convertOneByUuid` も同様に並列化・分割の影響を受けることになるが、`convertOneByUuid` は単一エントリの変換なので現状維持（変更不要）でよいか？ | `convertOneByUuid` は変更不要 | ✅ |
| **PQ2** | ステップ 6 (案C) で `imageData` を nullable にすると、`PSImageData.toUrl()` でも null チェックが必要になる。`toUrl()` が `imageData === null` のとき `_url` を返す（scaled エントリの場合は必ず `_url` がセット済みのはず）という実装でよいか？ | OK。NOTE コメントとして意図を残す | ✅ |
| **PQ3** | ステップ 1 (案D) で追加する `invalid-image-size` エラーキーは i18n に定義が必要か？それとも既存のエラーキー（例: `encoding-error` など）で代替できるか？ | i18n に新規追加する | ✅ |
| **PQ4** | Branch 2 ステップ 3 で `toUrl()` を `getPSImageDataUrl(obj)` 外部関数化するとき、GIF の場合の `_url`（data URL）は `PSImageDataObject` のどのフィールドに持たせるか？現在は `PSImageData._url` プライベートフィールドだが、plain object にどう移すかを確認したい。 | 設計はお任せ → 既存の `url` フィールドに事前計算済み URL を格納する方針で対応（詳細は Branch 2 ステップ 3 参照） | ✅ |
