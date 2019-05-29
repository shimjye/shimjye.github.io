# common-design

<!--
description = 정리자료
tag = programming, design, api, user, session
-->

## api base rule
- 소문자를 사용, [_](underscore)사용. col_name
- 줄임 표현 미사용.
- boolean 미사용, 0,1과 같은 정수사용.
- header x-project-token -- 인증 토큰
- header x-project-device  -- android, ios 필요에 따라 고정값
- header x-project-fcm-token -- fcm 토큰, 푸시 사용.
- response model {"code": 1, "data": object or list, "message": ""}

## code

```
CREATE TABLE `code` (
  `seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
  `insert_user` int(10) NOT NULL COMMENT '등록회원',
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `update_user` int(10) NOT NULL COMMENT '수정회원',
  `order_value` int(10) NOT NULL DEFAULT '0' COMMENT '순서값 desc',
  `parent_seq` int(10) NOT NULL DEFAULT '0' COMMENT '부모키',
  `depth` int(10) NOT NULL DEFAULT '0' COMMENT '깊이',
  `name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '이름',
  `code_value` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '코드값',
  `description` varchar(4000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '설명',
  `extra` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '추가사항',
  PRIMARY KEY (`seq`),
  KEY `idx_code_01` (`parent_seq`,`order_value`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='코드';
```

## dual_number

```
CREATE TABLE `dual_number` (
  `seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='dual';

insert into dual_number (seq) values (1);
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;
```

## user, session
- api user join check (post) non-auth
- api user join (post) non-auth
- api user join facebook (post) non-auth
- api login (post) non-auth
- api login facebook (post) non-auth
- api req email-auth (post) non-auth
- api email-auth (put) by token
- api req reset-password (post) non-auth
- api reset-password (put) by token
- api session.validation (get)
- api session.refresh (put)
- api session.logout (delete)
- api user (get)
- api user modify (put)
- api user withdraw (delete)
- pw규칙 6~20(대,소,숫,특), random pw (소,숫,특) 8자
- id규칙 6~20(소,숫), 중복불가(admin, system, administrator, root)
- telephone format 000-0000-0000 (-구분사용)
- id, email, telephone 중복 허용안함.
- session 유지 1 year, 중복로그인 유지안함, 로그인시 기존 session 제거
- 특수문자 (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~) - ('"/\;: -+)

```
CREATE TABLE `user` (
  `seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
  `insert_user` int(10) NOT NULL COMMENT '등록회원',
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `update_user` int(10) NOT NULL COMMENT '수정회원',
  `use_yn` int(10) NOT NULL DEFAULT '0' COMMENT '사용yn 0:n, 1:y',
  `id` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '아이디 중복불가, 암호화, 이메일 형식',
  `password` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '비밀번호 단방향 암호화, 6~20(대,소,숫,특)',
  `name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '이름 암호화',
  `telephone` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '전화번호 모든타입간 중복불가, 암호화, 000-0000-0000',
  `email` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '이메일 타입별 중복불가, 암호화',
  `nickname` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '닉네임',
  `last_login_dt` datetime DEFAULT NULL COMMENT '마지막 로그인 일시',
  `login_type_code` int(10) NOT NULL DEFAULT '0' COMMENT '로그인 구분 0:시스템, 1:email회원, 2:fb회원, 3:google회원',
  `type_code` int(10) NOT NULL DEFAULT '0' COMMENT '구분 0:시스템, 1:일반회원, 2:b2b회원, 3:b2b관리자, 4:사장님, 5:관리자',
  `auth_yn` int(10) NOT NULL DEFAULT '0' COMMENT '인증yn 0:n, 1:y',
  `auth_dt` datetime DEFAULT NULL COMMENT '인증 일시',
  `agree_yn` int(10) NOT NULL DEFAULT '0' COMMENT '약관 동의 0:n, 1:y',
  `agree_dt` datetime DEFAULT NULL COMMENT '약관 동의 일시',
  PRIMARY KEY (`seq`),
  KEY `idx_user_01` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원';

CREATE TABLE `session` (
  `seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
  `insert_user` int(10) NOT NULL COMMENT '등록회원',
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `update_user` int(10) NOT NULL COMMENT '수정회원',
  `user_seq` int(10) NOT NULL DEFAULT '0' COMMENT '회원키',
  `session_key` varchar(4000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '세션키 쿠키값 S1|암호화(seq, user.seq, user.type, date, md5)',
  `session_value` varchar(4000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '세션값',
  `fcm_token` varchar(4000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'fcm토큰',
  PRIMARY KEY (`seq`),
  KEY `idx_session_01` (`user_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='세션';
```

## fb/google validation
- 참고 https://ole.michelsen.dk/blog/social-signin-spa-jwt-server.html
- google https://developers.google.com/identity/sign-in/web/backend-auth
- id_token jwt (about 900 char)
- GET https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=XYZ123
- facebook https://developers.facebook.com/docs/facebook-login/access-tokens?locale=ko_KR
- access_token (about 234 char)
- GET https://graph.facebook.com/me/accounts?access_token=1234
- GET https://graph.facebook.com/endpoint?key=value&access_token=app_id|app_secret
