# computer-environment

<!--
description = 정리자료
tag = it, pc, windows, linux, docker
-->

## windows environment
- windows setting
    - power manager
    - virtual memory, ready boost
    - firewall
    - 업데이트 gpedit.msc-컴퓨터 구성-관리 템플릿-windows 구성 요서-windows 업데이트-자동 업데이트구성
    - rdp-port regedit- HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp-portnumber 3389 (input-port-value)
    - 윈도우 설정, ie 설정, 탐색기 설정
- data folder setting
    - /data/pub/jj jy
    - 공유권한 사용자에게설정
- program
    - docker windows install
    - java, tomcat, scm-manager 설정
    - eclipse, adt, unity3d, vscode
    - libre-office, chrome, x2goclient
- setting linux subsystem
    - ubuntu windows install
    - sudo apt-get update && sudo apt-get upgrade
    - https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly
    - echo "export DOCKER_HOST=tcp://0.0.0.0:2375" >> ~/.bashrc && source ~/.bashrc

## linux environment
- install linux xubuntu(ubuntu + xubuntu-desktop)
- setting linux, passwd root, set xfce workspace
- apt-get install ufw vim git terminator curl wget x2goclient xubuntu-desktop
- 개발 용으로 사용하기에는 충분하고 쉘을 사용하기 편함. 독커 이용이 좋음.
- unity3d 활용이 부족해(버그가 비교적 많음) 다시 windows로 전환함.
- program
    - apt-get install openjdk-8-jdk
    - install download chrome, vscode, mysqlworkbench, eclipse
    - ubuntu android https://anbox.io/
- on docker container
    - virtualbox not works on docker container
    - vscode, atom not works on docker container
- power manager
    - https://askubuntu.com/questions/47311/how-do-i-disable-my-system-from-going-to-sleep
    - sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
    - sudo systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target

## virtualbox
- windows10 install ext-pack: windows sizing able
- VboxManage startvm ubuntu-vm --type headless
- VboxManage controlvm ubuntu-vm acpipowerbutton
- virtualbox windows oem
  - sudo dd if=/sys/firmware/acpi/tables/SLIC of=slic.dat
  - VBoxManage setextradata "win10" "VBoxInternal/Devices/acpi/0/Config/CustomTable" "/data/pub/win/slic/slic.dat"
