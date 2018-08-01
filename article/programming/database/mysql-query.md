# mysql-query

<!--
description = 정리자료
tag = programming, database, mysql
-->

## rownum query
SELECT @ROWNUM := @ROWNUM + 1 as rnum
FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3) numbers
WHERE (@ROWNUM := 0) = 0;

## split query
SELECT numbers.n as order_val, SUBSTRING_INDEX(SUBSTRING_INDEX(val.col, ',', numbers.n), ',', -1) split
FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3) numbers
INNER JOIN (SELECT '7,8,9' as col) val
ON CHAR_LENGTH('7,8,9') - CHAR_LENGTH(REPLACE('7,8,9', ',', '')) >= numbers.n - 1
ORDER BY order_val;

## dual_number table
CREATE TABLE `dual_number` (
  `seq` int(10) NOT NULL AUTO_INCREMENT COMMENT 'key',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='dual';
insert into dual_number (seq) values (1);
insert into dual_number (seq) select seq + (select max(seq) from dual_number) from dual_number;

- splist
SELECT * FROM user
INNER JOIN (SELECT numbers.seq as order_val, SUBSTRING_INDEX(SUBSTRING_INDEX(val.col, ',', numbers.seq), ',', -1) split_val
FROM dual_number numbers
INNER JOIN (SELECT '1002, 1001, 1002' as col) val
ON CHAR_LENGTH('1002, 1001, 1002') - CHAR_LENGTH(REPLACE('1002, 1001, 1002', ',', '')) >= numbers.seq - 1) split
ON user.seq = split.split_val
ORDER BY split.order_val;
