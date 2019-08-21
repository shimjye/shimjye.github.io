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
- aws rds utf8mb4
```
character_set_client     = utf8mb4            
character_set_connection = utf8mb4            
character_set_database   = utf8mb4            
character_set_filesystem = binary             
character_set_results    = utf8mb4            
character_set_server     = utf8mb4            
character_set_system     = utf8               
collation_connection     = utf8mb4_unicode_ci 
collation_database       = utf8mb4_unicode_ci 
collation_server         = utf8mb4_unicode_ci
```
- /etc/mysql/my.cnf
```
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
init_connect=set collation_connect=utf8mb4_general_ci
init_connect=set names utf8mb4
[mysql]
default-character-set=utf8mb4
[mysql_safe]
default-character-set=utf8mb4
[client]
default-character-set=utf8mb4
[mysqldump]
default-character-set=utf8mb4
```
- SHOW GLOBAL VARIABLES WHERE Variable_name LIKE 'character\_set\_%' OR Variable_name LIKE 'collation%';
- 외부접속 bind-address = 0.0.0.0
- mysql workbench connect
	- SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' 
	- SELECT * FROM user_info WHERE nickname LIKE '%😈%';

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
