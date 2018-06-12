# computer-environment

<!--
description = 정리자료
tag = it, pc, windows, linux, docker
-->

## windows environment
- docker windows install
- ubuntu windows install
- setting linux subsystem
    - sudo apt-get update && sudo apt-get upgrade
    - https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly
    - echo "export DOCKER_HOST=tcp://0.0.0.0:2375" >> ~/.bashrc && source ~/.bashrc
- windows setting
    - power manager
    - virtual memory, ready boost
    - firewall
- data folder setting
    - /data/pub/jj jy
    - 공유권한 사용자에게설정
- program
    - java tomcat scm 설정
    - eclipse adt unity3d vscode
    - libre office

## linux environment
- install linux xubuntu(ubuntu + xubuntu-desktop)
- setting linux, passwd root, set xfce workspace
- apt-get install ufw vim git terminator curl wget x2goclient xubuntu-desktop
- apt-get install openjdk-8-jdk
- install download chrome, vscode, mysqlworkbench, eclipse
- virtualbox not works on docker container
- 개발 용으로 사용하기에는 충분하고 쉘을 사용하기 편함. 독커 이용이 좋음.
- unity3d 호환성이 ubuntu에서 부족해 다시 windows로 전환함.

## tool
- 소스관리 git, bitburket
    - https://help.github.com/articles/caching-your-github-password-in-git/
- 빌드관리  jenkins ci
- 커뮤니케이션 slack, google driver
- 디자인 zeplin
- 앱 firebase, Fabric
- cas auth https://github.com/apereo/cas
- cockpit dashboard
- http://plantuml.com/
- redmine, jira, confluence
- sonarqube
- sonatype nexus

## docker-local
- x2ubuntu, kr(2222), samba(2223,139,445), tomcat(2224,9980), scm-manager(2225,9990)
- elk http://elk-docker.readthedocs.io/
    - $ sudo docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk
- couchbase/server
    - $ docker run -d --name db -p 8091-8094:8091-8094 -p 11210:11210 couchbase
- install docker https://docs.docker.com/install/linux/docker-ce/ubuntu/
```
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ${USER}
```
- install mysql 5.7(aws) docker-local https://dev.mysql.com/doc/refman/5.7/en/docker-mysql-getting-started.html
```
docker run --name=mysql1 -p 3306:3306 -d mysql/mysql-server:5.7
docker logs mysql1 2>&1 | grep GENERATED
docker exec -it mysql1 mysql -uroot -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
mysql> use mysql;
mysql> select host, user from user;
mysql> grant all privileges on *.* to 'root'@'172.17.%' identified by 'password';
mysql> flush privileges;
```

## virtualbox windows
- virtualbox windows oem
  - sudo dd if=/sys/firmware/acpi/tables/SLIC of=slic.dat
  - VBoxManage setextradata "win10" "VBoxInternal/Devices/acpi/0/Config/CustomTable" "/data/pub/win/slic/slic.dat"
  - VBoxManage setextradata "win10" "VBoxInternal/Devices/acpi/0/Config/CustomTable"
- install virtualbox on ubuntu and install windows10 on virtualbox
- windows10 install ext-pack: windows sizing able
