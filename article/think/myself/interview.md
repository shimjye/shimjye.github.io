# interview

<!--
description = 정리자료
tag = it, etc
-->

## base
- begin: 면접자 소개, 면접관 소개
- end: 하고싶은 질문
- end: 포지션 소개
  - java, back-end, front-end, rest-api, spring-boot
  - git, confluence, unit-test, aws, mysql

## 일반
- 장단점.
- 자신의 목표.
- 커뮤니케이션 기술.
- 하고 싶은 업무 포지션 역할.
- 과도한 업무량 대처.
- 성과 있었던 프로젝트
- 기존 직장을 그만둔이유.
- 맨홀(하수구) 두껑은 왜 사각형이 아니고 원형인가
- 주도적인 업무.

## 기술
- 최근 관심있는 지식.
- 생각하는 트랜드 기술.
- 개발시 가장 어려운 부분.
- 경험 기술(cache, 분산)
- 다른 언어 기술 수준

----
## java

### java-spec
- 자바의 장단점
- 기본 자료형(byte, short, int, long, float, double, char, boolean), 참조 자료형(class, interface, array, enum)
- 객체지향 프로그래밍 추상화, 캡슐화, 다형성
- 다형성(polymerphism), 메소드 오버라이딩, 오버로딩
- 접근제어자(access modifier) public, default, protected, private
- 추상 클래스(abstract class), 인터페이스(interface)
- final, 변수: 상수화, 클래스: 상속 불가, 메소드: 오버라이딩 불가
- static, 메소드, 멤버 변수: 모든 인스턴스 공유
- 제네릭
- 컬렉션 list(arraylist, linkedlist, stack, vactor), set(hashset, treeset), map(hashmap, treemap, hashtable, properties)
- 직렬화(serialization), transient 키워드 직렬화 제외
- 래퍼 클래스(wrapper class)
- 쓰레드(Thread, Runnable)
- synchronized, deadlock
- String, StringBuffer, StringBuilder
- NIO
- call-by-value, call-by-reference
- 형변환(묵시적 형변환, 명시적 형변환)
- java.lang.ref 패키지의 강참조, 약참조 클래스
- volatile 메모리를 통해 처리 (c 컴파일 처리)

### java-extend
- 서블렛, jsp
- java버전에 새로운 기능
- 람다식, 메소드 레퍼런스
- Throwable: Unchecked, Checked Exception
- RunnableFuture, Runnable 차이점
- RunnableFuture의 get 메소드의 Exception
- AspectJ
- RxJava
- 어노테이션, 생명주기
- spring bean scope 생명주기
- functional interface
- thread safe class
- JTA

### java-vm
- 메모리(class, stack, heap, native 메소드, PC 레지스터)
  - class (변수, 메소드, 타입, 상수풀, static 변수, final class)
  - stack (메소드 호출, 프레임(frame)이 생성)
  - heap (객체와 배열)
    - permanent geration(객체들의 주소값), new(eden 객체 생성, survivor eden 영역에서 참조되는 객체), old(일정 시간 참조)
  - native 다른 언어 메소드
  - PC 레지스터 쓰레드(현재 실행되는 부분의 명령과 주소)
- 가비지 컬렉션 
  - minor(new 영역, eden 가득 차면 survivor1 이동후 객체 삭제, eden survivor1 찼을경우 참조 검사 후 survivor2 복사 후 객체 삭제, 일정시간 참조 객체 old 이동
  - major(old 영역, old 영역에 있는 모든 객체를 검사 삭제), 프로세스 정지
- String 상수 풀: permanent generation 영역, 동일문자 heap에 문자열을 해제하고 상수 풀 래퍼런스로 반환, == 연산자
- String intern 메소드
  - heap 영역에 있는 문자열 객체를 상수 풀로 이전
- String 객체를 생성하는 방법
  - 리터럴(""): 객체를 heap 영역에 생성한 후 intern 메소드가 호출되어 상수 풀에 등록
  - String 생성자: heap에 인스턴스 저장, 상수 풀에 비등록, 명시적으로 intern
- 메모리 누수
- JIT
- 멤버 변수 초기화: 명시적, 클래스 초기화 블럭(static), 인스턴스 초기화 블럭, 생성자
  - 클래스 순서: 클래스 변수 기본값, 클래스 명시적, 클래스 초기화 블럭(static)
  - 인스탄스 순서: 인스턴스 변수 기본값, 인스탄스 명시적, 인스턴스 초기화 블럭, 생성자

----
## web
- 반응형, 적응형 웹
- Cross-Site Scripting
- CORS
- http에서 https 호출
- Single Page Application

## design
- 디자인 패턴
- di
- http/1.1
- rest
- 멀티쓰레드 설계 경험
- thread, process
- 대용량 경험
- tdd, 애자일, ci
- 암호화/인증 방식(비밀키 공개키 해시)
- 보안 처리 사항
- aws 시스템 설계

## database
- 프라이머리 인덱스, 세컨더리 인덱스.
- 저장 프로시저
- 설계시 자주 사용하는 공통 컬럼 정보.
- nosql vs sql.
- connection pool 구현 고려사항.
- transaction isolation level
- elasticsearch
- sharding, partitioning
