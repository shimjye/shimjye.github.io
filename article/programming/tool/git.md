# Git

<!--
description = 정리자료
tag = programming, tool, scm, git
-->

## 장점

- 빠르다.
- 원격과 로컬 리포지토리를 독립적으로 사용가능.

## 특징

- 빈폴더는 올리지 못함.
- 소스의 내용을 기준으로 버전이 생성.

## scm-manager

- https://www.scm-manager.org/download/
- Java 1.6 이상 필요.
- webapp 버전 설치.
- 기본 아이디 scmadmin/scmadmin 계정 변경.

## Eclipse Git 인증오류시 암호 지우기

- Preferences > general > security > content > click delete > ok.

## 기본 사용법

- Svn도 기본기능으로 trunk에 commit과 update만 사용했듯이 기본기능만 사용.
- Clone 원격 리포지토리에서 가져와 로컬에 리포지토리 생성.
- Pull (Svn update)변경파일 받아옴.
- Add to index 신규파일 추가.
- Commit 로컬 리포지토리에 올림.
- Push 원격 리포지토리에 올림.

## Git 충돌

- 소스수정하여 충돌해소.
- Add to index.
- Commit.
