# 황령산 봉수대 모션 카드뉴스

황령산 봉수대의 역사와 야경을 소개하는 5장짜리 4:5 모션 카드뉴스입니다.

## 미리보기

`index.html`을 브라우저에서 열거나, 이 폴더에서 로컬 서버를 실행하세요.

```powershell
python -m http.server 8080
```

그다음 `http://localhost:8080`에 접속합니다. 좌우 화살표 키로 카드를 넘길 수 있습니다.

## 편집

- 문구와 카드 구조: `index.html`
- 색상·레이아웃·모션: `styles.css`
- 카드 전환과 URL 제어: `motion.js`
- 사진: `assets/hwangnyeongsan-night.jpg`
- 픽셀 탐험가 캐릭터: `assets/pixel-explorer.png`

캐릭터 자산은 부산시민공원 카드뉴스 표지의 픽셀 탐험가를 참조해 built-in ImageGen으로 투명 배경 분리했습니다. 최종 프롬프트의 핵심은 “원본의 사파리 모자·올리브색 배낭·바나나·꼬리·노란 캐리어를 유지한 후면 픽셀 캐릭터를 완전한 투명 배경으로 분리하고, 텍스트·로고·사진 배경은 제거”입니다.

## 정지 화면 및 내보내기

- 3번 카드 정지 화면: `index.html?card=3&static=1`
- 카드별 주소를 1080×1350 뷰포트로 열어 PNG 캡처하면 인스타그램 피드용 원본 비율로 저장할 수 있습니다.
- 인쇄할 때는 현재 카드만 1080×1350 비율로 출력됩니다.
- Playwright가 설치된 환경에서는 `node export-pngs.cjs`로 5장의 PNG를 다시 만들 수 있습니다.
- FFmpeg와 Playwright가 설치된 환경에서는 `node export-videos.cjs`로 4초·30fps MP4 5개를 다시 만들 수 있습니다. FFmpeg가 PATH에 없다면 `FFMPEG_PATH` 환경 변수에 실행 파일 경로를 지정하세요.

## 콘텐츠·사진 출처

- 부산광역시 부산시보, 「금련산∼황령산…도시 중심 허파 따라 가볍게 산행」: 황령산 427m, 봉수대의 역사, 부산 전경 소개  
  https://www.busan.go.kr/news/totalnews01/view?curPage=20&dataNo=61667
- 서울신문, 「도시와 산: 부산 황령산」: 조선시대 군사 통신과 임진왜란 당시 봉화 관련 설명  
  https://www.seoul.co.kr/news/plan/mountain/2009/09/28/20090928028002
- 부산 관광 아카이브 사진(부산광역시 제공). 재사용 전 공공누리 표시 조건을 원문에서 다시 확인하세요.

방문 시간·교통·주차 등 운영 정보는 바뀔 수 있으므로 게시 전 최신 현장 안내를 확인하세요.
