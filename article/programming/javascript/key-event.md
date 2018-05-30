# Javascript key event

<!--
description = 조금 오래된 자료
tag = programming, javascript
-->

## Javascript 키 길이 검사, 키입력 검사 처리시

- onkeypress 한글 키입력 감지못함, 길이 검사시 사용주의.
- onkeyup input 요소의 엔터 이벤트시 jquery ie10 에서 button 요소에 click 이벤트 들어감.
- (submit event 관련 처리) keypress 에서 13 엔터 입력을 return false 로 막아줘야 함.
