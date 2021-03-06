# Docker-container

<!--
description = 정리자료
tag = it, pc, docker, virtual box
-->

## x2ubuntu
- https://github.com/shimjye/x2ubuntu
- x2ubuntu, kr(2222), samba(2223,139,445), tomcat(2224,9980), scm-manager(2225,9990)

## hub.docker.com
- install docker https://docs.docker.com/install/linux/docker-ce/ubuntu/
```
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ${USER}
```

### mysql
- install mysql 5.7(aws) docker-local https://dev.mysql.com/doc/refman/5.7/en/docker-mysql-getting-started.html
```
docker run --name mysql1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12345678 -d mysql:8.0.20 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

docker run --name=mysql1 -p 3306:3306 -d mysql/mysql-server:5.7
docker logs mysql1 2>&1 | grep GENERATED

docker exec -it mysql1 mysql -uroot -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
mysql> use mysql;
mysql> select host, user from user;
mysql> grant all privileges on *.* to 'root'@'172.17.%' identified by 'password';
mysql> flush privileges;
```

### elk
- http://elk-docker.readthedocs.io/
- $ sudo docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk

### couchbase/server
- $ docker run -d --name db -p 8091-8094:8091-8094 -p 11210:11210 couchbase

# xubuntu-docker 20022 (old)
- Xubuntu-x2go를 기반에 docker를 이용한 pc 설정을 위한 프로젝트.
- Vm에 설치되는 linux 운영체제이며 docker 기능을 수행하며 하위경로에 container dockerfile 을 이용한 pc 서비스를 구성.
- vm xubuntu 직접설치 + 스크립트 docker 설치 20022 사용.

# Docker container base image (old)
- Base image https://hub.docker.com/r/shimjye/xubuntu-x2go-kr/
- Xubuntu-x2go 기반 서비스 컨테이너 생성 Xubuntu16(xfce + ubuntu) + x2go + hangul
- 모든 시스템간 공통으로 /data 경로를 공유한다.
- Docker container 개발용으로 2222X 포트 활용.

## Simple 22201 (old)
- shimjye/xubuntu-x2go-kr + google 크롬, git, terminator, wget
- docker build -t x2-simple .
- docker run -d -p 22201:22 -v /data:/data --cap-add=SYS_ADMIN --name x22201 x2-simple

## Tomcat 서비스 22211 28001 (old)
- shimjye/xubuntu-x2go-kr + Git, terminator, wget, Openjdk8, tomcat8.5.9
- docker build -t x2-tomcat .
- docker run -d -p 22211:22 -p 28001:8080 -v /data:/data --name x22211 x2-tomcat
- https://hub.docker.com/r/cloudesire/java/ 참고
- https://hub.docker.com/r/cloudesire/tomcat/ 참고

## Git server 서비스(tomcat + scm-manager) (old)
- shimjye/x2buntu-tomcat + scm-manager
- 서비스 22211에 scm-manager 추가
- /data 경로에 추가 /data 경로에 config 경로

## Eclipse jee 개발 22271 28071 (old)
- shimjye/x2buntu-tomcat + eclipse(jee neon sr2)
- docker build -t x2-eclipse-jee .
- docker run -d -p 22271:22 -p 28071:8080 -v /data:/data --name x22271 x2-eclipse-jee
- http://ftp.kaist.ac.kr/eclipse/technology/epp/downloads/release/neon/2/eclipse-jee-neon-2-linux-gtk-x86_64.tar.gz

## Eclipse java 개발 22272 28072 (old)
- shimjye/x2buntu-tomcat + eclipse(java neon sr2)
- docker build -t x2-eclipse-java .
- docker run -d -p 22272:22 -p 28072:8080 -v /data:/data --name x22272 x2-eclipse-java
- http://ftp.kaist.ac.kr/eclipse/technology/epp/downloads/release/neon/2/eclipse-java-neon-2-linux-gtk-x86_64.tar.gz


