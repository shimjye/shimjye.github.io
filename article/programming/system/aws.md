# aws

<!--
description = 정리자료
tag = programming, system, aws
-->

## 계정관리 IAM 등록

## 서버관리 aws-ec2
- dev: t2.micro free tier
- ec2, rds t2.micro free tier
- ec2 t2.small 0.0288 (0.0288 * 750 = $21.6)

## 디비관리 rds-mysql 5.7
- rds t2.small 0.052 (0.052 * 750 = $39.0)

### rds setting
- mysql5.7.21 t2.micro(free) 1cpu 1Gram, 20GB GPSSD
- instance-id: service-mysql 
- vpc, subnet: default, public-access yes, ap-northeast-2a, new vpc security group
- db-name: {name}, port: 3306, backup days, 21:00 utc, monitor disable, log disable, maintenance disable

## 도메인관리 route53(domain) https
### route53 setting
- create host zone {domain}.com.
- ns soa 수정, 삭제하지 말것.
- 해당 서비스 name server 변경.
- create A레코드: name({name}), type(A-ipv4), value(ip)
- create CNAME: {sub-name}.{domain-name}.com, CNAME, {name}.ap-northeast-2.elasticbeanstalk.com
- domain godaddy(ttl 1hour) 네임서버 aws 로 변경(ttl 1day) 
- setting root domain
  - empty name, a-ipv4 type
  - alias set aws resource

### s3 cloudfront https
- https://aws.amazon.com/ko/premiumsupport/knowledge-center/cloudfront-https-requests-s3/
- origin-domain-name: s3 선택
- redirect https
- get head option
- price class 200
- cname new domain
- AWS Certificate Manager (ACM) in the US East
(N. Virginia) Region
- 결과 Domain Name {cf}.cloudfront.net
- route53 create record-set cname {cf}.cloudfront.net

### email 서비스 MX setting
- daum 스마트워크 무료 이메일 도메인 설정
- ses domain 설정, verify
- route53 mx 설정

## 방화벽관리 security-group

## 배포관리 beanstalk, elb, auto-scaling
### beanstalk setting
- chmod 400 mykey.pem
- ssh -i mykey.pem ec2-user@1.1.1.1
- web java, name: {name}
- software dev, live 생성 SPRING_PROFILES_ACTIVE=live
- instance micro, security-group default-vpn & new-sg
- capacity 1-4 cpu 60 20
- lb /health
- deploy rolling addition 50% rolling health
- network public zone-a zone-c

### aws eb-loadbalancer https
- key 생성 - dns 인증 사용 or email(도메인에 설정된 메일로 발송됨)
- dns 인증 최대 30분 *.{domain.com} 사용
- https://aws.amazon.com/ko/blogs/korea/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/
- eb loadbalancer https 설정(elb https 설정, 방화벽 설정)

### beanstalk procfile
- java_opts -Duser.timezone=Asia/Seoul -Dfile.encoding=UTF-8 -Xms2g -Xmx2g

## 로그관리
- s3 storage, cloudwatch

## price
- 월비용 10000 $ / 720 hour = 13 $/hour
- 13 $ / 0.25 $ (4cpu,16mem) = 서버수 50 ea (200cpu,800mem)
- 50 ea * 서버당 1000 tps = 50000 tps(50 ea)
- 1 user 10 tps(가중치) = 동접수 100 = 동접 5000(50 ea)
- 24 * 6(체류시간 10min) * 5000 =  72만 mau (서버당 1.44만 mau) / 회원 150만
