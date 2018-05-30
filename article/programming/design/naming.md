# Personal naming rule

<!--
description = 조금 오래된 자료
tag = programming, design, naming
-->

## description

- 회사에서는 회사룰을 사용하지만 개인적으로 사용하는 룰

## File Naming

- project = project-name
- package, folder = filename
- class = FileName
- resource file(image, xml) = file_name (for android)
- web resource file(md) = file-name (for web)
- folder align = 00_name
- folder date rule = y2014, m201401, q20141q, d20140101
- file date rule = content_d20140101, content_d20140101_v1, content_name_20140101_v1

## Result Output

- ProjectName
- 10_plan
- 20_design
- 30_develop
- 31_imagework
- 32_musicwork
- 40_test
- 50_deploy
- 60_result
- 90_ref

## Maven Source Porject Structure

- 개발관련 참조 파일들은 test/resources 에 구성한다.
- /src/main/java
- /src/main/resources
- /src/test/java
- /src/test/resources
- -design (erd, uml)
- -sql
- -dev
- /src/main/webapp
- /src/main/htdocs
- /lib (web 프로젝트가 아닌경우, maven 구성이 아닌경우)
- /logs
- /bin (실행파일)

## Comment Text Rule

- TODO 권장 할일
- FIXME 반드시 할일
- XXX 앞으로 할일

## Source Project Structure(old)

- src
- classes
- bin
- conf
- libs
- logs
- data
- dev
- -dist
- -sql
- -test
- -manual
- -image
- htdocs
- webapp
- -WEB-INF
- work
