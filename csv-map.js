import L from "https://code4sabae.github.io/leaflet-mjs/leaflet.mjs";
import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { Geo3x3 } from "https://taisukef.github.io/Geo3x3/Geo3x3.mjs";
import { EXIF } from "https://taisukef.github.io/exif-js/EXIF.js";
import { LeafletSprite } from "https://taisukef.github.io/leaflet.sprite-es/src/sprite.js";
LeafletSprite.init(L);

const omit = (s, len) => {
  if (s.length > len) {
    return s.substring(0, len) + "...";
  }
  return s;
};
const makeTable = (d) => {
  const tbl = [];
  tbl.push("<table>");
  for (const name in d) {
    let val = d[name];
    if (val && (val.startsWith("http://") || val.startsWith("https://"))) {
      val = "<a href=" + val + ">" + omit(val, 30) + "</a>";
    }
    if (val) {
      if (name == "sabaecc:geo3x3") {
        tbl.push(`<tr><th>${name}</th><td><a href=https://code4sabae.github.io/geo3x3-map/#${val}>${val}</a></td></tr>`);
      } else {
        tbl.push(`<tr><th>${name}</th><td>${val}</td></tr>`);
      }
    }
  }
  tbl.push("</table>");
  return tbl.join("");
};

class CSVMap extends HTMLElement {
  constructor () {
    super();
    this.init();
  }
  async init() {
    const getCSV = async () => {
      const fn = this.getAttribute("src");
      if (fn) {
        console.log(fn);
        const data = CSV.toJSON(await CSV.fetch(fn));
        return data;
      }
      const txt = this.textContent.trim();
      const data = CSV.toJSON(CSV.decode(txt));
      this.textContent = "";
      return data;
    };
    this.data = await getCSV();
    console.log(this.data);

    const grayscale = this.getAttribute("grayscale");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://code4sabae.github.io/leaflet-mjs/" + (grayscale ? "leaflet-grayscale.css" : "leaflet.css");
    this.appendChild(link);
    const waitOnload = async (comp) => {
      return new Promise(resolve => {
        comp.onload = resolve;
      });
    };
    await waitOnload(link);

    const div = document.createElement("div");
    this.appendChild(div);
    div.style.width = this.getAttribute("width") || "100%";
    div.style.height = this.getAttribute("height") || "60vh";
    
    this.map = L.map(div);
    // set 国土地理院地図 https://maps.gsi.go.jp/development/ichiran.html
    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
      attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>"',
      maxZoom: 18,
    }).addTo(this.map);

    await this.redraw();
  }
  set value(d) { // JSON or CSV string
    if (typeof d == "string") {
      d = CSV.toJSON(CSV.decode(d));
    }
    this.data = d;
    this.redraw();
  }
  async redraw() {
    const data = this.data;

    const icon = this.getAttribute("icon");
    const iconsize = this.getAttribute("iconsize") || 30;
    const filter = this.getAttribute("filter")?.split(",");
    const allcolor = this.getAttribute("color");

    if (this.iconlayer) {
      this.map.removeLayer(this.iconlayer);
    }
    this.iconlayer = L.layerGroup();
    this.iconlayer.addTo(this.map);

    const lls = [];
    for (const d of data) {
      const getLatLng = async (d) => {
        const geo3x3 = d["sabaecc:geo3x3"] || d["geo3x3"] || d["Geo3x3"];
        if (geo3x3) {
          const pos = Geo3x3.decode(geo3x3);
          if (pos) {
            return [pos.lat, pos.lng];
          }
        }
        const lat = d["schema:latitude"] || d["latitude"] || d["lat"] || d["緯度"] || d["ic:緯度"];
        const lng = d["schema:longitude"] || d["longitude"] || d["lng"] || d["lon"] || d["long"] || d["経度"] || d["ic:経度"];
        if (lat && lng) {
          return [lat, lng];
        }
        const img = d["photo"] || d["image"];
        if (!img) {
          return null;
        }
        const bin = new Uint8Array(await (await fetch(img)).arrayBuffer());
        const exif = EXIF.readFromBinaryFile(bin.buffer);
        if (exif) {
          const ll = EXIF.toLatLng(exif);
          if (ll) {
            return [ll.lat, ll.lng];
          }
        }
        return null;
      };
      const ll = await getLatLng(d);
      if (!ll) {
        continue;
      }
      const title = d["schema:name"] || d["name"];
      const url = d["schema:url"] || d["url"];
      const opt = { title };
      const icon2 = d["photo"] || d["image"] || icon;
      const iconsize2 = iconsize * 2;
      if (icon2) {
        const img = await fetchImage(icon2);
        const size = getResized(img.width, img.height, iconsize2);
        const iconw = size.width;
        const iconh = size.height;
        opt.icon = L.icon({
          iconUrl: icon2,
          iconRetilaUrl: icon2,
          iconSize: [iconw, iconh],
          iconAnchor: [iconw / 2, iconh / 2],
          popupAnchor: [0, -iconh / 2],
        });
      } else {
        const color = d["color"] || allcolor;
        if (LeafletSprite.colors.indexOf(color) >= 0) {
          opt.icon = L.spriteIcon(color);
        }
      }

      const marker = L.marker(ll, opt);

      const d2 = (() => {
        if (!filter) {
          return d;
        }
        const res = {};
        for (const n in d) {
          if (filter.indexOf(n) >= 0) {
            res[n] = d[n];
          }
        }
        return res;
      })();
      const tbl = makeTable(d2);
      marker.bindPopup((title ? (url ? `<a href=${url}>${title}</a>` : title) : "") + tbl);
      this.iconlayer.addLayer(marker);
      lls.push(ll);
    }
    if (lls.length) {
      this.map.fitBounds(lls);
    }
  }
}

customElements.define('csv-map', CSVMap);

export { CSVMap };
