# Bundled JEOM core (standalone extension)

이 폴더는 [minirang/jeomlang](https://github.com/minirang/jeomlang)의 다음 파일 **사본**입니다.

| 여기 (`official/`) | 공식 리포 |
|--------------------|-----------|
| `cli.js` | `core/cli.js` |
| `engine.js` | `core/engine.js` |
| `std.jeom` | `stdlib/std.jeom` |

공식 리포에 흡수되면 확장은 워크스페이스 루트의 `core/cli.js`를 우선 사용하고,  
Marketplace/로컬 설치용으로만 이 사본을 번들에 포함할 수 있습니다.

갱신: `npm run update-jeom` (공식 사이트 CDN에서 다운로드)
