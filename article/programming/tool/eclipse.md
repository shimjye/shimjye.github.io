# Eclipse

<!--
description = 정리자료
tag = programming, tool, eclipse
-->

## 버전별 특징

- http://wiki.eclipse.org/Older_Versions_Of_Eclipse
- 2007 v3.3 Europa java(95M), 32bit 자바 필요, 에디터 대용으로 그나마
- 2008 v3.4 Ganymede
- 2009 v3.5 Galileo
- 2010 v3.6 Helios java(190M), 마켓, windows 64bit 배포판
- 2011 v3.7 Indigo java(190M), git, m2, windowBuilder
- 2012 v4.2 Juno code recommanders
- 2013 v4.3 kepler
- 2014 v4.4 luna java8지원
- 2015 v4.5 mars java(380M)
- 2016 v4.6 neon 다크테마
- 2017 v4.7 oxygen java9(Oxygen.1a) java10(Oxygen.3a)
- 2018 v4.8 photon java10

## 이클립스 버전

- http://ko.wikipedia.org/wiki/이클립스_(소프트웨어)
- 언제부터 이클립스를 써본지 기억이 정확하지는 않지만 아마도 Calisto 버전 기억이있다.
- 초창기때는 컴퓨터도 별로 좋지 않았고 기능도 좋지 않았던 것과 같이 메모리 사용도 거의 에디터플러스 2개 돌리는 수준의 점유였는데, 언제부터인가 너무 무겁다 무겁다를 걱정한다.
- Galileo 부터 알파벳 순서로 버전업이 되어가고 있으며, 이번 Luna 그리고 다음은 Mars 로 개발이 시작되고 있는 것 같다.
- 이클립스 버전업은 1년 주기를 따라 거의 같은 날에 배포된다. 때문에 나는 SR1 버전을 주로 사용한다.
- 물론 충분한 버전업을 하면서 출시까지 오지만 데드라인 위의 프로젝트는 뭔가 버그의 기운이 느껴진다랄까.
- 플러그인 버전 지원도 원활하지 않아 SR1 시점에 업그레이드를 하는데 이번 Luna의 경우 Java8 지원이 걸려 SR1 버전까지 기다리기 뭐하다.
- 그리고 Luna Eclipse 이름도 왠지 마음에 든다.
- 비쥬얼스튜디오와는 격차가 상당하기는 하지만 무료 소프트웨어에 이클립스 만한 것도 없는 것 같다.


## 이클립스 패키지
- http://eclipse.org/downloads/

## 주로 사용하는 것은

### Eclipse IDE for Java EE developers

- 웹프로젝트 관련 개발을 하는 경우 사용.
- 웹까지 개발이 가능하여 기본적으로 많은 기능이 포함되어 대부분의 경우 사용 가능하다.

### Eclipse IDE for Java Developers

- 일반 자바 관련 개발을 하는 경우 사용.
- 자바 개발에 적합하며, EE 버전보다 가벼워 web 관련 개발이 없는 경우 사용한다.
- 웹이 아닌 android 같이 플러그인을 통한 개발환경 구축시 베이스로도 사용한다.

### 그리고 기타 패키지

- Standard - 표준버전으로 자바개발환경만을 포함. 다른 패키지의 레퍼런스 버전
- C/C++ - 말 그대로 C 개발용
- Php - 역시 php 개발용
- DSL - 도메인특화언어 개발용
- Report - BIRT 관련이라고 써있음.
- Modeling Tools - 모델링, 플러그인이 패키지 되어있는데 전에 확인할 때는 활용이 어려웠음.
- RCP and RAP - 이클립스 플러그인 프로젝트 개발용
- Parallel Application - 병렬 프로그래밍 용이라고 써있음
- Testers - 테스트용

### 주요 관심 패키지 플러그인

- Java, EE 개발버전을 주로 확인하면
- Ant, Junit, CVS 등 은 이제 기본 Java 개발환경에 포함되어 플러그인으로 노출되지도 않음.
- Git - 버전관리. 아직 사용해 보지 않았음.
- Maven - 빌드툴. 이제 많이 적응함, 라이브러리 관리에 있어 귀찮은 것들을 처리해 줘서 좋음.
- Mylyn - 작업관리. 작업관리를 잘 수행하면 편리한데 잘 하지 못해서 별로 사용하지 않음
- Code Recommenders - 코드 추천. 개발자 필요 없는 개발이 머지 않았나…
- WindowBuilder Core - 애플릿을 개발한다면 유용한데 하지를 않으니. 그래도 언젠가는 쓸 곳이 있어 보임.
- Xtend / Xtext - 개발을 편리하게 해주는 언어로 자바소스를 생성해줌. 새로운 것이라 어려움.
- Emf 관련 - 초기 그래픽 형식의 이클립스 기능으로 많은 발전을 가져왔으나 정작 자신의 기능은 좋지 않아 그냥그냥. 모델링 시 그래픽 관련 라이브러리
- Data Tools - 빨리 발전해서 별도 db 툴을 사용하지 않았으면 좋겠다.
- Jubula - 역시 빨리 발전해서 테스트를 편하게 했으면 좋겠다.
- 기본 포함된 플러그인이기는 하지만 이클립스 플러그인 구조상 별도 설치가 가능하기 때문에 관심있는 플러그인 프로젝트에 대해서는 지속적으로 사용해보고자 노력은 한다.

## Eclipse 플러그인

- 이클립스 플러그인은 기본적으로 eclipse 폴더의 plugins 폴더에 jar 형식등으로 존재
- 해당 파일의 복사 후 이클립스를 다시 실행함으로 설치완료.
- 이클립스 마켓이 생기며 이클립스 마켓에서 검색하여 바로 설치 가능.
- 플러그인간 충돌, 이클립스 버전 호환성, 단축키 충돌 등 문제는 있음.

### Eclipse 통합 - 통합환경 패키지

- Maven - eclipse ee 기본포함, maven tool
- Spring - 스프링환경
- Android - 안드로이드 개발환경
- Google app engine - 구글앱앤진 개발환경

### Eclipse Market

- Anyeditor - 에디터 기능개선 (주사용)
- Eclipse Color Theme - 에디터 태마변경 (주사용)
- Findbug, CheckStyle, CodePro - 코드툴
- Localized Properties Editor - 에디터
- Jautodoc - javadoc 툴
- Xtend - 소스 제너레이터(xtext 연관)
- Pydev - 파이션 개발환경
- Jadclipse - 디컴파일

### Etc

- Amateras erd - 간단한 erd (주사용)
- Amateras uml - 간단한 uml (주사용)

## Eclipse 단축키

- 단축키를 찾고자 하는경우 Ctrl+shift+l 단축키도움말
- Window> Preferences> General> Keys

### 편집

- Ctrl+space (Alt+/) 자동완성 도움
- Ctrl+d 한줄삭제
- Ctrl+f 검색
- Ctrl+h 상세검색
- Ctrl+n 새파일
- Ctrl+w 창닫기
- Ctrl+/ 주석
- Ctrl+m 전체화면
- Ctrl+l 라인으로이동
- Ctrl+. / , 이전, 다음
- Ctrl+1 quick fix
- Ctrl+3 quick access
- Ctrl+shift+r 파일찾기
- Ctrl+shift+o import 정리
- Ctrl+shift+f 파일 format 정리
- Ctrl+Shift+x 대문자로
- Ctrl+Shift+y 소문자로
- Ctrl+shift+c 주석
- Ctrl+shift+l 단축키도움말
- Ctrl+shift+[ ( Ctrl+{ ) 편집창 세로분리(luna)
- Ctrl+shift+- ( Ctrl+_ ) 편집창 가로분리(luna)
- F3 선언위치로
- Ctrl+PgUp PgDn 에디터탭이동
- Ctrl+F7 파일간 이동
- Ctrl+F7 뷰간 이동
- Ctrl+F7 퍼스펙티브간 이동
- F12 에디터로
- Alt+앞, 뒤 이전, 다음에디터로
- F11 디버그 실행
- Ctrl+F11 실행

### 디버그

- F5 step into 안으로
- F6 step over 다음줄
- F7 step return 밖으로
- F8 resume

### Anyedit 플러그인

- Ctrl+Alt+k Camel<->Underscores
