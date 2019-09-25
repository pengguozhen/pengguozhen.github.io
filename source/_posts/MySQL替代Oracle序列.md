---
title: 一、SQL 转换：Oracle 转 MySQL
CreateTime: 2019-4-1
categories:
- MySQL 学习
tags:
- MySQL 学习

---

**什么是自增长？**
- 自增长只能用于表中的其中一个字段。
- 自增长只能被分配给固定表的固定的某一字段，不能被多个表共用。
- 自增长会把一个未指定或NULL值的字段自动填上。

##### 一、在 Oracle 中如何实现 MySQL 的自增长？

请看下面的实例：
- 1-1、在 MYSQL 里有这样一张表:
``` sql
CREATE TABLE Movie(  
  id           INT NOT NULL AUTO_INCREMENT,  
  name     VARCHAR(60) NOT NULL,  
  released YEAR NOT NULL,  
  PRIMARY KEY (id)  
) ENGINE=InnoDB;  

INSERT INTO Movie (name,released) VALUES ('Gladiator',2000);  
INSERT INTO Movie (id,name,released) VALUES (NULL,'The Bourne Identity',1998);  
```

- 1-2、在 ORACLE 是这样的使用序列对象+触发器来完成 MySQL 的自增长功能
``` sql
CREATE TABLE Movie(  
 id          INT NOT NULL,  
 name     VARCHAR2(60) NOT NULL,  
 released INT NOT NULL,  
 PRIMARY KEY (id)  
);  
CREATE SEQUENCE MovieSeq;  
```



``` sql
INSERT INTO Movie (id,name,released) VALUES (MovieSeq.NEXTVAL,'Gladiator',2000);  
```

在 Oracle 下为表添加一个触发器，就可以实现 MySQL 自增长功能:
``` sql
1.  CREATE OR REPLACE TRIGGER BRI_MOVIE_TRG  
2.  BEFORE INSERT ON Movie  
3.  FOR EACH ROW  
4.  BEGIN  
5.  SELECT MovieSeq.NEXTVAL INTO :new.id FROM DUAL;  
6.  END BRI_MOVIE_TRG;  
7.  .  
8.  RUN;  
```

这样，插入记录就可以成为 MYSQL 风格：

``` sql
INSERT INTO Movie (name,released) VALUES ('The Lion King',1994);  
```

下面我们来看看如何在 mysql 数据里使用 Oracle 序列语法 .NEXTVAL 和  .CURVAL。

##### 二、MySQL 如何实现 Oracle 序列？
**一般使用序列 (Sequence) 来处理主键字段，在 MySQL中 是没有序列的，但是 MySQL有提供了自增长 (increment) 来实现类似的目的，但也只是自增，而不能设置步长、开始索引、是否循环等，最重要的是一张表只能由一个字段使用自增，但有的时候我们需要两个或两个以上的字段实现自增（单表多字段自增），MySQL本身是实现不了的，但我们可以用创建一个序列表，使用函数来获取序列的值。**

我们假设在 MySQL 中序列的语法是:

``` sql
NEXTVAL(’sequence’);
CURRVAL(’sequence’);
SETVAL(’sequence’,value);
```


``` sql
DROP TABLE IF EXISTS sequence;  
CREATE TABLE sequence (  
name              VARCHAR(50) NOT NULL,  
current_value INT NOT NULL,  
increment       INT NOT NULL DEFAULT 1,  
PRIMARY KEY (name)  
) ENGINE=InnoDB;  
 
 INSERT INTO sequence VALUES ('MovieSeq',3,5); 
 
  
```

###### 测试一下结果：
测试 **currval** 函数使用

```sql
/* currval 函数的实现 */
 DROP FUNCTION IF EXISTS currval;  
 DELIMITER $  
 CREATE FUNCTION currval (seq_name VARCHAR(50))  
 RETURNS INTEGER  
 CONTAINS SQL  
 BEGIN  
 DECLARE value INTEGER;  
 SET value = 0;  
 SELECT current_value INTO value  
 FROM sequence  
 WHERE name = seq_name;  
 RETURN value;  
 END$  
 DELIMITER ;
```

``` bash
1.  mysql> SELECT currval('MovieSeq');  
2.  +---------------------+  
3.  | currval('MovieSeq') |  
4.  +---------------------+  
5.  |                   3 |  
6.  +---------------------+  
7.  1 row in set (0.00 sec)  
8.  mysql> SELECT currval('x');  
9.  +--------------+  
10.  | currval('x') |  
11.  +--------------+  
12.  |            0 |  
13.  +--------------+  
14.  1 row in set, 1 warning (0.00 sec)  
15.  mysql> show warnings;  
16.  +---------+------+------------------+  
17.  | Level   | Code | Message          |  
18.  +---------+------+------------------+  
19.  | Warning | 1329 | No data to FETCH |  
20.  +---------+------+------------------+  
21.  1 row in set (0.00 sec)  
```

测试 **nextval** 函数使用

``` sql
/* nextval 函数的实现 */
DROP FUNCTION IF EXISTS nextval;  
DELIMITER $  
CREATE FUNCTION nextval (seq_name VARCHAR(50))  
RETURNS INTEGER  
CONTAINS SQL  
BEGIN  
UPDATE sequence  
SET          current_value = current_value + increment  
WHERE name = seq_name;  
RETURN currval(seq_name);  
END$  
DELIMITER ;  
```


``` bash
1.  mysql> select nextval('MovieSeq');  
2.  +---------------------+  
3.  | nextval('MovieSeq') |  
4.  +---------------------+  
5.  |                  15 |  
6.  +---------------------+  
7.  1 row in set (0.09 sec)  

9.  mysql> select nextval('MovieSeq');  
10.  +---------------------+  
11.  | nextval('MovieSeq') |  
12.  +---------------------+  
13.  |                  20 |  
14.  +---------------------+  
15.  1 row in set (0.01 sec)  

17.  mysql> select nextval('MovieSeq');  
18.  +---------------------+  
19.  | nextval('MovieSeq') |  
20.  +---------------------+  
21.  |                  25 |  
22.  +---------------------+  
23.  1 row in set (0.00 sec)  
```

测试 **setval** 函数的使用

``` sql
/* setval 函数的实现 */
DROP FUNCTION IF EXISTS setval;  
DELIMITER $  
CREATE FUNCTION setval (seq_name VARCHAR(50), value INTEGER)  
RETURNS INTEGER  
CONTAINS SQL  
BEGIN  
UPDATE sequence  
SET          current_value = value  
WHERE name = seq_name;  
RETURN currval(seq_name);  
END$  
DELIMITER ;  
```



``` lsl
1.  mysql> select setval('MovieSeq',150);  
2.  +------------------------+  
3.  | setval('MovieSeq',150) |  
4.  +------------------------+  
5.  |                    150 |  
6.  +------------------------+  
7.  1 row in set (0.06 sec)  

9.  mysql> select curval('MovieSeq');  
10.  +---------------------+  
11.  | currval('MovieSeq') |  
12.  +---------------------+  
13.  |                 150 |  
14.  +---------------------+  
15.  1 row in set (0.00 sec)  

17.  mysql> select nextval('MovieSeq');  
18.  +---------------------+  
19.  | nextval('MovieSeq') |  
20.  +---------------------+  
21.  |                 155 |  
22.  +---------------------+  
23.  1 row in set (0.00 sec)
```

##### 三、MySQL 替代 Oracle 序列实例：

- 1、问题场景：
**一般使用序列 (Sequence) 来处理主键字段，在 MySQL中 是没有序列的，但是 MySQL有提供了自增长 (increment) 来实现类似的目的，但也只是自增，而不能设置步长、开始索引、是否循环等，最重要的是一张表只能由一个字段使用自增，但有的时候我们需要两个或两个以上的字段实现自增（单表多字段自增），MySQL本身是实现不了的，但我们可以用创建一个序列表，使用函数来获取序列的值。**

-- MySQL 给数据表某个字段创建序列。
-- 序列：自增（步长、开始索引、是否循环），暂不考虑是否循环自增（触发器可实现？）
select * from PAN_WF_HISTORYNODE;-- ORDER_NUMBER 字段创建序列

-- 创建代替序列的数据表

``` sql
DROP TABLE IF EXISTS sequence;  
CREATE TABLE sequence (  
name              VARCHAR(50) NOT NULL, -- 序列 名称 50个字符最大值问题已够用，暂不考虑是否循环。
current_value INT NOT NULL,  -- 当前值
increment       INT NOT NULL DEFAULT 1,  -- 步长
PRIMARY KEY (name)  
) ENGINE=InnoDB;  
INSERT INTO sequence VALUES ('seq_hisnode',0,1);
```

--  处理 序列的 currval 函数

``` sql
Set global log_bin_trust_function_creators=1;-- 解决自定义函数报错：ERROR 1418-This function has none of DETERMINISTIC

DROP FUNCTION IF EXISTS currval;  
DELIMITER $  
CREATE FUNCTION currval (seq_name VARCHAR(50))  
RETURNS INTEGER  
CONTAINS SQL  
BEGIN  
  DECLARE value INTEGER;  
  SET value = 0;  
  SELECT current_value INTO value  
  FROM sequence  
  WHERE name = seq_name;  
  RETURN value;  
END$  
DELIMITER ;  

SELECT currval('seq_hisnode');-- 测试 该函数的使用。
```

-- 处理序列的 nextval 函数


``` sql
DROP FUNCTION IF EXISTS nextval;  
DELIMITER $  
CREATE FUNCTION nextval (seq_name VARCHAR(50))  
RETURNS INTEGER  
CONTAINS SQL  
BEGIN  
   UPDATE sequence  
   SET          current_value = current_value + increment  
   WHERE name = seq_name;  
   RETURN currval(seq_name);  
END$  
DELIMITER ;

select nextval('seq_hisnode');
INSERT into PAN_WF_HISTORYNODE values()
```


