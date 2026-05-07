# jeomlang

<p align="center">
  <img src="logo_animated.svg" alt="Jeom Logo" width="96">
</p>


> 점 유니코드 문자 **16종**만으로 프로그래밍하는 난해 언어  
> 파일 확장자: `.jeom` · 버전: `1.1.0`

-----

## 개요

**점(Jeom)** 은 유니코드의 “점” 계열 문자만으로 모든 코드를 작성하는 난해 프로그래밍 언어입니다.  
브레인퍽처럼 난해하지만 **함수 · 재귀 · 배열 · 딕셔너리 · 오류처리 · 파일시스템 · 모듈**을 갖춘 완전한 언어입니다.

**공용 엔진(`jeom_engine.js`)** 하나로 브라우저 HTML IDE와 Node.js CLI를 모두 구동합니다.  
**Python 엔진(`jeom/`)** 도 동일 스펙으로 동작합니다.

-----

## 파일 구조

```
jeom_lang/
├── jeom_engine.js       ← 공용 JS 엔진 (렉서+파서+VM, UMD)
├── jeom_cli.js          ← Node.js CLI
├── jeom_ide.html        ← 브라우저 웹 IDE (독립 실행)
├── jeom_ide.css         ← IDE 스타일시트
├── jeom_ide.js          ← IDE 로직
├── jeom/                ← Python 엔진 패키지
│   ├── lexer.py
│   ├── parser.py
│   └── interpreter.py
├── stdlib/
│   └── std.jeom         ← 표준 라이브러리
├── examples/
│   ├── hello.jeom
│   ├── fizzbuzz.jeom
│   └── factorial.jeom
├── logo.svg
├── logo_animated.svg
├── SPEC.md              ← 언어 명세서
└── README.md
```

-----

## 빠른 시작

### 웹 IDE

`jeom_ide.html`을 브라우저로 열면 끝 — 서버 불필요.

### CLI (Node.js 18+)

```bash
node jeom_cli.js run hello.jeom        # 실행
node jeom_cli.js check hello.jeom      # 문법 검사
node jeom_cli.js repl                  # 대화형 REPL
node jeom_cli.js encode "Hello"        # 문자열 → 점 인코딩
node jeom_cli.js encode-num 42         # 숫자 → 점 인코딩
node jeom_cli.js decode "•·.·.•"       # 점 코드 → 값
node jeom_cli.js tokens hello.jeom     # 토큰 목록
node jeom_cli.js ast hello.jeom        # AST 출력
node jeom_cli.js ops                   # 전체 명령 토큰
node jeom_cli.js new myfile.jeom       # 새 파일 생성
```

### Python 엔진

```bash
python3 -c "from jeom import run_source; run_source(open('hello.jeom').read())"
```

-----

## 점 문자 16종

|기호 |유니코드  |이름                         |역할            |
|---|------|---------------------------|--------------|
|`.`|U+002E|FULL STOP                  |0비트           |
|`·`|U+00B7|MIDDLE DOT                 |1비트           |
|`˙`|U+02D9|DOT ABOVE                  |함수 관련         |
|`•`|U+2022|BULLET                     |숫자 리터럴 구분자    |
|`․`|U+2024|ONE DOT LEADER             |—             |
|`‥`|U+2025|TWO DOT LEADER             |반복/오류         |
|`…`|U+2026|HORIZONTAL ELLIPSIS        |조건 분기         |
|`‧`|U+2027|HYPHENATION POINT          |문자열 바이트 구분자   |
|`∘`|U+2218|RING OPERATOR              |변수            |
|`⋅`|U+22C5|DOT OPERATOR               |산술/논리         |
|`●`|U+25CF|BLACK CIRCLE               |문자열 리터럴 구분자   |
|`◦`|U+25E6|WHITE BULLET               |배열/딕셔너리       |
|`⦁`|U+2981|Z NOTATION SPOT            |스택 조작         |
|`⸳`|U+2E33|RAISED DOT                 |타입 변환         |
|`⋮`|U+22EE|VERTICAL ELLIPSIS          |블록            |
|`⋯`|U+22EF|MIDLINE HORIZONTAL ELLIPSIS|파일/모듈         |
|`◘`|U+25D8|INVERSE BULLET             |**주석** (줄 끝까지)|

-----

## 실행 모델

스택 기반 VM (Stack-based Virtual Machine)

- **숫자 리터럴**: `•<이진수>•` (`.`=0, `·`=1)  
  예: `•·.·•` = `101₂` = **5**, `••` = **0**
- **문자열 리터럴**: `●<UTF-8 바이트>●` (바이트 경계: `‧`)  
  예: `●.·......·‧.··.·..·●` = “Hi”
- **진입점**: `•·` … `⋮⋮`
- **블록**: `⋮` … `⋮⋮`
- **주석**: `◘` 이후 줄 끝까지
- **STORE** (`∘⋅ <이름>`): 스택 최상단 팝 → 변수 저장  
  (VAR `∘ <이름> <값>` 과 달리 스택에서 꺼냄)

-----

## 코드 예제

### Hello World

```jeom
•·
  ●.·......·‧.·.....·‧··..··.·‧··..··.·‧···..··‧..·.····‧..·····.‧·.....·.‧.·.....·‧.·......·‧··.·····●
  ··
⋮⋮
```

> 💡 REPL에서 `.enc "Hello, Jeom!"` 입력하면 자동 인코딩

### 변수와 연산

```jeom
•·
  ∘ · •·.·.•    ◘ a = 10
  ∘ ·· •··•     ◘ b = 3
  ∘∘ ·  ∘∘ ··  ⋅  ··   ◘ 13
  ∘∘ ·  ∘∘ ··  ⋅⋅ ··   ◘ 7
  ∘∘ ·  ∘∘ ··  ⋅⋅⋅ ··  ◘ 30
⋮⋮
```

### 함수 정의와 호출

```jeom
˙ ·∘·∘    ◘ 함수 이름
˙∘ ·       ◘ 인자 a
˙∘ ··      ◘ 인자 b
⋮
  ∘∘ ·  ∘∘ ··  ⋅  ˙˙
⋮⋮

•·
  •···•  •·.·•   ◘ 7, 5
  ˙˙˙ ·∘·∘       ◘ call → 12
  ··
⋮⋮
```

### WHILE 반복 (1~5)

```jeom
•·
  ∘ · •·•
  ‥‥
  ⋮  ∘∘ ·  •··.•  ⋅‧‧‧  ⋮⋮
  ⋮
    ∘∘ ·  ··
    ∘∘ ·  •·•  ⋅  ∘⋅ ·   ◘ i++
  ⋮⋮
⋮⋮
```

### 오류 처리

```jeom
•·
  ‥·
  ⋮  •·.·.•  ••  ⋅∘  ··  ⋮⋮
  ‥··
  ⋮
    ∘⋅ ·∘           ◘ 에러 메시지 저장
    ●(오류: )●
    ∘∘ ·∘  ⋅  ··
  ⋮⋮
  ‥·˙
  ⋮  ●(완료)●  ··  ⋮⋮
⋮⋮
```

### 배열

```jeom
•·
  •·.·.•  •·.·..•  •····.•  •··•  ◦   ◘ [10,20,30]
  ∘⋅ ·
  ∘∘ ·  ••  ◦◦  ··     ◘ arr[0] = 10
  ∘∘ ·  •···•  ◦∘  ··  ◘ append 7
  ∘∘ ·  ⸳‧  ··          ◘ len = 4
⋮⋮
```

### 딕셔너리

```jeom
•·
  ●(name)●  ●(jeom)●
  ●(ver)●   •·•
  •·.•
  ◦‧              ◘ {name:jeom, ver:1}
  ∘⋅ ·
  ∘∘ ·  ●(name)●  ◦‧‧  ··   ◘ jeom
⋮⋮
```

### 모듈 임포트

```jeom
●(stdlib/std.jeom)●
⋯·⦁                    ◘ IMPORT

•·
  •··•  •·.•  •·.·•  •··•  ◦
  ˙˙˙ ·∘∘               ◘ sort([3,2,5,3])
  ··
⋮⋮
```

-----

## 명령 토큰 요약

|토큰    |명령       ||토큰     |명령     |
|------|---------||-------|-------|
|`·`   |PRINT    ||`··`   |PRINTLN|
|`·˙`  |INPUT    ||`·˙˙`  |INPUTN |
|`∘`   |VAR      ||`∘∘`   |GET    |
|`∘⋅`  |**STORE**||`∘∘∘`  |DEL    |
|`⦁`   |PUSH     ||`⦁⦁`   |POP    |
|`⦁⦁⦁` |SWAP     ||`⦁∘⦁`  |DUP    |
|`⋅`   |ADD      ||`⋅⋅`   |SUB    |
|`⋅⋅⋅` |MUL      ||`⋅∘`   |DIV    |
|`⋅∘∘` |MOD      ||`⋅∘∘∘` |POW    |
|`⋅‧`  |EQ       ||`⋅‧‧`  |NEQ    |
|`⋅‧‧‧`|LT       ||`⋅‧∘`  |GT     |
|`⋅‧∘∘`|LTE      ||`⋅‧∘∘∘`|GTE    |
|`⋅⦁`  |AND      ||`⋅⦁⦁`  |OR     |
|`⋅⦁⦁⦁`|NOT      ||`⋅⦁∘`  |XOR    |
|`…`   |IF       ||`…·`   |ELSE   |
|`…‥`  |ELIF     ||`‥`    |LOOP   |
|`‥‥`  |WHILE    ||`‥∘`   |BREAK  |
|`‥∘∘` |CONT     ||`⋮`    |BLOCK  |
|`⋮⋮`  |END      ||`⋯·`   |LABEL  |
|`⋯`   |GOTO     ||`˙`    |FUNC   |
|`˙˙`  |RET      ||`˙˙˙`  |CALL   |
|`˙∘`  |ARG      ||`˙⦁`   |LAMBDA |
|`˙⋅`  |CURRY    ||`◦`    |ARR    |
|`◦◦`  |IDX      ||`◦◦◦`  |IDXS   |
|`◦∘`  |APP      ||`◦∘∘`  |SLICE  |
|`◦‧`  |DICT     ||`◦‧‧`  |DGET   |
|`◦‧‧‧`|DSET     ||`◦⦁`   |KEYS   |
|`◦⦁⦁` |VALS     ||`◦⋅`   |MAP    |
|`◦⋅⋅` |FILTER   ||`◦⋅⋅⋅` |REDUCE |
|`⸳`   |INT      ||`⸳⸳`   |FLOAT  |
|`⸳⸳⸳` |STR      ||`⸳∘`   |BOOL   |
|`⸳⦁`  |TYPE     ||`⸳‧`   |LEN    |
|`‥·`  |TRY      ||`‥··`  |CATCH  |
|`‥·˙` |FINALLY  ||`‥·∘`  |THROW  |
|`‥·⦁` |ASSERT   ||`⋯⋯`   |FOPEN  |
|`⋯⋯⋯` |FREAD    ||`⋯∘`   |FWRITE |
|`⋯∘∘` |FCLOSE   ||`⋯⦁`   |FEXIST |
|`⋯·⦁` |IMPORT   ||`⋮∘`   |EXIT   |
|`⋮⦁`  |DEBUG    ||`⋮‧`   |RAND   |
|`⋮⋅`  |TIME     ||`⋮‧‧`  |HASH   |
|`⋮‧‧‧`|REGEX    ||`⋮·⦁`  |SLEEP  |

전체: `node jeom_cli.js ops`

-----

## 표준 라이브러리 (std.jeom)

```jeom
●(stdlib/std.jeom)●  ⋯·⦁   ◘ 임포트
```

|함수 토큰  |설명                    |인자      |
|-------|----------------------|--------|
|`·∘∘`  |sort — 오름차순 버블정렬      |arr     |
|`·∘·`  |max — 최댓값             |arr     |
|`·∘··` |min — 최솟값             |arr     |
|`·∘∘∘` |sum — 합계              |arr     |
|`·∘·∘` |reverse — 역순 복사본      |arr     |
|`·∘··∘`|contains — 포함 여부 (1/0)|arr, val|
|`·∘∘·` |join — 배열→문자열         |arr, sep|

-----

## 아키텍처

```
jeom_engine.js  (UMD — 브라우저 & Node.js 공용)
├── tokenize(source)   렉서: 소스 → 토큰 배열
├── parse(tokens)      파서: 토큰 → AST
└── JeomVM(opts)       스택 VM (async/await)
      ├── stdout/stderr/stdin 콜백
      └── readFile/writeFile/fileExists 콜백

jeom_cli.js     Node.js CLI (jeom_engine.js require)
jeom_ide.html   웹 IDE (jeom_engine.js 인라인)
jeom_ide.css    웹 IDE 스타일
jeom_ide.js     웹 IDE 로직 (jeom_engine.js 의존)

jeom/           Python 엔진 (동일 스펙)
├── lexer.py
├── parser.py
└── interpreter.py
```

-----

## 주요 변경 이력

### v1.1.0

- **STORE 명령 추가** (`∘⋅ <이름>`): 스택 팝 → 변수 저장
- JS/Python 엔진 스펙 통일
- std.jeom 전면 재작성 (STORE 사용, 버그 수정)
- MAIN marker (`•·`) 렉서 오류 수정
- GTE/LTE 토큰 매핑 수정

### v1.0.0

- 초기 릴리즈

-----

## 라이선스

Apache 2.0 License