---
title: MyBatis란?
date: 2025-03-09T13:06:00
tags:
  - 스프링/DB연동
---

# MyBatis의 정의

> [[JdbcTemplate]]이 제공하는 기능을 제공하면서 추가로 `동적 쿼리`를 편리하게 작성할 수 있게 하는 `SQL Mapper`
> `XML`을 통해 SQL 쿼리를 작성하고 기능에 매핑할 수 있습니다.

# 적용 방법

`findAll()`에서 검색 기능이 있고, 검색 조건을 넣기 위한 `MemberSearchCond`가 있는 상황이라고 생각해보겠습니다.

```java
// MemberSearchCond.java

@Data
public class MemberSearchCond {
	
	private int money;
	
	public MemberSearchCond() {
	}
	
	public MemberSearchCond(int money) {
		this.money = money;
	}
}
```

그리고 해당 검색 조건보다 많은 돈을 가진 사용자를 보여주고, 만일 <u>검색 조건이 없다면 모든 사용자를 보여준다</u>고 생각해보겠습니다. ^af2564

## 0. MyBatis 설정

`application.properties`에서 MyBatis 관련 설정이 가능합니다.
```properties
# XML에서 객체 타입을 지정할 때 객체의 경로를 여기서 미리 지정해줄 수 있습니다.
mybatis.type-aliases-package=hello.memberservice.domain

# DB 컬럼명에서 snake case를 사용한 이름을 camel case로 자동으로 변경하여 매칭해줍니다.
mybatis.configuration.map-underscore-to-camel-case=true
```

^c767ab

## 1. Mapper 인터페이스 생성

```java
// hello.memberservice.repository.mybatis.MemberMapper.java
@Mapper
public interface MemberMapper {

	void save(Member member);
	void update(@Param("id") Long id, @Param("updateParam") UpdateMemberDto updateParam);
	Optional<Member> findById(Long id);
	List<Member> findAll(MemberSearchCond memberSearch)
}
```

^952bcc

>[!note] 정리
>`@Mapper`를 적용한 인터페이스는 MyBatis의 Mapper가 됩니다.
>해당 인터페이스에서는 XML에서 작성한 쿼리를 적용할 함수를 정의할 수 있습니다.
>
>`@Param`은 SQL Mapper 인터페이스의 메서드 파라미터를 SQL에서 사용할 수 있도록 이름을 지정해주는 역할을 합니다.
>함수의 파라미터가 한개만 있다면 굳이 지정해주지 않아도 됩니다.

## 2. XML 작성

### 2-1. XML 기본 틀

쿼리를 정의할 xml 파일은 java파일이 아니니 `src/main/resources`하위에 만들되, 해당 XML을 매핑해줄 클래스의 경로와 같은 곳에 생성되어야합니다.

위 경우 MemberMapper.java는 `src/main/java/hello/memberservice/repository/mybatis`에 있으니 XML 파일은 src/main/<span style="background:#fff88f">resources</span>/hello/memberservice/repository/mybatis에 만들어져야 합니다.

그리고 아래와 같이 기본 내용을 작성하고, mapper의 namespace는 해당 XML을 매핑할 매퍼를 지정해줍니다.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.memberservice.repository.mybatis.MemberMapper">

</mapper>
```

### 2-2. 기본 쿼리 작성

[[JdbcTemplate]]에선 `?` 혹은 `:이름`으로 매핑하던 걸 MyBatis에서는 `#{이름}`으로 매핑하여 값을 가져옵니다.

insert시 기본키가 자동 생성시에 [[JdbcTemplate#기본키 자동 지정 상황 대응하기|JdbcTemplate에서 적용한 방법]]처럼 귀찮은 구현은 필요 없이 `useGeneratedKeys`를 true로 지정해주고, 자동으로 지정되는 키의 이름을 `keyProperty`에 설정해주면 MyBatis가 알아서 적용해줍니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.memberservice.repository.mybatis.MemberMapper">

	<insert id="save" useGeneratedKeys="true" keyProperty="id">
		insert into member (money)
		values (#{money})
	</insert>
	
</mapper>
```

update도 비슷하게 작성하면 됩니다.
Mapper 인터페이스에서 `@Param`으로 UpdateMemberDto를 updateParam란 이름으로 지정해줬기 때문에 그 안의 값을 불러올 때는 아래와 같이 적용해야합니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.memberservice.repository.mybatis.MemberMapper">

	<update id="update">
		update member
		set money=#{updateParam.money},
		where member_id = #{id}
	</update>

</mapper>
```

select 조회 시에는 조회 후 나오는 데이터의 객체를 `resultType`으로 지정해줘야합니다.
해당 과정에서 객체의 패키지를 매번 입력하는 수고를 덜기 위해 [[MyBatis#^c767ab|MyBatis 설정]]에서 객체의 패키지 경로를 우선 설정해줬습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.memberservice.repository.mybatis.MemberMapper">

	<select id="findById" resultType="Item">
		select member_id, money
		from member
		where member_id = #{id}
	</update>

</mapper>
```

### 2-3. 동적 쿼리 작성

[[MyBatis#^af2564|검색 조건]]을 통해 findAll의 쿼리는 상황에 따라 바뀌어야 합니다.
- 검색조건이 있는 상황-> `select * from member where money > #{money}`
- 검색조건이 없는 상황->` select * from member`

이럴 땐 직접 where절을 사용하는 것이 아닌 `<where>`와 `<if>`를 사용하여 동적 쿼리를 작성할 수 있습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.memberservice.repository.mybatis.MemberMapper">

	<select id="findAll" resultType="Item">
		select member_id, money
		from member
		<where>
			<if test="money != null">
				and money &gt;= #{money}
			</if>
		</where>
	</update>

</mapper>
```
>[!warning] `&gt;`는 무엇일까?
>원래는 `money >= #{money}`가 와야합니다.
>하지만, `<`나 `>`는 XML에서 사용하는 기호이기 때문에 XML에선 이와 같은 특수기호는 `&lt;`나 `&gt;`로 나타냅니다.

> [!warning] `<where>`를 사용한 이유
> 위 상황으로 보면 굳이 `<where>`가 필요없이 `select * from member where` 후 바로 `<if>`를 사용하면 될 것 같아 보입니다.
> 하지만 이와 같이 작성하면 만일 if 조건이 거짓이 나올 경우 if문 안의 쿼리는 날아가기 때문에 `select * from member where;`라는 쿼리 자체가 실행됩니다.
> 그렇게 되면 where로만 끝나는 쿼리는 없기 때문에 문법 오류가 납니다.

> [!question] if 조건이 참이면 `select * from member where and money <= #{money}`가 되어 문법 오류가 나지 않나요?
> `<where>`안에 들어오는 쿼리의 맨 처음에 and가 있다면 해당 and는 지워집니다.
> 이렇게 만든 이유는 where의 조건이 여러 개 들어오게 된다면 어떤 조건이 참이 되어서 어디서부터 and를 써야할지 명확해지지 않기 때문에 전부 and로 시작하도록 써버리고 결과적으로 나온 쿼리의 맨 처음 and만 지워버리는 식으로 편리하게 구현되었습니다.

## 3. Repository 구현

이제 repository는 만들어놓은 Mapper 기능을 실행하는 방향으로 구현하면 됩니다. 

```java
@Repository
@RequiredArgsConstructor
public class Repository {
	
	private final MemberMapper memberMapper;
	
	public Member save(Member member) {
		memberMapper.save(member);
		return member;
	}
	
	public void update(Long memberId, MemberUpdateDto updateParam) {
		memberMapper.update(memberId, updateParam);
	}
	
	public Optional<Member> findById(Long id) {
		return memberMapper.findById(id);
	}
	
	public List<Member> findAll(MemberSearchCond cond) {
		return memberMapper.findAll(cond);
	}
}
```
>[!question] DataSource를 받는 부분이 사라졌는데, 그럼 데이터베이스 연결을 못하지 않나요?
>이제 Repository에서 [[DataSource]]를 받아오는 부분이 아예 사라졌습니다.
>하지만 Mapper에서 자동으로 `application.properties`에서 적용한 DB 정보를 통해 커넥션을 연결하는 등의 작업을 알아서 해주기 때문에 우리는 만들어놓은 Mapper만 주입하면 됩니다.

# Mapper의 원리

[[MyBatis#1. Mapper 인터페이스 생성|우리가 만든 Mapper]]를 보면 매퍼는 그저 인터페이스일 뿐이어서 [[Bean]]으로 등록되지 않습니다. 그런데 어떻게 해당 매퍼를 다른 클래스들이 가져와서 쓸 수 있을까요?

MyBatis는 사실 Mapper 인터페이스의 구현체를 자동으로 만듭니다. 그 후 해당 구현체를 Bean으로 등록하고, 그 구현체는 우리가 작성한 XML을 기반으로 만들어지는 `동적 프록시 객체`입니다.

![[Pasted image 20250309151537.png]]