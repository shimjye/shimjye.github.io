# Eclipse 안드로이드 + 유니티 개발 환경설정

<!--
description = 조금 오래된 자료
tag = programming, unity, eclipse
-->

## 이클립스 프로젝트만들기

- 최소버전 4.0 적용중, 최고버전 6.0 인 시점
- 프로젝트 NamingRule 패키지 com.shimjye.android.namingrule
- min sdk 4.0 api14(아이스크림 샌드위치)
- target sdk 4.0 - 3.2 api13(Honeycomb) for admob
- compile 4.0

## 유니티 세팅

- top view xz-plane(x-axis 90 rotation), back xy-plane(-z axis)
    * 중력값을 사용하기 위해서는 이에 따르는 뷰를 사용.
    * back 기준 화면설정은 카메라가 -z 위치에서 0 방향을 바라보고 있어서 설정함
- switch android, game>480x800
    * gui 사용시 좌표의 고정. 소프트 키보드 장치에서 좌표보정 필요
- company name com.sootnoon.android
- Product name NamingRuleU
- orther settings>Identification>bundle identifier com.sootnoon.android.namingrule
- minimum api level api10

## scm 설정

### eclipse

- gen, bin 경로 ignore 처리

### unity

- project name postfix Unity ->NamingRuleUnity
- obj, metadata, ScriptAssemblies, Temp 경로 ignore 설정
- *.suo *.user *.pidb *.userprefs ignore 설정
- Library 빌드세팅을 포함.

## 개발소스설정

- manifest, res, lib, src, project, proguard-project 적용

## 빌드

- 유니티에서 android 프로젝트 export NamingRuleU 로 export 됨
- bin 과 lib 경로 복사
- lib 에 admob 라이브러리는 유니티에서 나온 파일과 이클립스 프로젝트 설정된 파일과 충돌로 삭제처리하여 이클립스 프로젝트 설정을 사용함
- android assets/bin libs/unity-classes.jar libs/armeabi-v7a svn ignore 추가

## 안드로이드 배포시 사용 이미지 사이즈

- image 1024x500
- icon web 512*512
- icon xxhdpi 144*144
- icon xhdpi 96*96
- icon mdpi 48*48
- icon hdpi 72*72

## 배포

- 스크린샷 400 넓이
