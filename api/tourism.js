'use strict';
const snapshot = require('../assets/data/busan-tourism.json');
const {catalog, requestTourism, buildPlaceData} = require('../lib/tourism.cjs');
const cache = new Map();
const TTL = 6 * 60 * 60 * 1000;

async function getPlace(id) {
  const place = catalog.find(item=>item.id === id);
  if (!place) return null;
  const saved = snapshot.places.find(item=>item.id === id);
  const cached = cache.get(id);
  if (cached && cached.expires > Date.now()) return cached.data;
  // This service only searches origin names. Reverse links require the citywide snapshot.
  if (!process.env.TOURISM_API_KEY || saved.direction === 'incoming') {
    return {...saved,delivery:'snapshot'};
  }
  try {
    const result = await requestTourism('searchKeyword1', {
      baseYm:snapshot.baseYm,areaCd:'26',signguCd:place.districtCode,
      keyword:saved.registrationName || place.name
    },process.env.TOURISM_API_KEY);
    const fresh = buildPlaceData(place,result.items,snapshot.baseYm,new Date().toISOString());
    if (!fresh.hasData) throw new Error('NO_MATCH');
    if (!fresh.category.length) fresh.category = saved.category;
    const data = {...fresh,delivery:'live'};
    cache.set(id,{data,expires:Date.now()+TTL});
    return data;
  } catch {
    // Never send upstream errors or credential-bearing request URLs to the browser.
    const data = {...saved,delivery:'snapshot'};
    cache.set(id,{data,expires:Date.now()+60000});
    return data;
  }
}

async function handler(req,res) {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (!['GET','HEAD'].includes(req.method)) {
    res.setHeader('Allow','GET, HEAD');res.statusCode=405;
    return res.end(JSON.stringify({error:'허용되지 않은 요청입니다.'}));
  }
  const id = new URL(req.url,'http://localhost').searchParams.get('place');
  const data = await getPlace(id);
  if (!data) {res.statusCode=404;return res.end(JSON.stringify({error:'등록되지 않은 장소입니다.'}));}
  res.setHeader('Cache-Control','public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode=200;
  res.end(req.method==='HEAD' ? undefined : JSON.stringify(data));
}
module.exports = handler;
module.exports.getPlace = getPlace;
