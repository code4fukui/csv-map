# csv-map

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A web component to display a map with markers based on CSV data.

## Demo
https://code4fukui.github.io/csv-map/

## Features
- Displays a map with markers based on CSV data
- Supports various data formats like latitude/longitude, Geo3x3 code, and EXIF data from images
- Customizable marker styles and popups
- Can be used as an inline HTML element or with a source CSV file
- Supports satellite map view

## Usage
1. Inline

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>
<csv-map>
title,url,filename,geo3x3
サンドーム福井,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-sundome.jpg,vr-sundome.jpg,E9138732236
サンドーム福井（内部）,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-sundome-inside.jpg,vr-sundome-inside.jpg,E9138732236
福井高専,https://code4fukui.github.io/vr-fukui/vr-view.html#img/vr-fnct.jpg,vr-fnct.jpg,E9138732251953
</csv-map>
```
(position: geo3x3 or lat,lng ...)

2. Source

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>
<csv-map src="https://code4fukui.github.io/vr-fukui/vr-fukui.csv"></csv-map>
```

## License
MIT License