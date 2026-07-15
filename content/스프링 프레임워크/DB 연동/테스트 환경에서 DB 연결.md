---
title: Test 환경에서의 데이터베이스 연결 방법
date: 2025-03-08T17:10:00
tags:
  - 스프링/DB연동
---

# 직접 연결

`test` 폴더 하위의 `resources/application.properties`에도 `spring.datasource.~` 설정을 추가해 줍니다.

```properties
# properties

spring.profiles.active = test
spring.datasource.url = jdbc:h2:tcp://localhost/~/test
spring.datasource.username = sa
spring.datasource.password = 
```

# 임베디드 DB 연결

## 1. 직접 생성하여 연결
테스트 시 검증할 용도로만 메모리에서 데이터베이스를 임시로 만들기 위해 임베디드 데이터베이스를 생성할 수 있습니다.

```java
// Application.java

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(ItemServiceApplication.class, args);
	}

	@Bean
	@Profile("test")
	public DataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.h2.Driver");
		dataSource.setUrl("jdbc:h2:mem:db;DB_CLOSE_DELAY=-1");
		dataSource.setUsername("sa");
		dataSource.setPassword("");
		return dataSource;
	}
}
```
>[!note] 정리
>`jdbc:h2:mem:db;` 이 부분이 중요한데, 이와 같이 적으면 임베디드로 동작하는 H2 데이터베이스를 사용할 수 있습니다.
>그리고 `DB_CLOSE_DELAY=-1`를 설정하면 데이터베이스 커넥션이 모두 종료되어도 임베디드 데이터베이스가 종료되지 않게 할 수 있습니다.

## 2. Spring에서 자동으로 생성하여 연결

Spring에서는 위와같은 임베디드 DB 생성 과정을 자동으로 해 줍니다. <br>`application.properties`에 datasource 설정 정보가 없고, [[Bean]]에 테스트용으로 임베디드 데이터베이스를 생성한 정보가 없으면 바로 위의 과정을 자동으로 진행합니다.

```java
// Application.java

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(ItemServiceApplication.class, args);
	}
	
	// 임베디드 DB 생성 과정 삭제
	/* @Bean
	@Profile("test")
	public DataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.h2.Driver");
		dataSource.setUrl("jdbc:h2:mem:db;DB_CLOSE_DELAY=-1");
		dataSource.setUsername("sa");
		dataSource.setPassword("");
		return dataSource;
	} */
}
```