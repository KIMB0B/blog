---
title: JPA란?
date: 2025-03-10T11:12:00
---
# JPA의 정의

> `JPA(Java Persistence API)`는 자바 객체를 관계형 데이터베이스와 매핑(`ORM, Object-Relational Mapping`)하기 위한 표준 API<br>즉, DB의 데이터들을 객체 다루듯이 다룰 수 있도록 해줍니다.

# ORM 매핑

프로젝트의 객체와 이 객체에 해당하는 DB의 테이블을 매핑할 수 있습니다.
아래는 그 예시입니다.

```java
@Data
@Entity
public class Member {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberId;
	
	@Column(name = "money")
	private Integer money
	
	pubic Member() {
	
	}
	
	public Member(Integer money) {
		this.money = money
	}
	
}
```
> [!note] 변경된 점
> - `@Entity` : 해당 애노테이션이 있으면 JPA가 해당 클래스를 엔티티라고 인식합니다.
> - `@Id` : 테이블의 PK와 매핑하는 필드라는 뜻입니다.
> - `@GeneratedValue` : PK생성값을 자동으로 정의된 값으로 사용한다는 뜻입니다.
> - `@Column` : DB의 컬럼과 매핑되는 필드라는 뜻입니다. 생략 가능합니다.
> - JPA는 `public Member() {}` 와 같은 기본 생성자가 필수입니다.

# Repository 구현

`EntityManager`를 주입받아서 제공하는 기능을 사용하며 구현이 가능합니다.<br>그리고 JPA에서 데이터의 변경이 일어나는 메서드는 꼭 [[@Transactional]]을 추가해줘야 합니다.

## 1. 저장

```java
@Repository
@Transactional
@RequiredArgsConstructor
public class Repository {

	private final EntityManager em;
	
	public Member save(Member member) {
		em.persist(member);
		return member;
	}
}
```

저장은 `EntityManager`가 제공하는 `persist()`를 사용합니다. <br>해당 기능을 통해 자동으로 생성된 PK값까지 알아서 처리되어 객체에 적용됩니다.

## 2. 조회

### 2-1. 일반 조건 조회

```java
@Repository
@Transactional
@RequiredArgsConstructor
public class Repository {

	private final EntityManager em;
	
	public Optional<Member> findById(Long id) {
		Member member = em.find(Member.class, id);
		return Optional.ofNullable(member);
	}
}
```

조회는 `EntityManager`가 제공하는 `find()`를 사용합니다.<br>처음에 return될 객체 클래스를 넣어주고, 그 다음에 조회할 조건이 될 id값을 넣어주면 됩니다.

### 2-2. 특수 조건 조회

```java
@Repository
@Transactional
@RequiredArgsConstructor
public class Repository {

	private final EntityManager em;
	
	public List<Member> findAll() {
		String jpql = "select i from Item i";
		TypedQuery<Item> query = em.createQuery(jpql, Member.class);
		return query.getResultList();
	}
}
```

특수한 조건으로 쿼리를 작성하여 조회하고 싶다면 `JPQL`을 작성하면 됩니다.<br>이는 일반적인 SQL과는 작성법이 다르고, 해당 쿼리와 받아올 결과값 형태 클래스를 넣어서 조회할 수 있습니다.

## 3. 수정

```java
@Repository
@Transactional
@RequiredArgsConstructor
public class Repository {

	private final EntityManager em;
	
	public void update(Long id, MemberUpdateDto updateParam) {
		Member member = em.find(Member.class, id);
		member.setMoney(updateParam.getMoney());
	}
}
```

수정은 특이한데, `EntityManager`가 제공하는 기능을 사용하는 것이 아니고, 객체의 `Setter`메서드를 사용합니다.<br>객체가 수정된 후 DB에 특정 기능을 통해 변경사항을 적용해줘야할 것 같지만 JPA는 객체에 수정만 진행해도 DB에 바로 적용이 알아서 됩니다.

# 예외 변환

JPA에서 발생하는 예외 상황을 위한 Exception 클래스들이 여러가지 있습니다.<br>대표적으로 `PersistenceException`와 그 하위 예외들, `IllegalStateException`, `IllegalArgumentException`이 있습니다.

이와같은 특정 데이터 접근 기술의 예외에 종속되는 것을 막기 위해 [[스프링에서의 Transaction 처리#3. 예외 누수 해결|예외 누수를 해결하는 과정]]이 필요했습니다.<br>하지만 JPA는 해당 과정을 자동으로 해결해줍니다. 이는 `@Repository`를 추가했기 때문입니다.

\[@Repository가 없는 경우]
![[Pasted image 20250310114556.png]]

\[@Repository를 추가한 경우]
![[Pasted image 20250310114623.png]]

`@Repository`가 붙은 클래스는 [[10. 알아서 해줘! Component Scan|Component Scan]]의 대상이 됩니다. <br>그리고 `@Repository`가 붙은 클래스는 JPA가 인식하여 알아서 예외 변환 AOP를 적용시켜서 JPA만의 Exception이 아닌, 스프링이 제공하는 예외로 변환됩니다.

# 스프링 데이터 JPA

> 스프링에서 JPA를 편리하게 사용할 수 있도록 공통 인터페이스를 구현해주고 쿼리 메서드를 지원해주는 라이브러리

## 1. 대표 기능

### 1-1. 공통 인터페이스 기능

일반적으로 Repository에서 구현하는 CRUD 기능들을 `JpaRepository`인터페이스를 통해 제공하기 때문에 코드가 간결해집니다.

\[Before]

```java
@Repository
@Transactional
@RequiredArgsConstructor
public class Repository {

	private final EntityManager em;
	
	public void update(Long id, MemberUpdateDto updateParam) {
		Member member = em.find(Member.class, id);
		member.setMoney(updateParam.getMoney());
	}
}
```

\[After]

```java
public interface Repository extends JpaRepository<Member, Long> {
}
```

![[Pasted image 20250312002558.png]]

위와같이 스프링 데이터 JPA가 구현 클래스를 보이지 않는 곳에서 자동으로 생성하여 [[Bean]]으로 등록합니다.

`JpaRepository`를 extends하여 사용할 수 있는데, JpaRepository<`엔티티 클래스`, `PK값 타입`>으로 넣어주면 됩니다.

### 1-2. 쿼리 메서드 기능

스프링 데이터 JPA에서 기본적으로 지원하는 메서드 외에 더 복잡한 메서드를 만들고자 한다면, 복잡한 쿼리나 코드 작성 없이 메서드의 이름에서 무슨 작업을 할 것인지 정의해주면 구현 가능합니다.

\[Before]

```java
public List<Member> findByUsernameAndAgeGreaterThan(String username, int age) {
	return em.createQuery("select m from Member m where m.username = :username and m.age > :age")
		.setParameter("username", username)
		.setParameter("age", age)
		.getResultList()
}
```

\[After]
```java
public interface Repository extends JpaRepository<Member, Long> {
	List<Member> findByUsernameAndAgeGreaterThan(String username, int age);
}
```

**규칙**
- 조회: `find…By` ,`read…By` , `query…By` , `get…By`
	- 예:) `findHelloBy` 처럼 ...에 식별하기 위한 내용(설명)이 들어가도 된다.
- COUNT: `count…By` 반환타입 `long`
- EXISTS: `exists…By` 반환타입 `boolean`
- 삭제: `delete…By` , `remove…By` 반환타입 `long`
- DISTINCT: `findDistinct` , `findMemberDistinctBy`
- LIMIT: `findFirst3` , `findFirst` , `findTop` , `findTop3`

물론 `JPQL`을 통한 구현도 가능합니다.

```java
public interface Repository extends JpaRepository<Member, Long> {
	@Query("select m from member m where m.username = :username and i.age > :age")
	List<Member> findUsers(@Param("username") String username, @Param("age") int age);
}
```