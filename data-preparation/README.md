# How it works ?

1. Copy function from `./helpers/leafletToGeoJSON.ts`.
2. Paste in the console of the desired leaflet map.
3. Execute the function `exportToGeoJSON()` by default.
4. Copy the function output in `./data/raw_geojson_from_leaflet.json` file.

---

## Then, you have two possibilities of file import

### Static data already treated
````ts
import preCleanedData from '../../data-preparation/data/preCleanedData.ts'
````

### Live handling pipe
````ts
import preCleanedData from '../../data-preparation/index.ts'
````

#### What's happens when you work with the handling pipe
1. The handling pipe calls `./data/raw_geojson_from_leaflet.json`.
2. The pipe follows multiple steps to properly render the data.

---

To know the last extract time, check the last huge data update of `./data/raw_geojson_from_leaflet.json` file.
