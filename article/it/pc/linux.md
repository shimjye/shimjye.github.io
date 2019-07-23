# linux

<!--
description = 정리자료
tag = it, pc, linux
-->

## linux-command
- ls, cd, mkdir, rmdir, rm, touch, man, cp, mv, chmod, chown, chgrp
- echo, sudo, hostname, passwd
- cat, head, tail, less, more, wc
- pwd absolute path
- locate search file, -i ignore-case
- find [-name]
- which
- ln [-s] {source file} {target file} (-s: symbolic-link)
- tar
  - tar -cvf file.tar dir
  - tar -xvf file.tar dir
- grep
- awk
- sed
- du, df, free
- date
- top, ps, kill
- nslookup
- nohub
- fg, bg, jobs
- ping, ifconfig, netstat, traceroute, route

## linux-command-ext
- 버전확인 grep . /etc/*-release

## systemctl
- systemctl list-units --type=service
- systemctl start/stop/restart/enable/disable service_name.service

## shell
- 연결 실행 '&& \'

----
# ubutntu-aarch64

## android-ubuntu
- termux android app install
- AnLinux android app install
- ubuntu18, xfce

## vscode-aarch64
- https://code.headmelted.com/
- vnc error > $ xhost +
- note5 exec error > $ sudo sed -i 's/BIG-REQUESTS/_IG-REQUESTS/' /usr/lib/x86_64-linux-gnu/libxcb.so.1
    - https://github.com/Microsoft/vscode/issues/3451

## intellij-aarch64
- java 기반으로 설치 사용가능. 커뮤니티 버전.
- 성능적으로 무거움.

----
# qemu-work

## install
- sudo apt install qemu-kvm qemu kvm-pxe 
- sudo apt install virt-manager virt-viewer libvirt-bin
- pxe-rtl839.bin guest 운영체제 이더넷 카드
	- sudo apt install kvm-pxe

## create
- $ qemu-img create -f qcow2 ubuntu.qcow 100G
- $ qemu-system-xi386 -hda ubuntu.img -boot d -cdrom ubuntu-0.0.0.iso -m 2048
- qemu-system-x86_64
- windows 7 최소요구사항 (32bit 1G ram, 16G hdd), (64bit 2G ram, 20G hdd)

## run
- $ qemu -hda disk.img

## limbo
- android qemu
- https://github.com/limboemu/limbo/wiki

## ref
- https://www.unixmen.com/how-to-install-and-configure-qemu-in-ubuntu/
- https://savegyd.com/install-windows-10-on-android-using-limbo/

----
# linux-work

## ubuntu-pc-사용기 d20180906
- ubuntu 16.04.5 lts + xfce-desktop
- 리눅스로 개발 사용 작업, java eclipse base
- docker를 사용하기 좋음. 최고 장점. mac 보다 뛰어남.
- xfce 기준 화면 구성이 단순하고 속도가 빠름
- windows 와 비교 shell 작업이 용이.
- 프로그램이 부족함을 느낌(일부 windows mac 까지만 지원함, unity3d 프로그램이 가장 문제)
- 삽질을 해야함. 버그가 있음.
- 개발작업에 있어서 부족함 보다 장점이 많음.
- mac(완성형 리눅스??) > linux > windows10(내부 linux 는 없는듯한 기능)

## ubuntu 18.04 lts 작업기 d20190520
- 삽질은 반복된다.
- ibus로 전환 필요(x). 에서 다시 fcitx
    - 기존 ubuntu 16.04 lts 에서 기본 한글 입력기가 fcitx 이고 문제가 없는것으로 보여 사용했는데,
    - ubuntu 18.04 lts + xfce 에서 사용중 intellij community, android-studio 에서 한글 입력 문제가 보여 fcitx 사용.(클린 설치로 확인 필요)
- xfce 는 별로 변한것이 없는듯한데 키보드 충돌이 자주.
- gnome 은 자주 변하는것이 설정하기가 아직 어려움. 16.04 / 18.04 lts 기준 변경됨.
	- 비교적 고스팩이라 동작이 미려하고, 기본설치에 기능이 많음.
- android 에 설치되는 앱 AnLinux 기준 18버전.
- 드디어 bootcamp 를 작업하다. bootcamp 는 필수. on github private free
- windows 에도 linux 가 계속해서 작업됨
- mac osx 는 연동기능으로 발전하여 운영체제의 변화는 점점 줄어듬.
- linux universe. linux first

## startup ubuntu 작업기 d20190520
- ubuntu 를 쓸수 있다.
- 하지만 유료 tool 인텔리제이가 없음. 커뮤니티 에디션이라도 설치해야 다른사람을 따라갈 수 있다.
- 우분투에서 사용하니 단축키가 일부 꼬임. xfce4
- 에디터 vscode 도 운영체제 기본 단축키에 따라 단축키가 꼬임
- osx 사용시도 결국 개인화가 필요했음 그러면 운영체제 구분도 사실상의미가 적음.
- 개인 에디터를 사용하면 좋겠다고 생각하며, 이런 설정은 우분투에서 하기 좋아 보임. android-ubuntu
- 인텔리제인 커뮤니티 버전 arm 설치 실행가능 java 기반으로 돌아감.
