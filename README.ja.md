# csv-map

CSV形式のデータを使ってマップを表示するWebコンポーネントです。

## デモ
https://code4fukui.github.io/csv-map/

## 機能
- CSVデータからマップを表示
- 位置情報(緯度経度、Geo3x3)に基づいてマーカーを配置
- マーカーをクリックするとポップアップを表示
- 表示モード(通常/衛星写真)の切り替え
- レベル(Zoom)指定でGeo3x3領域ごとにマーカー表示

## 使い方

1. インライン

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>
<csv-map>
title,url,filename,geo3x3
サンドーム福井,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-sundome.jpg,vr-sundome.jpg,E9138732236
サンドーム福井（内部）,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-sundome-inside.jpg,vr-sundome-inside.jpg,E9138732236
福井高専,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-fnct.jpg,vr-fnct.jpg,E9138732251953
</csv-map>
```

2. 外部ファイルから

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>
<csv-map src="https://code4fukui.github.io/vr-fukui/vr-fukui.csv"></csv-map>
```

## ライセンス
MIT License