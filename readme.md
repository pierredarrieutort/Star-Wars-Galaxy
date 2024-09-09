# Galaxy

describe the project

## Start project
Simply use `npm run dev` after dependencies installation.

## From Leaflet map to cleaned and formatted dataset
First 

remercier le dude

1. Retrieve the [website](https://otherlife.davidcanavese.com/galaxymap2/) source code simply using [CTRL+U](view-source:https://otherlife.davidcanavese.com/galaxymap2/).
An example of an old page save is located at `/data-preparation/extracted_source_files/old_extracted_index.html`.
2. Split data like in this folder : `/data-preparation/extracted_source_files/data-splitting`.





# How it works ?

1. Copy function from `./data-preparation/helpers/leafletToGeoJSON.ts`.
2. Paste in the console of the desired leaflet map.
3. Execute the function `exportToGeoJSON()` by default.
4. Copy the function output in `./data-preparation/data/raw_geojson_from_leaflet.json` file.

---

## Then, you have two possibilities of file import

### Static data already treated
<!-- Make sure you imported the desired dataset in the following file : `./src/Experience/World/Planets.js`.

1. How to use `preCleanedData.ts`  ?
````ts
import preCleanedData from '../../data-preparation/data/preCleanedData.ts'
````
Warning : The purpose of preCleanedData.ts is to deal with a dataset already clean and without known issue.
If you prefer to deal with fresh extracted data, you must use `raw_geojson_from_leaflet.json`.

**OR**

2. How to use `index.ts`  ?
````ts
import preCleanedData from '../../data-preparation/index.ts'
````
To work with a fresh Leaflet extract, replace this import in the target file by the index.ts of data-preparation folder.


How to refresh this file ?
When using the index.js file, log its export result, then copy-paste it here.

What this file is used for ?
This file is used when want to use mocked data bypassing
the extract process pipeline from a raw data extract
and when want to immediately view object structure.

### Live handling pipe
````ts
import preCleanedData from '../../data-preparation/index.ts'
````

#### What's happens when you work with the handling pipe
1. The handling pipe calls `./data/raw_geojson_from_leaflet.json`.
2. The pipe follows multiple steps to properly render the data.

---

To know the last extract time, check the last huge data update of `./data/raw_geojson_from_leaflet.json` file. -->
