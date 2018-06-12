# firebase

<!--
description = 정리자료
tag = programming, android, firebase, fcm, cloud-message
-->

## cloud message
- https://firebase.google.com/docs/cloud-messaging/concept-options?hl=ko
- 4k payload
- 알림메시지(데이터선택)
    - 백그라운드 상태이면 알림 메시지가 알림 목록으로 전송됩니다.
    - 포그라운드 상태인 앱의 경우 다음 콜백이 메시지를 처리합니다.

```
{
  "message":{
    "token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
    "notification":{
      "title":"Portugal vs. Denmark",
      "body":"great match!"
    },
    "data" : {
      "Nick" : "Mario",
      "Room" : "PortugalVSDenmark"
    }
  }
}
```

- 데이터메시지

```
{
  "message":{
    "token":"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
    "data":{
      "Nick" : "Mario",
      "body" : "great match!",
      "Room" : "PortugalVSDenmark"
    }
  }
}
```
- 공통키, (ios, android, web 옵션)
- 비축소형 메시지 및 축소형 메시지
    - 알림메시지 축소형
- 포트 수신시 5228, 5229, 5230

## admin sdk
- java, node.js, python, go
- message
    - data
    - notification (title, body)
    - android	Android 메시지와 관련된 필드로 구성된 개체입니다. 자세한 내용은 Android 관련 필드를 참조하세요.
    - apns	Apple 푸시 알림 서비스(APNS)와 관련된 필드로 구성된 개체입니다. 자세한 내용은 APNS 관련 필드를 참조하세요.
    - webpush	웹 푸시 프로토콜과 관련된 필드로 구성된 개체입니다. 자세한 내용은 웹 푸시 관련 필드를 참조하세요.
    - token	메시지의 수신자 기기를 식별하는 등록 토큰입니다.
    - topic	메시지를 보낼 주제 이름입니다. 주제 이름에 /topics/ 프리픽스를 포함해서는 안 됩니다.
    - condition	메시지를 보낼 조건입니다. 예: "foo" in topics && "bar" in topics
-message sub
    - android(collapseKey, priority, ttl, restrictedPackageName, data, notification)
    - android.notificatioin (title, body, icon, color, sound, tag, clickAction, bodyLocKey, bodyLocArgs, titleLocKey, titleLocArgs)
    - apns (headers, payload)
    - webpush (headers, data, notification(title, body, icon))
  
## 오류
- https://firebase.google.com/docs/cloud-messaging/admin/errors?hl=ko
- messaging/invalid-registration-token 잘못된 토큰.
- messaging/registration-token-not-registered 잘못된 토큰. 삭제된.
- messaging/message-rate-exceeded 메시지 비율 초과
- messaging/device-message-rate-exceeded 기기 메시지 비율 초과
- messaging/server-unavailable fcm-서버문제
- messaging/internal-error fcm-서버문제
- messaging/unknown-error fcm-서버문제

## google cloud fcm api console setting
- "com.google.firebase.messaging.FirebaseMessagingException: Firebase Cloud Messaging API has not been used in project 230671892470 before or it is disabled. Enable it by visiting - https://console.developers.google.com/apis/api/fcm.googleapis.com/overview?project=value then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry."
- 오류 발생시 구글 apis 설정
- https://console.developers.google.com/apis/api/fcm.googleapis.com/overview?project={project-name}&authuser=1&duration=PT1H
