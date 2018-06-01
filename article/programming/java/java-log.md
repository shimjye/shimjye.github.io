# 자바 로그 라이브러리

<!--
description = 조금 오래된 자료
tag = programming, java, lib, log
-->

- 대충 이해하는 많이 사용되는 라이브러리
- 하지만 결국 모두 유틸성이고 그냥 가져다가 초기구축만 잘해두면 별로 쓸 일이 없는 로그 라이브러리들.

## Apache commons logging

- Apache 로그 라이브러리

## Log4j

- 많이 사용하던 로그 라이브러리

## Slf4j

- 여러 라이브러리의 로그를 모아주는 역할
- 라이브러리들을 여러 가지 모아서 사용하면 각 라이브러리 별로 개발된 로그 라이브러리가 달라서 사용하는 로그만 출력되는 사항이 발생하며, 이를 위해 slf4j 에서 여러 라이브러리간 연결을 형성하여 사용하는 로그 라이브러리를 통해 기록해준다.

## Logback

- 고성능 로그

## 개인적 구조 생각

- 로그를 통한 메시지를 로그 파일을 통해 출력.
- 일정경로에 파일을 일정주기로 롤링하며 파일을 내려주면 이를 읽어 처리하는 방식으로 프로그래밍.
- Log4j 로 시간을 설정하여 내려주고 파일 검사하여 롤링된 파일에 대해 라인 별로 읽으며 처리, 처리시 로그에 라인정보를 남겨서 프로세스가 죽는 경우에 대해 극복할 수 있다.
- Ftp를 이용하여 다중서버에 대한 로그파일을 로그 디비에 기록 처리하는 시스템을 사용한 경험이 있음.
- 로그파일이 일종의 중간 메시지 큐 역할을 하여 비동기 처리가능. 오류사항 쉽게 극복가능. 쉽게 구현가능. 사람이 관리하기 편한 로그 파일로 출력됨.
- 로그파일을 읽어 처리하는 작업자를 별도 프로그레밍 해야 함. 별도 관리해야 함. 다중서버간 처리시 구조가 복잡해 질 수 있음.
- 기타사항
- 기존 log4j 에서는 1분 뿐 아니라 2분 5분등 설정이 가능하였으나, logback 에서는 파일명에 따르는 월주기, 일주기, 시간주기, 분주기, 초주기 로만 사용이 가능한 것으로 파악.
- 파일락 주의, 파일간 전환점에서 오류 가능성 확인은 못 함
- 근본적으로는 mq 구조가 이상적으로 보임