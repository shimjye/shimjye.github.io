# Eclipse 패키지

<!--
description = 조금 오래된 자료
tag = programming, tool, eclipse
-->

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