# 안드로이드 구글 analytics, 애드몹 적용 자료

<!--
description = 조금 오래된 자료
tag = programming, android, analytics, admob
-->

## 안드로이드 구글 analytics, 애드몹 적용 자료

- 최초 설정 후 이후에는 복사해서 붙여넣어서 사용중

### google analytics

- https://developers.google.com/analytics/devguides/collection/android/v3/?hl=ko

### 애드몹

- google play service 라이브러리 적용
- https://developers.google.com/mobile-ads-sdk/docs/
- https://sites.google.com/site/kradmob/
- http://developer.android.com/google/play-services/setup.html#Install

### unity admob

- 유니티 4.5 적용함
- https://github.com/googleads/googleads-mobile-plugins/tree/master/unity (링크중단)

### 광고 touch 가 동작하지 않은경우

- 메니페스트에 activity 아래에 추가

```
<meta-data android:name="unityplayer.ForwardNativeEventsToDalvik" android:value="true" />
```
