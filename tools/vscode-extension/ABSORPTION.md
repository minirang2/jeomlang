# 공식 리포 흡수 가이드

이 저장소(JEOM VS Code Runner)는 [minirang/jeomlang](https://github.com/minirang/jeomlang)의  
**`tools/vscode-extension/`** 로 옮기는 것을 목표로 정리되어 있습니다.

혹시 모를 상황에 대비하여 만들었습니다.

## 이 저장소 → 흡수 시 매핑

| 현재 (이 리포) | 공식 리포 목적지 |
|----------------|------------------|
| `package.json`, `extension.js` | `tools/vscode-extension/` |
| `syntaxes/`, `snippets/`, `language-configuration.json` | 동일 |
| `assets/` | 이미지 변경 필요 |
| `scripts/install-local-extension.ps1` | 동일 (경로만 조정) |
| `official/cli.js` 등 | **삭제 가능** — 대신 `../../core/cli.js` 참조 |
| `scripts/update-official.js` | 공식 리포에서는 `core/` 직접 사용 또는 sync 스크립트로 대체 |
| `.vscode/` | 개발용 — 공식 리포에선 선택 |
| `ACTIONS_BOT_DEMO.md`, `.github/workflows/actions-bot-demo.yml` | 확장과 무관 — 흡수 시 제외 권장 |

## CLI 경로 (이미 반영됨)

`extension.js`는 아래 순서로 CLI를 찾습니다.

1. 사용자 설정 `jeom.cliPath`
2. 워크스페이스 `core/cli.js` (공식 모노레포 루트를 연 경우)
3. 워크스페이스 `official/cli.js` (이 리포 단독 개발)
4. 확장 설치 폴더 `core/cli.js` / `official/cli.js`

## 흡수 단계 (권장 순서)
1. **PR 1**: `tools/vscode-extension/`에 확장 파일만 복사 (빈 `temp` 제거)
2. **PR 2**: `extension.js`가 `core/cli.js`만 쓰도록 정리, `official/` 번들 제거 여부 결정(
3. **PR 3**: README·Marketplace 메타 맞추기

## 파일 이름 규칙

- 공식과 동일: `cli.js`, `engine.js` (❌ `jeom_cli.js`, `jeom_engine.js`)
- 표준 라이브러리: `stdlib/std.jeom` (❌ `official/std.jeom`은 번들 전용 임시 이름)

## 로컬 설치 (흡수 전)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-local-extension.ps1
```

VS Code 완전 재시작 후 `.jeom` 파일에서 Run 버튼 확인.
