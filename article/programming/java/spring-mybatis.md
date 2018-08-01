# Spring Mybatis

<!--
description = 정리자료
tag = programming, java, spring
-->

## 설정

- Pom.xml

```
<dependency>
	<groupId>commons-dbcp</groupId>
	<artifactId>commons-dbcp</artifactId>
	<version>1.4</version>
</dependency>
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.2.3</version>
</dependency>
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis-spring</artifactId>
	<version>1.2.1</version>
</dependency>
```

- Web.xml
- /WEB-INF/spring/root-context.xml
- /WEB-INF/mybatis/mybatis-context.xml
- Mapper.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.dao.MemberDao">
	<insert id="add" parameterType="map">
		insert into member (email,pass,nickname)
		values (#{email},#{pass},#{nickname})
	</insert>
	<select id="checkMember" parameterType="map" resultType="map">
		select * from member where email = #{email}
	</select>
</mapper>
```

- Dao

```
@Autowired
private SqlSession sqlSession;
public void method() {
	sqlSession.queryForObject("mapper namespace.queryId");
}
```

- Mysql Auto-increment key

```
<insert id="someId">
Query...
<selectKey keyProperty="no" resultType="int" order="AFTER">
Select Last_insert_id();
</selectKey>
</insert>
```

- 파라미터로 넘어간 map 에 key 값이 포함되어 결과
- Mapper #{value} statement 처리, ${value} replace 처리
- Lt gt 문자<![cdata[]]>사용 가능
- Param, result map 값 java.util.HashMap 동의어
- Param result VO 클래스 맵핑가능
