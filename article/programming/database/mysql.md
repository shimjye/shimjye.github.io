# mysql

<!--
description = 정리자료
tag = programming, database, mysql
-->

## docker
- https://hub.docker.com/r/mysql/mysql-server/

```
$ docker run --name=mysql1 -p 3306:3306 -d mysql/mysql-server:5.7
$ docker logs mysql1 2>&1 | grep GENERATED
$ docker exec -it mysql1 mysql -uroot -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
```

## user setting

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
mysql> use mysql;
mysql> select host, user from user;
mysql> grant all privileges on *.* to 'root'@'172.17.%' identified by 'password';
mysql> flush privileges;
```

## conf
- kr
```
[mysqld]
character-set-server=utf8
collation-server=utf8_general_ci
init_connect=set collation_connect=utf8_general_ci
init_connect=set name utf8
[mysql]
default-character-set=utf8
[mysql_safe]
default-character-set=utf8
[client]
default-character-set=utf8
[mysqldump]
default-character-set=utf8
```
- 외부접속 bind-address = 0.0.0.0

## setting
- https://dev.mysql.com/doc/refman/5.7/en/charset-unicode-utf8mb4.html utfmb4
- ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='';
- common column

```
`seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
`insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
`insert_user` int(10) NOT NULL COMMENT '등록회원',
`update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
`update_user` int(10) NOT NULL COMMENT '수정회원',
`user_seq` int(10) NOT NULL DEFAULT '0' COMMENT '회원키',
`use_yn` int(10) NOT NULL DEFAULT '0' COMMENT '사용yn 0:n, 1:y',
`order_value` int(10) NOT NULL DEFAULT '0' COMMENT '순서값 desc',
`type_code` int(10) NOT NULL DEFAULT '0' COMMENT '타입',
```

## auto increment update
- ALTER TABLE tablename AUTO_INCREMENT = 1000

## encrypt aes-128
- http://info.michael-simons.eu/2011/07/18/mysql-compatible-aes-encryption-decryption-in-java/

