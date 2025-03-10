---
title: JPA란?
date: 2025-03-10T11:12:00
---
# JPA의 정의

> `JPA(Java Persistence API)`는 자바 객체를 관계형 데이터베이스와 매핑(`ORM, Object-Relational Mapping`)하기 위한 표준 API
> 즉, DB의 데이터들을 객체 다루듯이 다룰 수 있도록 해줍니다.

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

`EntityManager`를 주입받아서 제공하는 기능을 사용하며 구현이 가능합니다.

```java
@Repository
@Transactional
@RequiredArgs
public class Repository {

private final EntityManager em;


}
```