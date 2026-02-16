# 페르소나 재정렬 가이드 (운영용)

이 문서는 기존 글들을 기준으로 `persona_*` 문서를 주기적으로 재정렬하는 방법을 정리한 운영 가이드다.

## 목적

- 페르소나를 "이상적인 문체"가 아니라 "실제 누적된 글 패턴"에 맞춘다.
- 글 생성 결과의 톤 흔들림을 줄인다.
- 사고형/구현형 글의 규칙을 분리해 재현성을 높인다.

## 대상 파일

- `/Users/sangwon0001/Projects/personal/medium-blogging/public/ai/persona_base.md`
- `/Users/sangwon0001/Projects/personal/medium-blogging/public/ai/persona_blogger.md`
- `/Users/sangwon0001/Projects/personal/medium-blogging/public/ai/persona_commenter.md`
- `/Users/sangwon0001/Projects/personal/medium-blogging/public/ai/template.md`

## 업데이트 주기

- 권장: 월 1회
- 트리거: 스타일이 달라진 글이 3개 이상 누적됐을 때

## 표준 절차

### 1) 코퍼스 수집

- `content/*.md` 전체 목록을 뽑는다.
- 메타(제목/설명/태그/날짜) 먼저 전수 스캔한다.
- 본문은 대표 샘플(사고형 + 구현형 + 시리즈형)로 딥리딩한다.

권장 비율:
- 전수 스캔: 100%
- 딥리딩: 최소 50% (또는 최소 8개)

### 2) 패턴 추출

아래 항목으로만 추출한다.
- 시작점: 개인 불편/문제 제기/작업 계기
- 전개 방식: 기존 프레임 한계 -> 재정의 -> 제3축
- 문장 리듬: 단문/장문 비율, 자주 쓰는 전환어
- 마무리: 열린 결론 여부
- 금지 패턴: 과한 단정, 도덕 훈계, 인신 비판

### 3) 규칙 정리

규칙은 3층으로 나눈다.
- 공통 사고 규칙: `persona_base.md`
- 블로그 생성 규칙: `persona_blogger.md`
- 댓글/논점 교정 규칙: `persona_commenter.md`

규칙 형식:
- 해야 할 것 (Do)
- 금지할 것 (Don't)
- 자주 쓰는 표현 (Phrase Bank)
- 출력 구조 (Template/Flow)

### 4) 템플릿 동기화

`template.md`를 최소 2종으로 유지한다.
- 사고 정리형
- 구현 기록형

각 템플릿에는 아래를 반드시 포함한다.
- 시작 문단 목적
- 본문 구조
- 남은 질문
- 열린 마무리 문장

### 5) 검증

- 변경 후 `git diff`로 문체 강제성이 과도한지 확인한다.
- 샘플 글 1개를 새 페르소나로 재작성해 결과 톤을 검증한다.
- 과도한 단정/공격성이 보이면 `persona_commenter`부터 완화한다.

## 품질 체크리스트

- [ ] 결론 닫지 않기 규칙이 명시돼 있는가
- [ ] 정의/에러모델/안정성 3축이 명시돼 있는가
- [ ] 사실/해석/가설 분리 규칙이 있는가
- [ ] 사고형/구현형 템플릿이 분리돼 있는가
- [ ] 공격적 문장 대신 논점 교정 문장으로 유도하는가
- [ ] 실제 최근 글의 리듬과 충돌하지 않는가

## 이번 리얼라인먼트 기준 로그 템플릿

아래 포맷으로 기록해두면 다음 업데이트 때 비교가 쉬워진다.

```md
## Persona Realignment Log
- date: YYYY-MM-DD
- scanned_posts: N
- deep_read_posts: N
- updated_files:
  - public/ai/persona_base.md
  - public/ai/persona_blogger.md
  - public/ai/persona_commenter.md
  - public/ai/template.md
- key_changes:
  - ...
- follow_up:
  - ...
```

## 원칙

- 페르소나는 "취향"이 아니라 "운영 기준"이다.
- 문장을 멋있게 만드는 것보다, 사고 구조를 재현 가능하게 만드는 게 우선이다.
