# deploy

<!--
description = 정리자료
tag = programming, android, java, keytool
-->

## key 생성

- 안드로이드 signed apk 를 생성하기 위한 key 생성하기
- Java sdk 경로의 keytool.exe 사용
- {JAVA_HOME}/bin 경로에 위치
- keytool -genkey -v -keystore [android.keystore] -alias android -keyalg RSA -validity 36500
- -validity 기간(일)
- -v 상세정보
- ref keygen https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_%EC%9E%90%EC%B2%B4%EC%84%9C%EB%AA%85_SSL_%EC%9D%B8%EC%A6%9D%EC%84%9C_%EC%83%9D%EC%84%B1

## android studio release
- https://developer.android.com/studio/publish/app-signing
- Build > Generate Signed Bundle/APK
- Signature Versions v1 and V2

<!--
## 정보입력

- 이름 = sootnoon.com
- 조직단위 = sootnoon.com
- 조직이름 = sootnoon.com
- 구/군/시 = Seoul
- 시/도 = Seoul
- 국가 = KR
-->

# job
- icon https://developer.android.com/studio/write/image-asset-studio?hl=ko
- android-key https://support.google.com/googleplay/android-developer/answer/7384423?hl=ko
- ga https://developers.google.com/analytics/devguides/collection/android/v4/