'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {catalog, itemList, buildPlaceData, requestTourism} = require('../lib/tourism.cjs');
const handler = require('../api/tourism.js');
const snapshot = require('../assets/data/busan-tourism.json');

test('all ten places have genuine dated connections with preserved source direction',()=>{
  assert.equal(snapshot.places.length,10);
  for (const place of snapshot.places) {
    assert.ok(catalog.some(item=>item.id===place.id));
    assert.match(place.baseYm,/^\d{6}$/);
    assert.ok(place.hasData && place.related.length);
    assert.equal(place.related.length,new Set(place.related.map(item=>item.id)).size);
    assert.ok(place.related.every(item=>item.name && item.rank > 0));
  }
  assert.equal(snapshot.places.find(p=>p.id==='gamcheon').direction,'incoming');
  assert.equal(snapshot.places.find(p=>p.id==='eulsukdo').registrationName,'을숙도공원');
});

test('reverse connections preserve the origin and do not borrow the destination classification',()=>{
  const target = catalog.find(p=>p.id==='gamcheon');
  const rows = [{tAtsCd:'origin',tAtsNm:'출발지',areaNm:'부산광역시',signguCd:'26110',signguNm:'중구',rlteTatsCd:'destination',rlteTatsNm:'감천문화마을',rlteSignguCd:'26380',rlteSignguNm:'사하구',rlteRegnNm:'부산광역시',rlteCtgryLclsNm:'관광지',rlteRank:'7'}];
  const result = buildPlaceData(target,rows,'202609','2026-10-29');
  assert.equal(result.direction,'incoming');
  assert.equal(result.related[0].name,'출발지');
  assert.equal(result.related[0].rank,7);
  assert.equal(result.related[0].category,'');
  assert.equal(result.district,'사하구');
  assert.equal(buildPlaceData({...target,districtCode:'26110'},rows,'202609','').hasData,false);
});

test('single-item and empty provider responses are supported',()=>{
  assert.deepEqual(itemList({items:''}),[]);
  assert.deepEqual(itemList({items:{item:{name:'one'}}}),[{name:'one'}]);
});

test('provider failures never expose credential-bearing URLs',async()=>{
  const key = 'PRIVATE_TEST_CREDENTIAL';
  await assert.rejects(requestTourism('searchKeyword1',{},key,async url=>{
    assert.equal(url.hostname,'apis.data.go.kr');
    throw new Error(String(url));
  }),error=>error.message==='UPSTREAM_UNAVAILABLE' && !error.message.includes(key));
  await assert.rejects(requestTourism('searchKeyword1',{},key,async()=>({ok:false,status:403})),/ACCESS_DENIED/);
});

function responseRecorder() {
  return {headers:{},statusCode:0,body:'',setHeader(name,value){this.headers[name]=value;},end(value){this.body=value || '';}};
}
test('API refuses arbitrary destinations and write methods; snapshot works without a key',async()=>{
  let response = responseRecorder();
  await handler({url:'/api/tourism?place=https://example.com',method:'GET'},response);
  assert.equal(response.statusCode,404);
  response = responseRecorder();
  await handler({url:'/api/tourism?place=gamcheon',method:'POST'},response);
  assert.equal(response.statusCode,405);
  response = responseRecorder();
  await handler({url:'/api/tourism?place=gamcheon',method:'GET'},response);
  assert.equal(response.statusCode,200);
  assert.equal(JSON.parse(response.body).direction,'incoming');
  assert.equal(JSON.parse(response.body).delivery,'snapshot');
});

test('the saved public dataset never includes the local API key',()=>{
  const path = require('node:path');
  const envPath = path.join(__dirname,'../.env.local');
  if (!fs.existsSync(envPath)) return;
  const key = fs.readFileSync(envPath,'utf8').match(/^TOURISM_API_KEY=(.+)$/m)?.[1]?.trim();
  assert.ok(key);
  for (const file of ['../assets/data/busan-tourism.json','../assets/data/busan-place-catalog.json','../js/busan-tourism.js']) {
    assert.equal(fs.readFileSync(path.join(__dirname,file),'utf8').includes(key),false);
  }
});
