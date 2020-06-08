# python

<!--
description = 정리자료
tag = programming, language, python
-->

## python-env
- 설치 $ pip3 install virtualenv
- 환경생성 $ virtualenv .env
- 기본환경 $ virtualenv -p python3 [env_name]
- $ source .env/bin/activate
- $ deactivate

## pip
- $ pip3 install requests beautifulsoup4
- $ pip3 freeze > requirements.txt
- $ pip3 install -r requirements.txt

## mac-install
- $ brew install pyenv
- $ brew install pyenv-virtualenv
- .zshrc
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
- $ pyenv install --list
- $ pyenv install 3.5.2
- $ pyenv versions
- $ pyenv virtualenv 3.5.2 test_env
- $ pyenv shell[or activate] test

### requirements.txt
- $ pip freeze > requirements.txt
- $ pip install -r requirements.txt

### autoenv
- $ brew install autoenv
- .zshrc
    source $(brew --prefix autoenv)/activate.sh
- $ vim .env
    pyenv shell test_env
