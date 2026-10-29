'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {catalog, requestTourism, buildPlaceData, SOURCE_URL} = require('../lib/tourism.cjs');
const root = path.join(__dirname,'..');
if (fs.existsSync(path.join(root,'.env.local'))) process.loadEnvFile(path.join(root,'.env.local'));
const districts = ['26110','26140','26170','26200','26230','26260','26290','26320','26350','26380','26410','26440','26470','26500','26530','26710'];
async function collect(baseYm, districtCode) {
  let pageNo = 1;
  const rows = [];
  do {
    const response = await requestTourism('areaBasedList1',{baseYm,areaCd:'26',signguCd:districtCode,pageNo:String(pageNo)},process.env.TOURISM_API_KEY);
    rows.push(...response.items);
    if (rows.length >= response.totalCount || !response.items.length) break;
    pageNo++;
    if (pageNo > 20) throw new Error('Unexpected page count');
  } while (true);
  return rows;
}
(async()=>{
  const today = new Date();
  let baseYm = process.argv[2] || `${today.getUTCFullYear()}${String(today.getUTCMonth()).padStart(2,'0')}`;
  if (baseYm.endsWith('00')) baseYm = `${today.getUTCFullYear()-1}12`;
  if (!/^\d{6}$/.test(baseYm)) throw new Error('Use YYYYMM');
  const rows = [];
  for (let start = 0; start < districts.length; start += 3) {
    const batches = await Promise.all(districts.slice(start,start+3).map(district=>collect(baseYm,district)));
    rows.push(...batches.flat());
  }
  if (!rows.length) throw new Error(`No data for ${baseYm}; no snapshot was overwritten.`);
  const fetchedAt = new Date().toISOString();
  const places = catalog.map(place=>buildPlaceData(place,rows,baseYm,fetchedAt));
  const snapshot = {baseYm,fetchedAt,source:'한국관광공사 · 티맵모빌리티',sourceUrl:SOURCE_URL,places};
  fs.writeFileSync(path.join(root,'assets/data/busan-tourism.json'),JSON.stringify(snapshot,null,2)+'\n');
  for (const place of places) console.log(`${place.name}: ${place.registrationName || 'not found'}, ${place.direction}, ${place.related.length} connections`);
  console.log(`Saved ${baseYm} snapshot from ${rows.length} API rows. No API key is included.`);
})().catch(()=>{console.error('Tourism data refresh failed. Existing snapshot was preserved.');process.exitCode=1;});
