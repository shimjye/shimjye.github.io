# Java keytool

<!--
description = 조금 오래된 자료
tag = programming, android, keytool
-->

## key 생성

- 안드로이드 signed apk 를 생성하기 위한 key 생성하기
- Java sdk 경로의 keytool.exe 사용
- {JAVA_HOME}/bin 경로에 위치
- keytool -genkey -v -keystore [android.keystore] -alias android -keyalg RSA -validity 36500
- -validity 기간(일)
- -v 상세정보

<!--
## 정보입력

- 이름 = sootnoon
- 조직단위 = sootnoon
- 조직이름 = sootnoon
- 구/군/시 = Seoul
- 시/도 = Seoul
- 국가 = KR
-->
