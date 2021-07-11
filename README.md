# csv-map

https://code4fukui.github.io/csv-map/

## usage

1. inline

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

2. src

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>
<csv-map src="https://code4fukui.github.io/vr-fukui/vr-fukui.csv"></csv-map>
```
