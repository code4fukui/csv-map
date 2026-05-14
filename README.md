# csv-map

A web component to display a map with markers based on CSV data.

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

## Demo

- **[Live Demo](https://code4fukui.github.io/csv-map/)**

## Features

- **CSV-Powered:** Renders map markers directly from CSV data.
- **Flexible Data Loading:** Use inline CSV within the HTML tag or link to an external `.csv` file.
- **Automatic Geocoding:** Supports multiple location formats out-of-the-box:
  - Latitude/Longitude columns (`lat`, `lng`).
  - [Geo3x3](https://github.com/taisukef/Geo3x3) codes.
  - GPS coordinates from image EXIF data.
- **Customizable Markers:**
  - Set marker colors, either for all markers or per-row in the CSV.
  - Use custom images for marker icons.
- **Interactive Popups:** Automatically generates a popup with the row's data when a marker is clicked.
- **Map Layers:** Easily switch between standard and satellite map views.
- **Marker Clustering:** Group markers by Geo3x3 zoom level to handle large datasets.
- **Dynamic & Interactive:** Update map data programmatically and listen for marker click events.
- **Extensible:** Extend the component class to create completely custom marker rendering and behavior.

## Usage

### 1. Quick Start

Embed the component by including the script and adding the `<csv-map>` tag to your HTML.

**Option A: Inline CSV Data**

Place your CSV data directly inside the `<csv-map>` element.

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>

<csv-map>
title,lat,lng,color
Fukui Prefectural Office,36.0633,136.219,red
Fukui Station,36.0619,136.222,blue
</csv-map>
```

**Option B: External CSV File**

Use the `src` attribute to point to a CSV file.

```html
<script type="module" src="https://code4fukui.github.io/csv-map/csv-map.js"></script>

<csv-map src="https://code4fukui.github.io/vr-fukui/vr-fukui.csv"></csv-map>
```

## Component API

### Attributes

Customize the map's appearance and behavior with these HTML attributes.

| Attribute    | Description                                                                                             | Example                                                              |
|--------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| `src`        | URL of the external CSV file to load.                                                                   | `src="path/to/data.csv"`                                             |
| `mode`       | Sets the map tile layer. Can be `standard` (default) or `satellite`.                                    | `mode="satellite"`                                                   |
| `level`      | Groups markers by Geo3x3 grid level. Higher numbers mean smaller grid cells (more zoom).                | `level="8"`                                                          |
| `color`      | Default color for all markers. See supported colors below.                                              | `color="green"`                                                      |
| `icon`       | URL for a default custom image to use for all markers.                                                  | `icon="path/to/icon.png"`                                            |
| `iconsize`   | The size (in pixels) for custom image icons.                                                            | `iconsize="40"`                                                      |
| `filter`     | Comma-separated list of columns to show in the popup. If omitted, all columns are shown.                | `filter="title,url"`                                                 |
| `width`      | Sets the width of the map container. Defaults to `100%`.                                                | `width="800px"`                                                      |
| `height`     | Sets the height of the map container. Defaults to `60vh`.                                               | `height="500px"`                                                     |
| `lightmode`  | If `true`, renders markers as simple colored circles instead of pin icons.                              | `lightmode="true"`                                                   |
| `grayscale`  | If `true`, uses a grayscale map theme.                                                                  | `grayscale="true"`                                                   |
| `useimage`   | If `false`, disables fetching image URLs to read EXIF location data.                                    | `useimage="false"`                                                   |

### Properties

You can interact with the component using JavaScript.

- **`.value`**: Set or update the map data programmatically. Accepts a CSV string or a JSON object array.

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

### Events

- **`iconclick`**: Fired when a user clicks on a marker. The event `detail` contains the JSON object for that marker's row.

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

## CSV Data Format

The component automatically detects columns for location, styling, and popup content.

### Location Columns (at least one set is required)

- **Latitude/Longitude:** `lat`, `lng`, `latitude`, `longitude`, `緯度`, `経度`
- **Geo3x3:** `geo3x3`, `Geo3x3`
- **Image with EXIF:** `image`, `photo` (The component will fetch the image and read its GPS metadata).

### Standard Columns (optional)

- **`title`** or **`name`**: Text used for the marker's title and as the popup header.
- **`url`**: A URL to make the popup title a clickable link.
- **`color`**: Sets the color for an individual marker. Overrides the global `color` attribute. Supported colors: `blue`, `green`, `orange`, `yellow`, `red`, `purple`, `violet`.
- **`icon`**: A URL for a custom image to use for an individual marker.

## Advanced Usage

### Marker Clustering

Use the `level` attribute to group dense markers into single points based on their Geo3x3 grid location. This is useful for visualizing large datasets.

```html
<!-- This will group markers within the same Geo3x3 level 8 grid cell -->
<csv-map src="path/to/large-dataset.csv" level="8"></csv-map>
```

### Custom Marker Class

For full control over marker appearance and behavior, you can extend the `CSVMap` class and override the `getMarker(d, ll)` method.

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