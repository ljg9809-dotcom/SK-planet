'use strict';
const catalog = require('../assets/data/busan-place-catalog.json');
const SOURCE_URL = 'https://www.data.go.kr/data/15128560/openapi.do';
const normalizeName = value => String(value || '').normalize('NFKC').replace(/[\s·ㆍ()\[\]_-]/g, '');
const matches = (name, place) => place.aliases.some(alias => normalizeName(alias) === normalizeName(name));

function itemList(body) {
  const rows = body?.items?.item;
  if (!rows) return [];
  return Array.isArray(rows) ? rows : [rows];
}

async function requestTourism(operation, params, key, fetcher = fetch) {
  if (!key) throw new Error('KEY_MISSING');
  const url = new URL(`https://apis.data.go.kr/B551011/TarRlteTarService1/${operation}`);
  url.search = new URLSearchParams({serviceKey:key, MobileOS:'WEB', MobileApp:'BusangiPortfolio', _type:'json', numOfRows:'1000', pageNo:'1', ...params});
  let response;
  try { response = await fetcher(url, {signal:AbortSignal.timeout(10000)}); }
  catch { throw new Error('UPSTREAM_UNAVAILABLE'); }
  if (!response.ok) throw new Error(response.status === 403 ? 'ACCESS_DENIED' : 'UPSTREAM_UNAVAILABLE');
  let data;
  try { data = await response.json(); } catch { throw new Error('UPSTREAM_INVALID'); }
  const code = String(data.response?.header?.resultCode || '');
  if (!['0000','00','03'].includes(code)) throw new Error('UPSTREAM_REJECTED');
  return {items:itemList(data.response?.body), totalCount:Number(data.response?.body?.totalCount || 0)};
}

function buildPlaceData(place, rows, baseYm, fetchedAt) {
  const outgoing = rows.filter(row => matches(row.tAtsNm, place) && row.signguCd === place.districtCode);
  const incoming = rows.filter(row => matches(row.rlteTatsNm, place) && row.rlteSignguCd === place.districtCode);
  const direction = outgoing.length ? 'outgoing' : 'incoming';
  const chosen = direction === 'outgoing' ? outgoing : incoming;
  const seen = new Set();
  const related = chosen.map(row => {
    const outgoing = direction === 'outgoing';
    return {
      id:outgoing ? row.rlteTatsCd : row.tAtsCd,
      name:outgoing ? row.rlteTatsNm : row.tAtsNm,
      region:outgoing ? row.rlteRegnNm : row.areaNm,
      district:outgoing ? row.rlteSignguNm : row.signguNm,
      category:outgoing ? row.rlteCtgryLclsNm : '',
      subcategory:outgoing ? row.rlteCtgrySclsNm : '',
      rank:Number(row.rlteRank) || null
    };
  }).filter(item => {
    if (!item.id || !item.name || seen.has(item.id)) return false;
    seen.add(item.id); return true;
  }).sort((a,b) => (a.rank || 999) - (b.rank || 999) || a.name.localeCompare(b.name,'ko'));
  const identity = outgoing[0] || incoming[0];
  const registrationName = outgoing[0]?.tAtsNm || incoming[0]?.rlteTatsNm || null;
  const targetRow = incoming[0];
  return {
    id:place.id, name:place.name, registrationName,
    tourismId:outgoing[0]?.tAtsCd || incoming[0]?.rlteTatsCd || null,
    region:outgoing[0]?.areaNm || incoming[0]?.rlteRegnNm || '부산광역시',
    district:outgoing[0]?.signguNm || incoming[0]?.rlteSignguNm || '',
    category:[targetRow?.rlteCtgryLclsNm,targetRow?.rlteCtgryMclsNm,targetRow?.rlteCtgrySclsNm].filter((v,i,a)=>v&&a.indexOf(v)===i),
    baseYm, fetchedAt, direction, related, hasData:Boolean(identity), sourceUrl:SOURCE_URL
  };
}

module.exports = {catalog, SOURCE_URL, normalizeName, matches, itemList, requestTourism, buildPlaceData};
