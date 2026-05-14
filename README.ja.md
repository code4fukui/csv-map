# csv-map

CSVデータに基づいてマップ上にマーカーを表示するWebコンポーネントです。

## デモ

- **[Live Demo](https://code4fukui.github.io/csv-map/)**

## 機能

- **CSVベース:** CSVデータから直接マップマーカーを描画します。
- **柔軟なデータ読み込み:** HTMLタグ内にインラインでCSVを記述するか、外部の `.csv` ファイルにリンクできます。
- **自動ジオコーディング:** 標準で複数の位置情報フォーマットをサポートします:
  - 緯度/経度の列（`lat`, `lng`）
  - [Geo3x3](https://github.com/taisukef/Geo3x3) コード
  - 画像のEXIFデータから取得したGPS座標
- **カスタマイズ可能なマーカー:**
  - すべてのマーカーに対して、またはCSVの行ごとにマーカーの色を設定できます。
  - マーカーアイコンにカスタム画像を使用できます。
- **インタラクティブなポップアップ:** マーカーをクリックすると、その行のデータを含むポップアップを自動生成します。
- **マップレイヤー:** 標準地図と衛星地図の表示を簡単に切り替えられます。
- **マーカークラスタリング:** Geo3x3のズームレベルでマーカーをグループ化し、大規模なデータセットに対応します。
- **動的かつインタラクティブ:** プログラムからマップデータを更新したり、マーカーのクリックイベントをリッスンしたりできます。
- **拡張性:** コンポーネントクラスを拡張して、マーカーの描画や動作を完全にカスタマイズできます。

## 使い方

### 1. クイックスタート

スクリプトを読み込み、HTMLに `<csv-map>` タグを追加してコンポーネントを埋め込みます。

**オプションA: インラインCSVデータ**

CSVデータを `<csv-map>` 要素内に直接記述します。

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>

<csv-map>
title,lat,lng,color
Fukui Prefectural Office,36.0633,136.219,red
Fukui Station,36.0619,136.222,blue
</csv-map>
```

**オプションB: 外部CSVファイル**

`src` 属性を使用してCSVファイルを指定します。

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>

<csv-map src="https://code4fukui.github.io/vr-fukui/vr-fukui.csv"></csv-map>
```

## コンポーネントAPI

### 属性

これらのHTML属性を使用して、マップの外観と動作をカスタマイズできます。

| 属性    | 説明                                                                 | 例                                                                 |
|--------|----------------------------------------------------------------------|------------------------------------------------------------------|
| `src`  | 読み込む外部CSVファイルのURL。                                                                 | `src="path/to/data.csv"`                                             |
| `mode` | マップのタイルレイヤーを設定します。`standard`（デフォルト）または `satellite` を指定できます。 | `mode="satellite"`                                                   |
| `level`| Geo3x3のグリッドレベルでマーカーをグループ化します。数値が大きいほどグリッドセルが小さくなります（よりズームされます）。 | `level="8"`                                                          |
| `color`| すべてのマーカーのデフォルト色。サポートされている色は後述します。 | `color="green"`                                                      |
| `icon` | すべてのマーカーに使用するデフォルトのカスタム画像のURL。 | `icon="path/to/icon.png"`                                            |
| `iconsize` | カスタム画像アイコンのサイズ（ピクセル単位）。 | `iconsize="40"`                                                      |
| `filter` | ポップアップに表示する列のカンマ区切りリスト。省略した場合はすべての列が表示されます。 | `filter="title,url"`                                                 |
| `width` | マップコンテナの幅を設定します。デフォルトは `100%` です。 | `width="800px"`                                                      |
| `height` | マップコンテナの高さを設定します。デフォルトは `60vh` です。 | `height="500px"`                                                     |
| `lightmode` | `true` の場合、ピンアイコンの代わりにシンプルな色付きの円としてマーカーを描画します。 | `lightmode="true"`                                                   |
| `grayscale` | `true` の場合、グレースケールのマップテーマを使用します。 | `grayscale="true"`                                                   |
| `useimage` | `false` の場合、画像URLを取得してEXIFの位置情報データを読み取る機能を無効にします。 | `useimage="false"`                                                   |

### プロパティ

JavaScriptを使用してコンポーネントを操作できます。

- **`.value`**: プログラムからマップデータを設定または更新します。CSV文字列またはJSONオブジェクトの配列を受け入れます。

```html
<csv-map id="my-map"></csv-map>
<button id="update-btn">Update Data</button>

<script type="module">
  const map = document.getElementById("my-map");
  const btn = document.getElementById("update-btn");

  btn.onclick = () => {
    map.value = [
      { title: "New Point 1", geo3x3: "E9138732236", color: "green" },
      { title: "New Point 2", geo3x3: "E9138732295287", color: "orange" },
    ];
  };
</script>
```

### イベント

- **`iconclick`**: ユーザーがマーカーをクリックしたときに発火します。イベントの `detail` には、そのマーカーの行のJSONオブジェクトが含まれます。

```html
<csv-map id="my-map">
title,lat,lng
My Marker,36.06,136.22
</csv-map>
<div id="output"></div>

<script>
  const map = document.getElementById("my-map");
  const output = document.getElementById("output");

  map.addEventListener("iconclick", (e) => {
    console.log(e.detail); // { title: "My Marker", lat: "36.06", lng: "136.22" }
    output.textContent = "Clicked: " + e.detail.title;
  });
</script>
```

## CSVデータフォーマット

コンポーネントは、位置情報、スタイリング、ポップアップコンテンツの列を自動的に検出します。

### 位置情報列（少なくとも1セットは必須）

- **緯度/経度:** `lat`, `lng`, `latitude`, `longitude`, `緯度`, `経度`
- **Geo3x3:** `geo3x3`, `Geo3x3`
- **EXIF付き画像:** `image`, `photo` （コンポーネントが画像を取得し、GPSメタデータを読み取ります）。

### 標準列（オプション）

- **`title`** または **`name`**: マーカーのタイトルおよびポップアップのヘッダーとして使用されるテキスト。
- **`url`**: ポップアップタイトルをクリック可能なリンクにするためのURL。
- **`color`**: 個々のマーカーの色を設定します。グローバルな `color` 属性を上書きします。サポートされている色: `blue`, `green`, `orange`, `yellow`, `red`, `purple`, `violet`。
- **`icon`**: 個々のマーカーに使用するカスタム画像のURL。

## 高度な使い方

### マーカークラスタリング

`level` 属性を使用すると、Geo3x3のグリッド位置に基づいて密集したマーカーを単一のポイントにグループ化できます。これは大規模なデータセットを可視化する際に便利です。

```html
<!-- This will group markers within the same Geo3x3 level 8 grid cell -->
<csv-map src="path/to/large-dataset.csv" level="8"></csv-map>
```

### カスタムマーカークラス

マーカーの外観と動作を完全に制御するには、`CSVMap` クラスを拡張し、`getMarker(d, ll)` メソッドをオーバーライドできます。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body>

<custom-map src="path/to/data.csv"></custom-map>

<script type="module">
  import { CSVMap } from "https://code4fukui.github.io/csv-map/csv-map.js";
  import L from "https://code4sabae.github.io/leaflet-mjs/leaflet.mjs";
```
