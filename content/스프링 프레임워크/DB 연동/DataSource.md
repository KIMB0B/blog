---
title: DataSource란?
date: 2025-02-28T19:01:00
---
# DataSource의 필요성

커넥션을 획득하는 방법은 DriverManager, [[Connection Pool]] 등 다양하게 있습니다.
![[Pasted image 20250228193038.png]]

DriverManager를 통해 커넥션을 획득하도록 로직을 구성하다가, 커넥션 풀을 사용하는 방법으로 변경하면 로직의 코드를 변경해야 합니다. 의존관계가 변경되고, 사용법이 조금씩 다르기 때문입니다.
![[Pasted image 20250228193208.png]]

이러한 문제를 해결하기 위하여 `javax.sql.DataSource`라는 인터페이스를 통해 커넥션을 획득하는 방법을 추상화하여 커넥션을 획득하는 방법을 변경하여도 문제가 없도록 만들었습니다.
![[Pasted image 20250228193323.png]]

---
# DataSource의 정의

>DataSource는 커넥션을 가져오는 `getConnection()`만을 핵심 기능으로 가지고있는 인터페이스입니다.

---
# 사용 예시

## 1. DriverManager

[[JDBC#1. 연결|단순히 DriverManager를 통해 Connection을 생성하는 방법]]이 아닌, DataSource가 적용된 상태의 DriverManager를 만드는 방법은 `DriverManagerDataSource`을 사용하면 됩니다.

```java
void dataSourceDriverManager() throws SQLException {

	DriverManagerDataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);
	
	Connection con1 = dataSource.getConnection();
	Connection con2 = dataSource.getConnection();
}
```

## 2. Connection Pool

```java
void dataSourceConnectionPool() throws SQLException, InterruptedException {
	HikariDataSource dataSource = new HikariDataSource();
	dataSource.setJdbcUrl(URL);
	dataSource.setUsername(USERNAME);
	dataSource.setPassword(PASSWORD);
	dataSource.setMaximumPoolSize(10);
	dataSource.setPoolName("MyPool");
	
	Connection con1 = dataSource.getConnection();
	Connection con2 = dataSource.getConnection();
	Thread.sleep(1000); //커넥션 풀에서 커넥션 생성 시간 대기(로그 보기 위함)
}
```

### 상태 확인

위 코드에서 생성된 MyPool의 로그를 보면 아래와 같은 상태를 확인할 수 있습니다.

`MyPool - After adding stats (total=10, active=2, idle=8, waiting=0)`

총 10개의 커넥션이 있는 Pool Size를 설정하고, con1과 con2를 통해 두개의 커넥션을 사용하고 있으니 active가 2, idle이 8로 나타납니다.

### 사이즈를 넘도록 connection을 요청한 경우

size가 현재 10인 MyPool에서 getConnection()을 11번 해서 사이즈를 초과하면 어떻게 될까요?
로그를 확인하면 아래와 같습니다.

`MyPool - After adding stats (total=10, active=10, idle=0, waiting=1)`

10개만 준비되어있는 커넥션 풀에서 초과해서 커넥션을 호출한 하나는 waiting상태가 되어 다른 connection이 반환되는 것을 기다립니다. 반환된 후 커넥션을 사용 가능합니다.

---
# 장점

DataSource를 사용하면서 Connection을 가져오는 가져오는 방식에 변경이 있어도 애플리케이션 로직에는 병경이 없도록 설계가 가능하기 때문에 `DI`와 `OCP`가 성립된 구현이 가능해집니다.