# ディレクトリ構成リファクタリング計画

> **ステータス:** 設計確定・実装待ち  
> このドキュメントが議論・意思決定の場です。質問・提案・決定はすべてここに記録します。

---

## 1. 現状分析：何が問題か

### 1-1. `src/@types/` と `src/core/@types/` の分け方が曖昧

現在の中身：

| ファイル | 場所 | 内容 |
|---|---|---|
| `convert.ts` | `src/@types/` | 画像エントリ・チェックリストなどのドメイン型 |
| `error.ts` | `src/@types/` | エラー種別・エラーオブジェクトの型 |
| `form.ts` | `src/@types/` | スケールモード・表示スタイルなどのフォーム型 |
| `link.ts` | `src/@types/` | リンクオブジェクトの型 |
| `color.ts` | `src/core/@types/` | カラーテーマ設定・カラーキーの型 |
| `github.ts` | `src/core/@types/` | GitHub API レスポンスの型 |
| `i18n.ts` | `src/core/@types/` | 言語キーの型 |
| `global.d.ts` | `src/core/@types/` | グローバル型宣言（`IconDefinition`） |
| `vue.d.ts` | `src/core/@types/` | Vue グローバルコンポーネント宣言 |
| `xBRjs.d.ts` | `src/core/@types/` | xbr-js ライブラリのアンビエント宣言 |

**問題点：**
- `src/@types/` = "アプリドメイン型" 、`src/core/@types/` = "コア内部型" という意図が見えるが、明文化された規則がない
- アンビエント宣言（`.d.ts`）が通常のエクスポート型と同じディレクトリに混在している
- `color.ts` / `i18n.ts` は core 内でしか使われないが、`convert.ts` / `error.ts` は Store 以上の全レイヤーで使われる——この差が分け方に反映されていない

### 1-2. `src/core/` の中身が "Vueでないもの全部" になっている

現在の `src/core/` 以下：

```
core/
  @types/          ← 型定義
  config/          ← JSON設定ファイル（i18n・カラーテーマ）
  constants/       ← configを読み込む定数（color.ts, i18n.ts）
  infrastructure/  ← LocalStorage ラッパー
  plugins/         ← Vue プラグイン（i18n, meta）  ← ← ← Vue 依存！
  services/        ← ビジネスロジック
  utils/           ← DOM ユーティリティ（ogp.ts）
  system.ts        ← 環境判定ユーティリティ
```

**問題点：**
- `plugins/` は Vue に依存しているのに `core/` に置かれている（依存方向の違反ではないが意味的にズレている）
- `constants/color.ts` と `constants/i18n.ts` は実質「設定ファイルの読み込み + 定数のまとめ」であり、`config/` との境界が不明確
- `system.ts` がいくつかのカテゴリに跨がる関数を持つ独立ファイルとして浮いている

### 1-3. フレームワーク非依存コードが `src/` 直下に散在している

| ディレクトリ・ファイル | 内容 | Vue/Pinia 依存 |
|---|---|---|
| `src/algorithm/` | xBR・Nearest Neighbor 実装 | なし（純 TS） |
| `src/models/` | ドメインモデル・エラークラス | なし（純 TS） |
| `src/guards/` | 型ガード | なし（純 TS） |
| `src/utils/imageItemUtils.ts` | チェックリスト操作 | なし（純 TS） |
| `src/utils/fileUtils.ts` | ファイルDL・ZIP生成 | なし（Tauri + DOM） |
| `src/utils/imageUtils.ts` | Canvas 操作 | なし（DOM） |

これらは `src/core/` の「Vue/Pinia に依存しないコード」という定義に合うはずだが、外に置かれている。

### 1-4. `src/constants/` と `src/core/constants/` の二重構造

| 場所 | ファイル | 性質 |
|---|---|---|
| `src/constants/` | `form.ts`, `icon.ts`, `link.ts`, `imageFile.ts`, `displayStyle.ts` | UI 向けデータ（FontAwesome 参照含む） |
| `src/core/constants/` | `color.ts`, `i18n.ts` | 設定 JSON を読み込みまとめる "レジストリ" |

性質が違うので分かれている根拠はあるが、それが明文化されていない。

---

# ディレクトリ構成リファクタリング計画

> **ステータス:** 設計確定・実装待ち  
> このドキュメントが議論・意思決定の場です。質問・提案・決定はすべてここに記録します。

---

## 0. このドキュメントの読み方（AI エージェント向け）

- このプロジェクトは **Vue 3 / TypeScript / Vite / Pinia / Vitest / Tauri** の構成。
- パスエイリアス `@/*` は `src/*` に解決される（`tsconfig.json` の `paths` 設定）。
- **各コミットは独立して完結**する。1 コミット = 1 つの移動・改名・分割作業。
- 各コミットの手順は **「ファイル操作 → インポートパス修正 → テスト確認 → コミット」** の順で行う。
- インポートパスの修正は **記載したファイルのみ** 対象（grep で漏れがないか必ず確認すること）。
- `npm run test` が通ることを各コミットの完了条件とする。
- コミットメッセージは **英語 1 行**。

---

## 1. 現状分析：何が問題か

### 1-1. `src/@types/` と `src/core/@types/` の分け方が曖昧

現在の中身：

| ファイル | 場所 | 内容 |
|---|---|---|
| `convert.ts` | `src/@types/` | 画像エントリ・チェックリストなどのドメイン型 |
| `error.ts` | `src/@types/` | エラー種別・エラーオブジェクトの型 |
| `form.ts` | `src/@types/` | スケールモード・表示スタイルなどのフォーム型 |
| `link.ts` | `src/@types/` | リンクオブジェクトの型 |
| `color.ts` | `src/core/@types/` | カラーテーマ設定・カラーキーの型 |
| `github.ts` | `src/core/@types/` | GitHub API レスポンスの型 |
| `i18n.ts` | `src/core/@types/` | 言語キーの型 |
| `global.d.ts` | `src/core/@types/` | グローバル型宣言（`IconDefinition`） |
| `vue.d.ts` | `src/core/@types/` | Vue グローバルコンポーネント宣言 |
| `xBRjs.d.ts` | `src/core/@types/` | xbr-js ライブラリのアンビエント宣言 |

**問題点：**
- `src/@types/` = "アプリドメイン型" 、`src/core/@types/` = "コア内部型" という意図が見えるが、明文化された規則がない
- アンビエント宣言（`.d.ts`）が通常のエクスポート型と同じディレクトリに混在している
- `color.ts` / `i18n.ts` は core 内でしか使われないが、`convert.ts` / `error.ts` は Store 以上の全レイヤーで使われる——この差が分け方に反映されていない

### 1-2. `src/core/` の中身が "Vueでないもの全部" になっている

現在の `src/core/` 以下：

```
core/
  @types/          ← 型定義
  config/          ← JSON設定ファイル（i18n・カラーテーマ）
  constants/       ← configを読み込む定数（color.ts, i18n.ts）
  infrastructure/  ← LocalStorage ラッパー
  plugins/         ← Vue プラグイン（i18n, meta）  ← ← ← Vue 依存！
  services/        ← ビジネスロジック
  utils/           ← DOM ユーティリティ（ogp.ts）
  system.ts        ← 環境判定ユーティリティ
```

**問題点：**
- `plugins/` は Vue に依存しているのに `core/` に置かれている（依存方向の違反ではないが意味的にズレている）
- `constants/color.ts` と `constants/i18n.ts` は実質「設定ファイルの読み込み + 定数のまとめ」であり、`config/` との境界が不明確
- `system.ts` がいくつかのカテゴリに跨がる関数を持つ独立ファイルとして浮いている

### 1-3. フレームワーク非依存コードが `src/` 直下に散在している

| ディレクトリ・ファイル | 内容 | Vue/Pinia 依存 |
|---|---|---|
| `src/algorithm/` | xBR・Nearest Neighbor 実装 | なし（純 TS） |
| `src/models/` | ドメインモデル・エラークラス | なし（純 TS） |
| `src/guards/` | 型ガード | なし（純 TS） |
| `src/utils/imageItemUtils.ts` | チェックリスト操作 | なし（純 TS） |
| `src/utils/fileUtils.ts` | ファイルDL・ZIP生成 | なし（Tauri + DOM） |
| `src/utils/imageUtils.ts` | Canvas 操作 | なし（DOM） |

これらは `src/core/` の「Vue/Pinia に依存しないコード」という定義に合うはずだが、外に置かれている。

### 1-4. `src/constants/` と `src/core/constants/` の二重構造

| 場所 | ファイル | 性質 |
|---|---|---|
| `src/constants/` | `form.ts`, `icon.ts`, `link.ts`, `imageFile.ts`, `displayStyle.ts` | UI 向けデータ（FontAwesome 参照含む） |
| `src/core/constants/` | `color.ts`, `i18n.ts` | 設定 JSON を読み込みまとめる "レジストリ" |

性質が違うので分かれている根拠はあるが、それが明文化されていない。

---

## 2. 設計方針（確定）

### 基本方針：`src/core/` = "Vue/Pinia に依存しないすべて"

```
src/core/  ← "No Vue, No Pinia" ゾーン（DOM・Tauri は許容）
src/        ← Vue/Pinia レイヤー（Component / Composable / Store / Plugin）
```

---

## 3. 確定した新ディレクトリ構成（目標）

```
src/
│
├── core/                          # "No Vue, No Pinia" ゾーン（DOM・Tauri は許容）
│   ├── algorithm/                 # ★移動: src/algorithm/ → ここ
│   │   ├── index.ts
│   │   ├── Nearestneighbor.ts
│   │   └── xBR.ts
│   ├── config/
│   │   ├── colors/
│   │   │   ├── *.json             # 変更なし
│   │   │   └── index.ts           # ★移動: src/core/constants/color.ts → ここ
│   │   └── i18n/
│   │       ├── *.json             # 変更なし
│   │       └── index.ts           # ★移動: src/core/constants/i18n.ts → ここ
│   ├── guards/                    # ★移動: src/guards/ → ここ
│   │   └── form.ts
│   ├── infrastructure/
│   │   ├── storage.ts             # 変更なし
│   │   ├── app.ts                 # ★新規: system.ts の isWeb/isStandalone/isUnite/getAppCurrentVersion
│   │   └── browser.ts             # ★新規: system.ts の getBrowserLanguage
│   ├── models/                    # ★移動: src/models/ → ここ
│   │   ├── InputImageData.ts
│   │   ├── __mocks__/
│   │   └── errors/
│   ├── services/                  # 変更なし
│   ├── types/                     # ★リネーム: src/core/@types/ → ここ
│   │   ├── color.ts
│   │   ├── github.ts
│   │   ├── i18n.ts
│   │   └── xBRjs.d.ts
│   └── utils/                     # ★統合: src/utils/ の全ファイルを追加
│       ├── ogp.ts                 # 変更なし
│       ├── fileUtils.ts           # ★移動: src/utils/ → ここ
│       ├── imageUtils.ts          # ★移動
│       └── imageItemUtils.ts      # ★移動
│
├── types/                         # ★リネーム: src/@types/ → ここ（宣言ファイルも追加）
│   ├── convert.ts
│   ├── error.ts
│   ├── form.ts
│   ├── link.ts
│   ├── global.d.ts                # ★移動: src/core/@types/ → ここ
│   └── vue.d.ts                   # ★移動: src/core/@types/ → ここ
│
├── plugins/                       # ★移動: src/core/plugins/ → ここ
│   ├── i18n.ts
│   └── meta.ts
│
├── components/                    # 変更なし
├── composables/                   # 変更なし
├── constants/                     # 変更なし（UI向けデータ）
├── stores/                        # 変更なし
├── App.vue                        # 変更なし
├── main.ts                        # インポートパスのみ修正
└── vite-env.d.ts                  # 変更なし
```

---

## 4. 実装手順（コミット単位）

> **前提確認コマンド：**
> ```bash
> cd /path/to/pixel-scaler
> npm run test   # すべて通ることを確認してから始める
> ```

---

### COMMIT 1: `refactor: rename @types directories to types`

**概要：**  
`src/@types/` を `src/types/` に、`src/core/@types/` を `src/core/types/` にリネームする。  
`.d.ts`（アンビエント宣言）も同じ `types/` ディレクトリに同居させる。  
`tsconfig.json` 等の設定変更は不要（`@/*` エイリアスはそのまま機能する）。

#### 4-1-1. ファイル操作

```bash
# src/@types/ → src/types/
git mv src/@types src/types

# src/core/@types/ → src/core/types/
git mv src/core/@types src/core/types

# global.d.ts と vue.d.ts を core/types/ から types/ へ移動
git mv src/core/types/global.d.ts src/types/global.d.ts
git mv src/core/types/vue.d.ts    src/types/vue.d.ts
```

#### 4-1-2. インポートパスの変更

**`@/@types/convert` → `@/types/convert`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/algorithm/xBR.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/utils/imageItemUtils.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/utils/fileUtils.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/models/__mocks__/InputImageData.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/composables/useImageCheckable.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/components/convert/ConvertSection.vue` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/components/convert/InputFileList/index.vue` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/components/convert/InputFileList/Item.vue` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/components/convert/ScaledImageList/ItemListView.vue` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/components/convert/ScaledImageList/ItemGridView.vue` | `from "@/@types/convert"` | `from "@/types/convert"` |
| `src/core/services/image/entryBatchService.ts` | `from "@/@types/convert"` | `from "@/types/convert"` |

**`@/@types/error` → `@/types/error`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/models/__mocks__/InputImageData.ts` | `from "@/@types/error"` | `from "@/types/error"` |
| `src/components/InputErrorList.vue` | `from "@/@types/error"` | `from "@/types/error"` |

**`@/@types/form` → `@/types/form`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/composables/useDisplayStyle.ts` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/composables/useScaleSettings.ts` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/constants/form.ts` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/guards/form.ts` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/models/__mocks__/InputImageData.ts` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/components/convert/ScaledImageList/Header.vue` | `from "@/@types/form"` | `from "@/types/form"` |
| `src/components/convert/InputFileList/Header.vue` | `from "@/@types/form"` | `from "@/types/form"` |
| `tests/unit/composables/useDisplayStyle.spec.ts` | `from "@/@types/form"` | `from "@/types/form"` |

**`@/@types/link` → `@/types/link`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/constants/link.ts` | `from "@/@types/link"` | `from "@/types/link"` |

**`@/core/@types/color` → `@/core/types/color`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/colorService.ts` | `from "@/core/@types/color"` | `from "@/core/types/color"` |
| `src/composables/useColor.ts` | `from "@/core/@types/color"` | `from "@/core/types/color"` |
| `src/components/settings/ColorSelector.vue` | `from "@/core/@types/color"` | `from "@/core/types/color"` |
| `tests/unit/composables/useColor.spec.ts` | `from "@/core/@types/color"` | `from "@/core/types/color"` |
| `tests/unit/core/services/colorService.spec.ts` | `from "@/core/@types/color"` | `from "@/core/types/color"` |

また、`src/core/constants/color.ts` は **相対パス** で `"../@ types/color"` を参照している。これも修正：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/constants/color.ts` | `from "../@types/color"` | `from "../types/color"` |

**`@/core/@types/i18n` → `@/core/types/i18n`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `tests/unit/core/services/i18nService.spec.ts` | `from "@/core/@types/i18n"` | `from "@/core/types/i18n"` |

また、`src/core/services/i18nService.ts` は **相対パス** で参照している：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/i18nService.ts` | `from "../@types/i18n"` | `from "../types/i18n"` |

**`xBRjs.d.ts`・`global.d.ts`・`vue.d.ts`** はインポート文なし（グローバル宣言・モジュール宣言）なので、インポートパスの変更は不要。

#### 4-1-3. 検証

```bash
npm run test
```

---

### COMMIT 2: `refactor: move core/constants into core/config`

**概要：**  
`src/core/constants/color.ts` と `src/core/constants/i18n.ts` を  
それぞれ `src/core/config/colors/index.ts`、`src/core/config/i18n/index.ts` として配置し直す。  
JSON ファイルとレジストリ定数を同じディレクトリにまとめる。  
`src/core/constants/` ディレクトリは廃止。

#### 4-2-1. ファイル操作

```bash
# color.ts を config/colors/ の index.ts に移動
git mv src/core/constants/color.ts src/core/config/colors/index.ts

# i18n.ts を config/i18n/ の index.ts に移動
git mv src/core/constants/i18n.ts src/core/config/i18n/index.ts

# constants/ ディレクトリが空になることを確認して削除
rmdir src/core/constants
```

#### 4-2-2. `src/core/config/colors/index.ts` 内のインポートパス修正

移動後、このファイルは `src/core/config/colors/` に置かれる。  
JSON ファイルはすでに同じディレクトリにあるため相対パスに変更。  
型定義は COMMIT 1 で `src/core/types/` に移動済みのため絶対パスに変更。

**変更前（`src/core/constants/color.ts` の状態）：**
```typescript
import blue from "@/core/config/colors/blue.json" with { type: "json" };
// ... 他の JSON インポートも同様
import { ColorKey, ColorSettings } from "../types/color";  // COMMIT 1 で修正済み
```

**変更後（`src/core/config/colors/index.ts` の状態）：**
```typescript
import blue from "./blue.json" with { type: "json" };
import blue_dark from "./blue_dark.json" with { type: "json" };
import dark from "./dark.json" with { type: "json" };
import gray from "./gray.json" with { type: "json" };
import green from "./green.json" with { type: "json" };
import green_dark from "./green_dark.json" with { type: "json" };
import red from "./red.json" with { type: "json" };
import red_dark from "./red_dark.json" with { type: "json" };

import { ColorKey, ColorSettings } from "@/core/types/color";
```
（`StorageKey`, `DefaultColorKeyName`, `ColorKeys`, `Colors` のエクスポートはそのまま維持する）

#### 4-2-3. `src/core/config/i18n/index.ts` 内のインポートパス修正

**変更前（`src/core/constants/i18n.ts` の状態）：**
```typescript
import cn from "@/core/config/i18n/cn.json" with { type: "json" };
// ... 他の JSON インポートも同様
```

**変更後（`src/core/config/i18n/index.ts` の状態）：**
```typescript
import cn from "./cn.json" with { type: "json" };
import en from "./en.json" with { type: "json" };
import es from "./es.json" with { type: "json" };
import ja from "./ja.json" with { type: "json" };
import tr from "./tr.json" with { type: "json" };
```
（`StorageKey`, `DefaultLanguage`, `Languages`, `LanguagesForUnite` のエクスポートはそのまま維持する）

#### 4-2-4. 外部ファイルのインポートパス変更

**`@/core/constants/color` → `@/core/config/colors`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/colorService.ts` | `from "@/core/constants/color"` | `from "@/core/config/colors"` |
| `tests/unit/core/services/colorService.spec.ts` | `from "@/core/constants/color"` | `from "@/core/config/colors"` |
| `tests/e2e/specs/settings.spec.ts` | `from "@/core/constants/color"` | `from "@/core/config/colors"` |

**`../constants/color` → `../config/colors`** に変更するファイル（相対パス参照）：
（COMMIT 1 で color.ts の型参照は修正済みのため、ここでは colorService.ts の相対参照のみ確認）

**`@/core/constants/i18n` → `@/core/config/i18n`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `tests/unit/composables/useI18n.spec.ts` | `from "@/core/constants/i18n"` | `from "@/core/config/i18n"` |
| `tests/unit/core/plugins/i18n.spec.ts` | `from "@/core/constants/i18n"` | `from "@/core/config/i18n"` |

また **相対パス** で参照しているファイルも修正：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/i18nService.ts` | `from "../constants/i18n"` | `from "../config/i18n"` |
| `src/core/plugins/i18n.ts` | `from "../constants/i18n"` | `from "../config/i18n"` |

#### 4-2-5. 検証

```bash
npm run test
```

---

### COMMIT 3: `refactor: split core/system.ts into infrastructure/app.ts and browser.ts`

**概要：**  
`src/core/system.ts` を廃止し、その関数を役割ごとに 2 つの新ファイルに分割する。

- `src/core/infrastructure/app.ts` — `import.meta.env` から取得するアプリ環境情報
- `src/core/infrastructure/browser.ts` — `navigator` API から取得するブラウザ情報

#### 4-3-1. 新ファイル作成

**`src/core/infrastructure/app.ts`（新規作成）：**

```typescript
/**
 * Retrieves the version of the application.
 * @returns The version of the application as a string.
 */
export const getAppCurrentVersion = (): string => {
  return import.meta.env.APP_VERSION;
};

/**
 * Checks if the application is running in standalone mode.
 * @returns A boolean value indicating whether the application is running in standalone mode.
 */
export const isStandalone = (): boolean => {
  return (
    "VITE_IS_STANDALONE" in import.meta.env &&
    import.meta.env.VITE_IS_STANDALONE === "true"
  );
};

/**
 * Checks if the code is running in a web environment.
 * @returns {boolean} Returns true if the code is running in a web environment, false otherwise.
 */
export const isWeb = (): boolean => {
  return !isStandalone();
};

/**
 * Checks if the application is running in RPG Maker Unite mode.
 * @returns {boolean} Returns true if the application is running in RPG Maker Unite mode.
 */
export const isUnite = (): boolean => {
  return (
    "VITE_IS_UNITE" in import.meta.env &&
    import.meta.env.VITE_IS_UNITE === "true"
  );
};
```

**`src/core/infrastructure/browser.ts`（新規作成）：**

```typescript
/**
 * Returns the language code of the user's browser.
 * @returns The language code of the user's browser.
 */
export const getBrowserLanguage = (): string => {
  return (
    (globalThis.navigator.languages && globalThis.navigator.languages[0]) ||
    globalThis.navigator.language
  );
};
```

#### 4-3-2. 元ファイルの削除

```bash
git rm src/core/system.ts
```

#### 4-3-3. インポートパスの変更

`@/core/system` を参照しているすべてのファイルを修正する。  
各ファイルでインポートしている関数によって移動先が変わることに注意。

| ファイル | 使用している関数 | 変更前 | 変更後 |
|---|---|---|---|
| `src/components/MainHeader.vue` | `isUnite` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/components/settings/SettingsSection.vue` | `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/components/convert/ScaledImageList/ItemGridView.vue` | `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/components/convert/ScaledImageList/ItemListView.vue` | `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/components/convert/ScaledImageList/Header.vue` | `isStandalone`, `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/stores/outputPathStore.ts` | `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `src/utils/fileUtils.ts` | `isWeb` | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `tests/unit/components/MainHeader.spec.ts` | `isUnite`（mock） | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `tests/unit/stores/outputPathStore.spec.ts` | `isWeb`（mock） | `from "@/core/system"` | `from "@/core/infrastructure/app"` |
| `tests/unit/components/convert/ScaledImageList/Header.spec.ts` | `isStandalone`, `isWeb`（mock） | `from "@/core/system"` | `from "@/core/infrastructure/app"` |

`i18nService.ts` は `getBrowserLanguage`（browser）と `isUnite`（app）の **両方** を使っているため、インポートを分割する：

**`src/core/services/i18nService.ts` の変更：**

```typescript
// 変更前
import { getBrowserLanguage, isUnite } from "@/core/system";

// 変更後（2行に分割）
import { isUnite } from "@/core/infrastructure/app";
import { getBrowserLanguage } from "@/core/infrastructure/browser";
```

**`tests/unit/core/services/i18nService.spec.ts` の変更：**

```typescript
// 変更前（2箇所）
import { getBrowserLanguage, isUnite } from "@/core/system";  // line 10
vi.mock("@/core/system");                                       // line 13

// 変更後
import { isUnite } from "@/core/infrastructure/app";
import { getBrowserLanguage } from "@/core/infrastructure/browser";
vi.mock("@/core/infrastructure/app");
vi.mock("@/core/infrastructure/browser");
```

#### 4-3-4. 検証

```bash
npm run test
```

---

### COMMIT 4: `refactor: move core/plugins to plugins`

**概要：**  
Vue（vue-i18n）に依存する `src/core/plugins/` を Vue レイヤーの `src/plugins/` へ移動する。  
`src/core/plugins/meta.ts` は `./i18n` への相対インポートを持つが、移動後も同ディレクトリ内なので変更不要。

#### 4-4-1. ファイル操作

```bash
git mv src/core/plugins src/plugins
```

#### 4-4-2. `src/plugins/i18n.ts` 内のインポートパス修正

移動前の `src/core/plugins/i18n.ts` が相対パス `from "../config/i18n"` で参照していた箇所を絶対パスに変更（移動後は相対パスが壊れるため）：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/plugins/i18n.ts` | `from "../config/i18n"` | `from "@/core/config/i18n"` |

#### 4-4-3. 外部ファイルのインポートパス変更

**`@/core/plugins/i18n` → `@/plugins/i18n`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/composables/useI18n.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `src/stores/convertStore.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `src/main.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `src/components/settings/LanguageSelector.vue` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `tests/unit/core/plugins/i18n.spec.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `tests/unit/components/settings/LanguageSelector.spec.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |
| `tests/unit/composables/useI18n.spec.ts` | `from "@/core/plugins/i18n"` | `from "@/plugins/i18n"` |

**`@/core/plugins/meta` → `@/plugins/meta`** に変更するファイル（`meta.ts` は `@/core/utils/ogp` を絶対パスで参照しているため問題なし）：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/main.ts` | `from "@/core/plugins/meta"` | `from "@/plugins/meta"` |

#### 4-4-4. テストファイルの移動

テストも `src` のディレクトリ構成を鏡映しにするルールのため、テストファイルも移動する：

```bash
# tests/unit/core/plugins/ はそのまま残す（今後 plugins/ のテストは tests/unit/plugins/ へ）
# ただし既存ファイルは移動不要（パスはインポート先が変わるだけで確認済み）
```

> **注意：** `tests/unit/core/plugins/i18n.spec.ts` は移動せず、インポートパスのみ修正（COMMIT 9 でテストディレクトリ構成を整理する）。

#### 4-4-5. 検証

```bash
npm run test
```

---

### COMMIT 5: `refactor: move algorithm into core`

**概要：**  
`src/algorithm/` を `src/core/algorithm/` へ移動する。

#### 4-5-1. ファイル操作

```bash
git mv src/algorithm src/core/algorithm
```

#### 4-5-2. インポートパスの変更

**`@/algorithm` → `@/core/algorithm`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/image/convertService.ts` | `from "@/algorithm"` | `from "@/core/algorithm"` |
| `tests/unit/core/services/image/convertService.spec.ts` | `from "@/algorithm"` | `from "@/core/algorithm"` |

**`@/algorithm/xBR` → `@/core/algorithm/xBR`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `tests/unit/algorithm/xBR.browser.spec.ts` | `from "@/algorithm/xBR"` | `from "@/core/algorithm/xBR"` |

**`@/algorithm/Nearestneighbor` → `@/core/algorithm/Nearestneighbor`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `tests/unit/algorithm/Nearestneighbor.browser.spec.ts` | `from "@/algorithm/Nearestneighbor"` | `from "@/core/algorithm/Nearestneighbor"` |

#### 4-5-3. `src/core/algorithm/xBR.ts` 内のインポートパス修正

移動後、`@/models/` 参照が残っているため後続のコミット（COMMIT 7）で修正されるが、先に修正しておくと安全：

> この時点では `@/models/` はまだ `src/models/` に存在するため変更不要。COMMIT 7 まで保留してよい。

#### 4-5-4. 検証

```bash
npm run test
```

---

### COMMIT 6: `refactor: move guards into core`

**概要：**  
`src/guards/` を `src/core/guards/` へ移動する。

#### 4-6-1. ファイル操作

```bash
git mv src/guards src/core/guards
```

#### 4-6-2. インポートパスの変更

**`@/guards/form` → `@/core/guards/form`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/composables/useDisplayStyle.ts` | `from "@/guards/form"` | `from "@/core/guards/form"` |
| `tests/unit/guards/form.spec.ts` | `from "@/guards/form"` | `from "@/core/guards/form"` |

#### 4-6-3. 検証

```bash
npm run test
```

---

### COMMIT 7: `refactor: move models into core`

**概要：**  
`src/models/` を `src/core/models/` へ移動する。

#### 4-7-1. ファイル操作

```bash
git mv src/models src/core/models
```

#### 4-7-2. インポートパスの変更

**`@/models/InputImageData` → `@/core/models/InputImageData`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/algorithm/Nearestneighbor.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `src/core/algorithm/xBR.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `src/core/services/image/convertService.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `src/core/services/image/entryService.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `tests/unit/algorithm/helpers.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `tests/unit/__mocks__/models/InputImageData.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `tests/utils/imageTestHelper.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `tests/unit/algorithm/xBR.browser.spec.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |
| `tests/unit/algorithm/Nearestneighbor.browser.spec.ts` | `from "@/models/InputImageData"` | `from "@/core/models/InputImageData"` |

**`@/models/errors/FileError` → `@/core/models/errors/FileError`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/stores/inputImageStore.ts` | `from "@/models/errors/FileError"` | `from "@/core/models/errors/FileError"` |
| `tests/unit/composables/useGlobalError.spec.ts` | `from "@/models/errors/FileError"` | `from "@/core/models/errors/FileError"` |

**`@/models/errors/ScaleError` → `@/core/models/errors/ScaleError`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/algorithm/xBR.ts` | `from "@/models/errors/ScaleError"` | `from "@/core/models/errors/ScaleError"` |
| `src/stores/convertStore.ts` | `from "@/models/errors/ScaleError"` | `from "@/core/models/errors/ScaleError"` |
| `tests/unit/composables/useGlobalError.spec.ts` | `from "@/models/errors/ScaleError"` | `from "@/core/models/errors/ScaleError"` |
| `tests/unit/algorithm/xBR.browser.spec.ts` | `from "@/models/errors/ScaleError"` | `from "@/core/models/errors/ScaleError"` |

**`@/models/errors/UnknownError` → `@/core/models/errors/UnknownError`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/stores/errorStore.ts` | `from "@/models/errors/UnknownError"` | `from "@/core/models/errors/UnknownError"` |
| `src/stores/scaledImageStore.ts` | `from "@/models/errors/UnknownError"` | `from "@/core/models/errors/UnknownError"` |
| `tests/unit/composables/useGlobalError.spec.ts` | `from "@/models/errors/UnknownError"` | `from "@/core/models/errors/UnknownError"` |

**`@/models/errors/_ErrorBase` → `@/core/models/errors/_ErrorBase`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/stores/errorStore.ts` | `from "@/models/errors/_ErrorBase"` | `from "@/core/models/errors/_ErrorBase"` |

**`@/models/errors/InputError` → `@/core/models/errors/InputError`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/components/convert/InputFileList/index.vue` | `from "@/models/errors/InputError"` | `from "@/core/models/errors/InputError"` |
| `tests/unit/models/InputImageData.browser.spec.ts` | `from "@/models/errors/InputError"` | `from "@/core/models/errors/InputError"` |

#### 4-7-3. 検証

```bash
npm run test
```

---

### COMMIT 8: `refactor: move utils into core`

**概要：**  
`src/utils/` の 3 ファイルをすべて `src/core/utils/` へ移動し、`src/utils/` を廃止する。  
`src/core/utils/ogp.ts` はすでに存在するため、移動先は同ディレクトリに追加する形になる。

#### 4-8-1. ファイル操作

```bash
git mv src/utils/fileUtils.ts     src/core/utils/fileUtils.ts
git mv src/utils/imageUtils.ts    src/core/utils/imageUtils.ts
git mv src/utils/imageItemUtils.ts src/core/utils/imageItemUtils.ts
rmdir src/utils
```

#### 4-8-2. インポートパスの変更

**`@/utils/fileUtils` → `@/core/utils/fileUtils`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/stores/inputImageStore.ts` | `from "@/utils/fileUtils"` | `from "@/core/utils/fileUtils"` |
| `src/stores/scaledImageStore.ts` | `from "@/utils/fileUtils"` | `from "@/core/utils/fileUtils"` |
| `tests/unit/stores/inputImageStore.browser.spec.ts` | `from "@/utils/fileUtils"` および `vi.mock("@/utils/fileUtils")` | `from "@/core/utils/fileUtils"` および `vi.mock("@/core/utils/fileUtils")` |
| `tests/unit/stores/scaledImageStore.browser.spec.ts` | `from "@/utils/fileUtils"` および `vi.mock("@/utils/fileUtils")` | `from "@/core/utils/fileUtils"` および `vi.mock("@/core/utils/fileUtils")` |

**`@/utils/imageUtils` → `@/core/utils/imageUtils`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/algorithm/Nearestneighbor.ts` | `from "@/utils/imageUtils"` | `from "@/core/utils/imageUtils"` |
| `src/core/algorithm/xBR.ts` | `from "@/utils/imageUtils"` | `from "@/core/utils/imageUtils"` |
| `src/core/services/image/entryBatchService.ts` | `from "@/utils/imageUtils"` | `from "@/core/utils/imageUtils"` |

また、`src/core/utils/fileUtils.ts` 内で `imageUtils.ts` を相対パスで参照している：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/utils/fileUtils.ts` | `from "./imageUtils"` | 変更なし（同ディレクトリ） |

**`@/utils/imageItemUtils` → `@/core/utils/imageItemUtils`** に変更するファイル：

| ファイル | 変更前 | 変更後 |
|---|---|---|
| `src/core/services/image/entryBatchService.ts` | `from "@/utils/imageItemUtils"` | `from "@/core/utils/imageItemUtils"` |
| `tests/unit/utils/imageItemUtils.spec.ts` | `from "@/utils/imageItemUtils"` | `from "@/core/utils/imageItemUtils"` |

#### 4-8-3. 検証

```bash
npm run test
```

---

### COMMIT 9: `refactor: move unit tests to mirror new src structure`

**概要：**  
`tests/unit/` のディレクトリ構成を新しい `src/` 構成に合わせる。

#### 4-9-1. ファイル操作

```bash
# algorithm → core/algorithm
git mv tests/unit/algorithm tests/unit/core/algorithm

# guards → core/guards
mkdir -p tests/unit/core/guards
git mv tests/unit/guards/form.spec.ts tests/unit/core/guards/form.spec.ts
rmdir tests/unit/guards

# models → core/models
git mv tests/unit/models tests/unit/core/models

# utils → core/utils (既に tests/unit/core/utils/ は ogp.spec.ts で存在)
git mv tests/unit/utils/imageItemUtils.spec.ts tests/unit/core/utils/imageItemUtils.spec.ts
rmdir tests/unit/utils

# plugins → plugins（core/plugins から plugins の spec.ts を移動）
mkdir -p tests/unit/plugins
git mv tests/unit/core/plugins/i18n.spec.ts tests/unit/plugins/i18n.spec.ts
rmdir tests/unit/core/plugins
```

> **注意：** `tests/unit/__mocks__/models/` は `tests/unit/__mocks__/core/models/` に移動するかどうかは検討。  
> Vitest の自動モック解決は `__mocks__` の配置に依存するため、動作確認を優先してから判断すること。  
> 一旦は移動せず、`tests/unit/core/services/` 等からの参照が通るかを確認する。

#### 4-9-2. インポートパスの変更

テストファイルを移動してもインポートパスは `@/*` エイリアスを使っているため、基本的に変更不要。  
ただし相対パスで `helpers.ts` 等を参照しているファイルがあれば修正する。

`tests/unit/algorithm/helpers.ts` → `tests/unit/core/algorithm/helpers.ts` に移動したため、  
`xBR.browser.spec.ts` と `Nearestneighbor.browser.spec.ts` が `helpers.ts` を参照している場合、相対パスを確認して修正する。

#### 4-9-3. 検証

```bash
npm run test
```

---

### COMMIT 10: `docs: update ARCHITECTURE.md for new directory structure`

**概要：**  
`docs/ARCHITECTURE.md` の **Key Directories** テーブルを新しい構成に合わせて更新する。

#### 4-10-1. `docs/ARCHITECTURE.md` の変更内容

**Key Directories テーブルの更新：**

```markdown
| Location | Purpose |
|---|---|
| `src/types/` | Shared type definitions used across Vue/Pinia layers |
| `src/core/types/` | Type definitions used only within `src/core/` |
| `src/core/models/` | Domain models (e.g., custom error classes in `errors/`) |
| `src/core/algorithm/` | Pixel scaling algorithm implementations (xBR, Nearest Neighbor) |
| `src/core/guards/` | Type guards and validation functions |
| `src/core/config/` | Configuration files (i18n JSON, color themes) and their registries |
| `src/core/infrastructure/` | Storage adapters, app environment helpers, browser API wrappers |
| `src/core/utils/` | Utility functions (DOM, Canvas, file operations; no Vue/Pinia) |
| `src/constants/` | Application-wide constants (UI-facing data, FontAwesome refs) |
| `src/plugins/` | Vue plugins (vue-i18n setup, meta tag management) |
| `tests/unit/` | Unit tests mirroring `src/` structure |
| `tests/utils/` | Shared test helpers |
```

**Layer Overview の補足を追加：**

```markdown
> **`src/core/` boundary rule:** No Vue, No Pinia. DOM and Tauri APIs are allowed.
```

---

## 5. 実装チェックリスト

各コミット完了時にチェックを入れること。

- [ ] COMMIT 1: `refactor: rename @types directories to types`
- [ ] COMMIT 2: `refactor: move core/constants into core/config`
- [ ] COMMIT 3: `refactor: split core/system.ts into infrastructure/app.ts and browser.ts`
- [ ] COMMIT 4: `refactor: move core/plugins to plugins`
- [ ] COMMIT 5: `refactor: move algorithm into core`
- [ ] COMMIT 6: `refactor: move guards into core`
- [ ] COMMIT 7: `refactor: move models into core`
- [ ] COMMIT 8: `refactor: move utils into core`
- [ ] COMMIT 9: `refactor: move unit tests to mirror new src structure`
- [ ] COMMIT 10: `docs: update ARCHITECTURE.md for new directory structure`

---

## 6. 元の問答ログ

<details>
<summary>ヒアリング内容（クリックで展開）</summary>

### Q1. 型定義の分け方

> src/types と src/core/types にしたい気持ちがあります。

### Q2. `src/utils/` の扱い

> A案でいいと思います。`core/` は「Vue/Pinia 以外はOK」と定義して、DOM も許容するのがシンプルでわかりやすいと思います。

### Q3. `src/core/plugins/` の位置

> Aでいいと思います。

### Q4. `src/core/system.ts` の行き先

> Cな感じがします。他にもインフラ層として扱えるものがあるならそこに集約したいですね。
> また、environment.ts という名前も、かなり広い気がするので、ファイル分割も視野に入れて良い気がします。

### Q5. `src/core/constants/` の名前

> Cでもいいと思います。config/ にまとめるのが自然な気がします。

### 追加の要望

> ambient を作ってアンビエント宣言を分けるのは一般的なのかが分からないため少し不安である。これも core/types に入れてしまうのはどうか？（ただし global.d.ts と vue.d.ts は内容的にかなり特殊なので、分けた方がわかりやすい気もする）

</details>

---

## 7. 決定ログ

| 論点 | 決定 | 日付 |
|---|---|---|
| Q1. 型定義の分け方 | `src/types/`（全体）と `src/core/types/`（core内部）に分ける。アンビエント `.d.ts` も同じ `types/` に同居 | 2026-03-02 |
| Q2. utils の扱い | 案 A：`core/` = "No Vue/No Pinia"（DOM 許容）。`src/utils/` を廃止し全て `src/core/utils/` に統合 | 2026-03-02 |
| Q3. plugins の位置 | 案 A：`src/plugins/` に移動（Vue 依存のため core 外へ） | 2026-03-02 |
| Q4. system.ts の行き先 | 案 C 系：`src/core/infrastructure/` へ、`app.ts` と `browser.ts` に分割 | 2026-03-02 |
| Q5. core/constants/ の名前 | 案 C：`src/core/config/*/index.ts` に統合し `constants/` ディレクトリを廃止 | 2026-03-02 |


```
src/core/  ← "No Vue, No Pinia" ゾーン（DOM・Tauri は許容）
src/        ← Vue/Pinia レイヤー（Component / Composable / Store / Plugin）
```

---

## 3. 各論点の決定事項

### Q1. 型定義の分け方 → **`src/types/` と `src/core/types/` に分ける**

- `src/types/` — アプリ全体（Store 以上のレイヤー）で使う型 + グローバル宣言
- `src/core/types/` — `src/core/` 内部でのみ使う型 + ライブラリのモジュール宣言

アンビエント宣言（`.d.ts`）については、**`ambient/` は作らず `types/` の中に同居させる**。  
`.ts` と `.d.ts` が混在しても "型に関するファイル置き場" という役割は一貫しており、独立ディレクトリを作るよりシンプル。

| ファイル | 移動先 | 理由 |
|---|---|---|
| `src/@types/convert.ts` | `src/types/convert.ts` | Store 以上の全レイヤーで使用 |
| `src/@types/error.ts` | `src/types/error.ts` | 同上 |
| `src/@types/form.ts` | `src/types/form.ts` | 同上 |
| `src/@types/link.ts` | `src/types/link.ts` | 同上 |
| `src/core/@types/global.d.ts` | `src/types/global.d.ts` | アプリ全体のグローバル型宣言 |
| `src/core/@types/vue.d.ts` | `src/types/vue.d.ts` | Vue グローバルコンポーネント宣言（全コンポーネントに影響） |
| `src/core/@types/color.ts` | `src/core/types/color.ts` | core 内部でのみ使用 |
| `src/core/@types/github.ts` | `src/core/types/github.ts` | core 内部でのみ使用 |
| `src/core/@types/i18n.ts` | `src/core/types/i18n.ts` | core 内部でのみ使用 |
| `src/core/@types/xBRjs.d.ts` | `src/core/types/xBRjs.d.ts` | `src/core/algorithm/` でのみ使うライブラリ宣言 |

---

### Q2. `src/utils/` の扱い → **`src/core/utils/` に統合（DOM・Tauri 許容）**

`core/` の定義を "No Vue / No Pinia"（DOM・Tauri は OK）とし、`src/utils/` の 3 ファイルをすべて `src/core/utils/` へ移動。  
`src/utils/` ディレクトリは廃止。

| ファイル | 移動先 |
|---|---|
| `src/utils/imageItemUtils.ts` | `src/core/utils/imageItemUtils.ts` |
| `src/utils/imageUtils.ts` | `src/core/utils/imageUtils.ts` |
| `src/utils/fileUtils.ts` | `src/core/utils/fileUtils.ts` |
| `src/core/utils/ogp.ts` | そのまま（変更なし） |

---

### Q3. `src/core/plugins/` の位置 → **`src/plugins/` に移動**

Vue（vue-i18n）に依存しているため、Vue レイヤーの `src/plugins/` へ昇格させる。

| ファイル | 移動先 |
|---|---|
| `src/core/plugins/i18n.ts` | `src/plugins/i18n.ts` |
| `src/core/plugins/meta.ts` | `src/plugins/meta.ts` |

---

### Q4. `src/core/system.ts` の行き先 → **インフラ層へ移動・ファイル分割**

環境情報の取得はインフラ層とみなし `src/core/infrastructure/` へ。  
`environment.ts` という名前は広すぎるため、役割ごとにファイルを分割する。

| 関数 | 移動先ファイル | 根拠 |
|---|---|---|
| `getAppCurrentVersion()` | `src/core/infrastructure/app.ts` | `import.meta.env` からアプリ情報を取得 |
| `isStandalone()` | `src/core/infrastructure/app.ts` | 同上 |
| `isWeb()` | `src/core/infrastructure/app.ts` | `isStandalone()` の派生 |
| `isUnite()` | `src/core/infrastructure/app.ts` | 同上 |
| `getBrowserLanguage()` | `src/core/infrastructure/browser.ts` | ブラウザ API（`navigator`）からの取得 |

---

### Q5. `src/core/constants/` の名前 → **`src/core/config/` に統合（ディレクトリ削除）**

JSON ファイルと、それを読み込む TypeScript "レジストリ" を同じ場所に置く。  
`src/core/constants/` ディレクトリは廃止し、各 `index.ts` として配置。

| ファイル | 移動先 |
|---|---|
| `src/core/constants/color.ts` | `src/core/config/colors/index.ts` |
| `src/core/constants/i18n.ts` | `src/core/config/i18n/index.ts` |

---

## 4. 確定した新ディレクトリ構成

```
src/
│
├── core/                          # "No Vue, No Pinia" ゾーン（DOM・Tauri は許容）
│   ├── algorithm/                 # ★移動: src/algorithm/ → ここ
│   │   ├── index.ts
│   │   ├── Nearestneighbor.ts
│   │   └── xBR.ts
│   ├── config/
│   │   ├── colors/
│   │   │   ├── blue.json          # 変更なし
│   │   │   ├── ...
│   │   │   └── index.ts           # ★移動: src/core/constants/color.ts → ここ
│   │   └── i18n/
│   │       ├── en.json            # 変更なし
│   │       ├── ...
│   │       └── index.ts           # ★移動: src/core/constants/i18n.ts → ここ
│   ├── guards/                    # ★移動: src/guards/ → ここ
│   │   └── form.ts
│   ├── infrastructure/
│   │   ├── storage.ts             # 変更なし
│   │   ├── app.ts                 # ★新規分割（system.ts より）
│   │   └── browser.ts             # ★新規分割（system.ts より）
│   ├── models/                    # ★移動: src/models/ → ここ
│   │   ├── InputImageData.ts
│   │   ├── __mocks__/
│   │   └── errors/
│   ├── services/                  # 変更なし
│   ├── types/                     # ★リネーム: src/core/@types/ → ここ
│   │   ├── color.ts
│   │   ├── github.ts
│   │   ├── i18n.ts
│   │   └── xBRjs.d.ts
│   └── utils/                     # ★統合: src/utils/ の全ファイルを追加
│       ├── ogp.ts                 # 変更なし
│       ├── fileUtils.ts           # ★移動
│       ├── imageUtils.ts          # ★移動
│       └── imageItemUtils.ts      # ★移動
│
├── types/                         # ★リネーム: src/@types/ → ここ（グローバル宣言も追加）
│   ├── convert.ts
│   ├── error.ts
│   ├── form.ts
│   ├── link.ts
│   ├── global.d.ts                # ★移動: src/core/@types/ より
│   └── vue.d.ts                   # ★移動: src/core/@types/ より
│
├── plugins/                       # ★移動: src/core/plugins/ → ここ
│   ├── i18n.ts
│   └── meta.ts
│
├── components/                    # 変更なし
├── composables/                   # 変更なし
├── constants/                     # 変更なし（UI向けデータ）
├── stores/                        # 変更なし
├── App.vue                        # 変更なし
├── main.ts                        # 変更なし（プラグインのインポートパス修正のみ）
└── vite-env.d.ts                  # 変更なし
```

### 削除されるディレクトリ

| ディレクトリ | 理由 |
|---|---|
| `src/@types/` | `src/types/` にリネーム |
| `src/algorithm/` | `src/core/algorithm/` に移動 |
| `src/guards/` | `src/core/guards/` に移動 |
| `src/models/` | `src/core/models/` に移動 |
| `src/utils/` | `src/core/utils/` に統合 |
| `src/core/@types/` | `src/core/types/` にリネーム |
| `src/core/constants/` | `src/core/config/` に統合 |
| `src/core/plugins/` | `src/plugins/` に移動 |

---

## 5. 移動ファイルと影響するインポートパスの一覧

> 実装時にこのリストをチェックオフしながら進める。

### カテゴリ別ファイル移動リスト

| # | 現在のパス | 新しいパス | インポート変更は必要か |
|---|---|---|---|
| 1 | `src/@types/convert.ts` | `src/types/convert.ts` | ✅ 全参照元 |
| 2 | `src/@types/error.ts` | `src/types/error.ts` | ✅ 全参照元 |
| 3 | `src/@types/form.ts` | `src/types/form.ts` | ✅ 全参照元 |
| 4 | `src/@types/link.ts` | `src/types/link.ts` | ✅ 全参照元 |
| 5 | `src/core/@types/color.ts` | `src/core/types/color.ts` | ✅ 全参照元 |
| 6 | `src/core/@types/github.ts` | `src/core/types/github.ts` | ✅ 全参照元 |
| 7 | `src/core/@types/i18n.ts` | `src/core/types/i18n.ts` | ✅ 全参照元 |
| 8 | `src/core/@types/global.d.ts` | `src/types/global.d.ts` | なし（自動参照） |
| 9 | `src/core/@types/vue.d.ts` | `src/types/vue.d.ts` | なし（自動参照） |
| 10 | `src/core/@types/xBRjs.d.ts` | `src/core/types/xBRjs.d.ts` | なし（モジュール宣言） |
| 11 | `src/algorithm/` | `src/core/algorithm/` | ✅ 全参照元（services など） |
| 12 | `src/guards/form.ts` | `src/core/guards/form.ts` | ✅ 全参照元 |
| 13 | `src/models/` | `src/core/models/` | ✅ 全参照元 |
| 14 | `src/utils/fileUtils.ts` | `src/core/utils/fileUtils.ts` | ✅ 全参照元 |
| 15 | `src/utils/imageUtils.ts` | `src/core/utils/imageUtils.ts` | ✅ 全参照元 |
| 16 | `src/utils/imageItemUtils.ts` | `src/core/utils/imageItemUtils.ts` | ✅ 全参照元 |
| 17 | `src/core/constants/color.ts` | `src/core/config/colors/index.ts` | ✅ 全参照元 |
| 18 | `src/core/constants/i18n.ts` | `src/core/config/i18n/index.ts` | ✅ 全参照元 |
| 19 | `src/core/plugins/i18n.ts` | `src/plugins/i18n.ts` | ✅ `src/main.ts` |
| 20 | `src/core/plugins/meta.ts` | `src/plugins/meta.ts` | ✅ 全参照元 |
| 21 | `src/core/system.ts`（`getAppCurrentVersion` 等） | `src/core/infrastructure/app.ts` | ✅ 全参照元 |
| 22 | `src/core/system.ts`（`getBrowserLanguage`） | `src/core/infrastructure/browser.ts` | ✅ 全参照元 |

---

## 6. 実装手順

1. **まず `tsconfig.json` を確認**：`src/core/@types` や `src/@types` へのパス参照があれば先に更新
2. **型定義ファイルの移動（#1〜#10）**：インポートエラーが最も広く伝播するため最初に実施
3. **`src/core/constants/` → `src/core/config/*/index.ts`（#17〜#18）**
4. **`src/core/system.ts` の分割（#21〜#22）**
5. **`src/core/plugins/` → `src/plugins/`（#19〜#20）**
6. **`src/algorithm/`, `src/guards/`, `src/models/` の移動（#11〜#13）**
7. **`src/utils/` の移動（#14〜#16）**
8. **各ステップで `npm run test` を実行して確認**
9. **`tests/unit/` のテストファイルも同様のディレクトリ構成に合わせて移動**
10. **`docs/ARCHITECTURE.md` の Key Directories テーブルを更新**

---

## 7. 元の問答ログ

<details>
<summary>ヒアリング内容（クリックで展開）</summary>

### Q1. 型定義の分け方

> src/types と src/core/types にしたい気持ちがあります。

### Q2. `src/utils/` の扱い

> A案でいいと思います。`core/` は「Vue/Pinia 以外はOK」と定義して、DOM も許容するのがシンプルでわかりやすいと思います。

### Q3. `src/core/plugins/` の位置

> Aでいいと思います。

### Q4. `src/core/system.ts` の行き先

> Cな感じがします。他にもインフラ層として扱えるものがあるならそこに集約したいですね。
> また、environment.ts という名前も、かなり広い気がするので、ファイル分割も視野に入れて良い気がします。

### Q5. `src/core/constants/` の名前

> Cでもいいと思います。config/ にまとめるのが自然な気がします。

### 追加の要望

> ambient を作ってアンビエント宣言を分けるのは一般的なのかが分からないため少し不安である。これも core/types に入れてしまうのはどうか？（ただし global.d.ts と vue.d.ts は内容的にかなり特殊なので、分けた方がわかりやすい気もする）

</details>

---

## 8. 決定ログ

| 論点 | 決定 | 日付 |
|---|---|---|
| Q1. 型定義の分け方 | `src/types/`（全体）と `src/core/types/`（core内部）に分ける。アンビエント `.d.ts` も同じ `types/` に同居 | 2026-03-02 |
| Q2. utils の扱い | 案 A：`core/` = "No Vue/No Pinia"（DOM 許容）。`src/utils/` を廃止し全て `src/core/utils/` に統合 | 2026-03-02 |
| Q3. plugins の位置 | 案 A：`src/plugins/` に移動（Vue 依存のため core 外へ） | 2026-03-02 |
| Q4. system.ts の行き先 | 案 C 系：`src/core/infrastructure/` へ、`app.ts` と `browser.ts` に分割 | 2026-03-02 |
| Q5. core/constants/ の名前 | 案 C：`src/core/config/*/index.ts` に統合し `constants/` ディレクトリを廃止 | 2026-03-02 |
