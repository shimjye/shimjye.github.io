# node.js

<!--
description = 정리자료
tag = programming, language, node
-->

## install nodejs, npm
- https://nodejs.org/ko/download/package-manager/
- install node.js 8.11.4 LTS

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## install gulp
- https://stackoverflow.com/questions/22224831/after-installation-of-gulp-no-command-gulp-found
- npm install --global gulp-cli

## install Yarn and Webpack or Parcel (bower deprecated)
- https://yarnpkg.com/en/docs/install#debian-stable
- npm install --global yarn
- https://github.com/webpack/webpack
- npm install --save-dev webpack

## install mvn
- $ brew install nvm
- .zshrc
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
# Node 버전 설치
$ nvm install <version>  # ex> nvm install 8.9.4

# 설치된 Node 버전 목록 확인
$ nvm ls  

# 사용할 Node 설정  
$ nvm use <version>  # ex> nvm use 8.9.4  
$ nvm use <alias>  # ex> nvm use default

# 사용할 alias 설정
$ nvm alias <alias> <version>  # ex> nvm alias test-v 8.9.4
```
