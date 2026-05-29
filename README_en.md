# JeomLang (점랭)

<p align="center">
  <img src="assets/img/logo_animated.svg" alt="Jeom Logo" width="96">
</p>

<p align="center">
  <a href="https://jeomlang.vercel.app/">홈페이지</a> ·
  <a href="https://jeomlang.vercel.app/ide">웹 IDE</a> ·
  <a href="docs/GRAMMAR.md">문법 레퍼런스</a> ·
  <a href="docs/SPEC.md">언어 명세</a> ·
  <a href="docs/CHANGELOG.md">변경 이력</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-v1.5.2-blue" alt="version">
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="license">
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node">
</p>


> 점 유니코드 문자 **16종**만으로 프로그래밍하는 난해 언어  
> 파일 확장자: `.jeom`

-----

## 개요

**점랭(jeomlang)** 은 유니코드의 “점” 계열 문자만으로 모든 코드를 작성하는 난해 프로그래밍 언어입니다.  
난해하지만 **함수 · 재귀 · 배열 · 딕셔너리 · 오류처리 · 람다 · 고차함수 · 모듈**을 갖춘 완전한 언어입니다.

단일 엔진 파일(`core/engine.js`)이 브라우저 웹 IDE와 Node.js CLI를 모두 구동합니다.

-----

## 파일 구조

```
jeomlang/
├── core/
│   ├── engine.js          ← 공용 JS 엔진 (렉서+파서+VM, UMD)
│   └── cli.js             ← Node.js CLI
├── ide/
│   ├── index.html         ← 웹 IDE
│   ├── ide.css
│   ├── src/ide.ts         ← TypeScript 소스
│   └── dist/ide.js        ← 빌드 결과
├── home/
│   ├── index.html         ← 메인 페이지
│   ├── index.js
│   └── style.css
├── assets/img/            ← 로고 이미지
├── stdlib/std.jeom        ← 표준 라이브러리
├── examples/              ← 예제 파일
├── docs/                  ← 문서
├── shared/
│   └── custom-elements.js ← 공용 웹 컴포넌트 (<jeom-version>)
└── tools/
    ├── formatter/
    │   └── formatter.py   ← 코드 포맷터
    ├── language-support/  ← 하이라이터, Linguist
    └── vscode-extension/  ← VS Code 확장
```

-----

## 빠른 시작

### 웹 IDE

<https://jeomlang.vercel.app/ide> 에서 바로 사용할 수 있습니다.

### CLI 설치 (Node.js 18+)

```bash
npm install -g jeomlang
jeom run hello.jeom
```

또는 로컬 클론:

```bash
git clone https://github.com/minirang/jeomlang.git
cd jeomlang
node core/cli.js run examples/hello.jeom
```

### CLI 명령

```bash
jeom run <파일.jeom>          # 실행
jeom check <파일.jeom>        # 문법 검사
jeom repl                     # 대화형 REPL
jeom encode "Hello"           # 문자열 → 점 인코딩
jeom encode-num 42            # 정수 → 점 인코딩
jeom encode-float 3.14        # 소수 → 점 인코딩
jeom decode "•·.·.•"          # 점 코드 → 값
jeom tokens <파일.jeom>       # 토큰 목록
jeom ast <파일.jeom>          # AST 출력
jeom ops                      # 전체 명령 토큰
jeom new <파일.jeom>          # 새 파일 생성
jeom version                  # 버전 확인
```

-----

## 점 문자 16종

|기호 |유니코드  |용도               |
|:-:|------|-----------------|
|`.`|U+002E|0비트              |
|`·`|U+00B7|1비트              |
|`˙`|U+02D9|함수 관련            |
|`•`|U+2022|숫자 리터럴 구분자       |
|`․`|U+2024|명령 조합            |
|`‥`|U+2025|반복 · 오류 · 소수점 구분자|
|`…`|U+2026|조건 분기            |
|`‧`|U+2027|문자열 바이트 구분자      |
|`∘`|U+2218|변수               |
|`⋅`|U+22C5|산술 · 논리          |
|`●`|U+25CF|문자열 리터럴 구분자      |
|`◦`|U+25E6|배열 · 딕셔너리        |
|`⦁`|U+2981|스택 조작            |
|`⸳`|U+2E33|타입 변환            |
|`⋮`|U+22EE|블록               |
|`⋯`|U+22EF|파일 · 모듈          |
|`◘`|U+25D8|주석               |

-----

## 리터럴 인코딩

**정수**: `•<이진수>•` — `.`=0, `·`=1, big-endian  
예: `••`=0, `•·•`=1, `•·.·•`=5, `•·.·.•`=10

**소수**: `•<정수부>‥<소수부>•`  
예: `•·‥·•`=1.5, `•··‥.·•`=3.25, `•‥·•`=0.5

**문자열**: `●<UTF-8 바이트>●` — 바이트 경계 `‧`, 각 바이트 8비트  
예: `●.·..·...‧.··.·..·●` = “Hi”

-----

## 코드 예제

### Hello World

```jeom
◘ Hello, Jeom!
•·
  ●.·..·...‧.··..·.·‧.··.··..‧.··.··..‧.··.····‧..·.··..‧..·.....‧.·..·.·.‧.··..·.·‧.··.····‧.··.··.·‧..·....·●
  ··
⋮⋮
```

### 팩토리얼 (재귀) — 5! = 120

```jeom
˙ ·∘·
˙∘ ·
⋮
  ∘∘ ·
  •·•
  ⋅‧∘∘
  …
  ⋮
    •·• ˙˙
  ⋮⋮
  ∘∘ ·
  ∘∘ ·
  •·•
  ⋅⋅
  ˙˙˙ ·∘·
  ⋅⋅⋅
  ˙˙
⋮⋮

•·
  •·.·•
  ˙˙˙ ·∘·
  ··
⋮⋮
```

더 많은 예제는 [`examples/`](examples/) 폴더를 참고하세요.

-----

## 포맷터

JS 엔진으로 파싱 후 Python이 포맷 출력합니다. `node`가 PATH에 있어야 합니다.

```bash
python3 tools/formatter/formatter.py hello.jeom           # hello.fmt.jeom 생성
python3 tools/formatter/formatter.py hello.jeom -r        # 포맷 후 원본 삭제
python3 tools/formatter/formatter.py hello.jeom -o out.jeom
python3 tools/formatter/formatter.py hello.jeom --check   # 포맷 필요 여부 확인
python3 tools/formatter/formatter.py *.jeom               # 여러 파일
```

-----

## 표준 라이브러리

```jeom
●.···..··‧.···.·..‧.··..·..‧.··.··..‧.··.·..·‧.··...·.‧..·.····‧.···..··‧.···.·..‧.··..·..‧..·.···.‧.··.·.·.‧.··..·.·‧.··.····‧.··.··.·●
⋯·⦁
```

|함수 토큰  |설명         |
|-------|-----------|
|`·∘∘`  |배열 오름차순 정렬 |
|`·∘·`  |배열 최댓값     |
|`·∘··` |배열 최솟값     |
|`·∘∘∘` |배열 합계      |
|`·∘·∘` |배열 역순      |
|`·∘··∘`|배열 포함 여부   |
|`·∘∘·` |배열 → 문자열 연결|

-----

## 엔진 API

```js
const {
  encodeString,   // 문자열 → 점 리터럴
  encodeNumber,   // 정수   → 점 리터럴
  encodeFloat,    // 소수   → 점 리터럴
  decodeString,   // 점 리터럴 → 문자열
  decodeNumber,   // 점 리터럴 → 숫자 (정수/소수 모두)
  tokenize,
  parse,
  JeomVM,
} = require('./core/engine.js');

const vm = new JeomVM({
  stdout: s => process.stdout.write(s),
  stderr: s => process.stderr.write(s),
  stdin:  () => Promise.resolve(''),
  readFile:   path => fs.promises.readFile(path, 'utf8'),
  writeFile:  (path, s) => fs.promises.writeFile(path, s),
  fileExists: path => fs.promises.access(path).then(() => true, () => false),
});

await vm.run(sourceCode);
```

-----

## VS Code 확장

[`tools/vscode-extension/`](tools/vscode-extension/) 에 포함되어 있습니다.  
구문 강조, 코드 스니펫, 언어 설정을 제공합니다.

-----

## 기여

[<CONTRIBUTING.md>](CONTRIBUTING.md) 를 참고해 주세요.

-----

## 라이선스

[Apache License 2.0](LICENSE)

-----

## 언어 이름 유의사항

jeomlang, jeom, JeomLang, JEOM, JEOMLANG, Jeomlang, Jeom, 점랭 만이 이 언어를 나타내는 말입니다.


----

## README.md English version

----

JeomLang

<p align="center">
  <img src="assets/img/logo_animated.svg" alt="Jeom Logo" width="96">
</p>
<p align="center">
  <a href="https://jeomlang.vercel.app/">Homepage</a> ·
  <a href="https://jeomlang.vercel.app/ide">Web IDE</a> ·
  <a href="docs/GRAMMAR.md">Grammar Reference</a> ·
  <a href="docs/SPEC.md">Language Specification</a> ·
  <a href="docs/CHANGELOG.md">Changelog</a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/version-v1.5.2-blue" alt="version">
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="license">
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node">
</p>

An esoteric programming language written using only 16 Unicode dot characters
File extension: .jeom

⸻

Overview

JeomLang (점랭) is an esoteric programming language where every program is written entirely using Unicode “dot” characters.
Despite its unusual syntax, it is a fully capable language supporting functions, recursion, arrays, dictionaries, error handling, lambdas, higher-order functions, and modules.

A single shared engine file (core/engine.js) powers both the browser-based web IDE and the Node.js CLI.

⸻

Project Structure

jeomlang/
├── core/
│   ├── engine.js          ← Shared JS engine (lexer + parser + VM, UMD)
│   └── cli.js             ← Node.js CLI
├── ide/
│   ├── index.html         ← Web IDE
│   ├── ide.css
│   ├── src/ide.ts         ← TypeScript source
│   └── dist/ide.js        ← Build output
├── home/
│   ├── index.html         ← Main page
│   ├── index.js
│   └── style.css
├── assets/img/            ← Logo images
├── stdlib/std.jeom        ← Standard library
├── examples/              ← Example programs
├── docs/                  ← Documentation
├── shared/
│   └── custom-elements.js ← Shared web component (<jeom-version>)
└── tools/
    ├── formatter/
    │   └── formatter.py   ← Code formatter
    ├── language-support/  ← Highlighter, Linguist
    └── vscode-extension/  ← VS Code extension

⸻

Quick Start

Web IDE

Use it directly at:

https://jeomlang.vercel.app/ide

CLI Installation (Node.js 18+)

npm install -g jeomlang
jeom run hello.jeom

Or clone locally:

git clone https://github.com/minirang/jeomlang.git
cd jeomlang
node core/cli.js run examples/hello.jeom

CLI Commands

jeom run <file.jeom>          # Execute program
jeom check <file.jeom>        # Syntax check
jeom repl                     # Interactive REPL
jeom encode "Hello"           # String → dot encoding
jeom encode-num 42            # Integer → dot encoding
jeom encode-float 3.14        # Float → dot encoding
jeom decode "•·.·.•"          # Dot code → value
jeom tokens <file.jeom>       # Print token list
jeom ast <file.jeom>          # Print AST
jeom ops                      # Show all command tokens
jeom new <file.jeom>          # Create new file
jeom version                  # Show version

⸻

16 Dot Characters

Symbol	Unicode	Purpose
.	U+002E	0 bit
·	U+00B7	1 bit
˙	U+02D9	Function-related
•	U+2022	Number literal delimiter
․	U+2024	Command composition
‥	U+2025	Loop / error / decimal separator
…	U+2026	Conditional branching
‧	U+2027	String byte separator
∘	U+2218	Variables
⋅	U+22C5	Arithmetic / logic
●	U+25CF	String literal delimiter
◦	U+25E6	Arrays / dictionaries
⦁	U+2981	Stack operations
⸳	U+2E33	Type conversion
⋮	U+22EE	Blocks
⋯	U+22EF	Files / modules
◘	U+25D8	Comments

⸻

Literal Encoding

Integer: •<binary>• — .=0, ·=1, big-endian
Example: ••=0, •·•=1, •·.·•=5, •·.·.•=10

Float: •<integer>‥<fraction>•
Example: •·‥·•=1.5, •··‥.·•=3.25, •‥·•=0.5

String: ●<UTF-8 bytes>● — byte separator ‧, each byte uses 8 bits
Example: ●.·..·...‧.··.·..·● = “Hi”

⸻

Code Examples

Hello World

◘ Hello, Jeom!
•·
  ●.·..·...‧.··..·.·‧.··.··..‧.··.··..‧.··.····‧..·.··..‧..·.....‧.·..·.·.‧.··..·.·‧.··.····‧.··.··.·‧..·....·●
  ··
⋮⋮

Factorial (Recursion) — 5! = 120

˙ ·∘·
˙∘ ·
⋮
  ∘∘ ·
  •·•
  ⋅‧∘∘
  …
  ⋮
    •·• ˙˙
  ⋮⋮
  ∘∘ ·
  ∘∘ ·
  •·•
  ⋅⋅
  ˙˙˙ ·∘·
  ⋅⋅⋅
  ˙˙
⋮⋮
•·
  •·.·•
  ˙˙˙ ·∘·
  ··
⋮⋮

See the examples/ directory for more examples.

⸻

Formatter

The source is parsed using the JS engine and formatted output is generated by Python.
node must be available in PATH.

python3 tools/formatter/formatter.py hello.jeom           # Generate hello.fmt.jeom
python3 tools/formatter/formatter.py hello.jeom -r        # Replace original file
python3 tools/formatter/formatter.py hello.jeom -o out.jeom
python3 tools/formatter/formatter.py hello.jeom --check   # Check formatting status
python3 tools/formatter/formatter.py *.jeom               # Multiple files

⸻

Standard Library

●.···..··‧.···.·..‧.··..·..‧.··.··..‧.··.·..·‧.··...·.‧..·.····‧.···..··‧.···.·..‧.··..·..‧..·.···.‧.··.·.·.‧.··..·.·‧.··.····‧.··.··.·●
⋯·⦁

Function Token	Description
·∘∘	Sort array ascending
·∘·	Maximum value in array
·∘··	Minimum value in array
·∘∘∘	Array sum
·∘·∘	Reverse array
·∘··∘	Array contains check
·∘∘·	Join array into string

⸻

Engine API

const {
  encodeString,   // String  → dot literal
  encodeNumber,   // Integer → dot literal
  encodeFloat,    // Float   → dot literal
  decodeString,   // Dot literal → string
  decodeNumber,   // Dot literal → number (int/float)
  tokenize,
  parse,
  JeomVM,
} = require('./core/engine.js');
const vm = new JeomVM({
  stdout: s => process.stdout.write(s),
  stderr: s => process.stderr.write(s),
  stdin:  () => Promise.resolve(''),
  readFile:   path => fs.promises.readFile(path, 'utf8'),
  writeFile:  (path, s) => fs.promises.writeFile(path, s),
  fileExists: path => fs.promises.access(path).then(() => true, () => false),
});
await vm.run(sourceCode);

⸻

VS Code Extension

Included in tools/vscode-extension/.
Provides syntax highlighting, snippets, and language configuration.

⸻

Contributing

See <CONTRIBUTING.md>.

⸻

License

Apache License 2.0

⸻

Naming Notice

Only the following names refer to this language:

jeomlang, jeom, JeomLang, JEOM, JEOMLANG, Jeomlang, Jeom, 점랭