---
title: Spring에서 Transaction을 간단하게 처리하기
date: 2025-03-03T15:07:00
---
# Transaction 단순 처리 시 문제점

[[Transaction#2. 서비스 로직 변경|Transaction을 단순 처리한 Service]]를 확인하면 서비스 로직 뿐만이 아닌 과정이 많이 포함이 되어버리는 것을 확인할 수 있습니다.

이처럼 단순하게 커넥션에서 Transaction을 만들어 커밋 or 롤백 처리를 하게되면 여러 문제점이 나타나게 됩니다.

## 1. 트랜잭션 문제

- 서비스 계층은 구현 기술이 변경되더라도 최대한 유지할 수 있는, 즉 변화에 대응할 수 있는 계층이어야 합니다. 하지만 현재 서비스 계층은 Transaction 처리를 하면서 JDBC 기능에 종속이 되었습니다.

- 커넥션 유지를 위해서 파라미터에 커넥션을 넘기게 되었는데, 이러면 앞으로 Transaction을 유지하는 기능, 유지하지 않는 기능으로 같은 기능을 두개씩만들어야 하는 불편함이 생깁니다.

## 2. 불필요한 반복 패턴

- try, catch, finally로 모든 서비스 로직에 동일하게 적용해야 하는 반복 작업이 많습니다.
- 커넥션을 열고, `PreparedStatement`로 결과를 매핑하고, 연 커넥션과 리소스를 정리해줘야 하는 과정이 번거롭습니다.

## 3. 예외 누수

- `SQLException`은 JDBC 전용 예외입니다. JDBC가 아닌 JPA 등 다른 데이터 접근 기술을 사용하게 되면 이에 맞는 예외로 변경해야 해서 결국 서비스 코드를 수정해야 합니다.

---
# 문제 해결

## 1. 트랜잭션 문제 해결

JDBC가 아닌 다른 데이터 접근 기술로 변경하여도 문제가 되지 않도록 [[PlatformTransactionManager]]을 사용하여 `트랜잭션 추상화`과정을 진행합니다.

### 1-1. Repository에서 커넥션 가져오고 반환하는 법 수정

\[Before]
```java
@RequiredArgsConstructor
public class BeforeRepository {  
	
	private final DataSource dataSource;
	
	public void update(Connection con, String memberId, int money) throws SQLException {  
	    String sql = "update MEMBER set money=? where member_id=?";  
		
	    PreparedStatement pstmt = null;  
		
	    try {  
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setInt(1, money);  
	        pstmt.setString(2, memberId);  
	        pstmt.executeUpdate();  
	    } catch (SQLException e) {  
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(rs);
	        JdbcUtils.closeStatement(pstmt); 
	        JdbcUtils.closeStatement(con); 
	    }  
	}
}
```

\[After]
```java
@RequiredArgsConstructor
public class AfterRepository {  
	
	private final DataSource dataSource;
	
	public void update(String memberId, int money) throws SQLException {  
	    String sql = "update MEMBER set money=? where member_id=?";  
		
		Connection con = null;
	    PreparedStatement pstmt = null;  
		
	    try {  
		    con = DataSourceUtils.getConnection(datasource);
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setInt(1, money);  
	        pstmt.setString(2, memberId);  
	        pstmt.executeUpdate();  
	    } catch (SQLException e) {  
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(rs);
	        JdbcUtils.closeStatement(pstmt); 
	        DataSourceUtils.releaseConnection(con, dataSource);
	    }  
	}
}
```
>[!warning] 변경된 점
>파라미터에서 Connection을 받아오는 과정이 제거되었습니다. 또한 connection을 받아올 때와 닫을 때 DataSourceUtils의 getConnection(), releaseConnection()을 통해 받아오도록 수정되었습니다.

> [!note] DataSourceUtils
> DataSourceUtils는 [[PlatformTransactionManager#TransactionSynchronizationManager|트랜잭션 동기화 매니저]]를 통해 커넥션을 트랜잭션이 끝날 때 까지 유지하기 위한 기능을 제공합니다.
> 
> getConnection()에선 트랜잭션 동기화 매니저가 관리하는 커넥션이 없다면 새로 커넥션을 만들지만, 있다면 관리하던 커넥션을 반환해줍니다.
> 
> releaseConnection()은 트랜잭션 동기화가 관리하는 커넥션이 없다면 커넥션을 닫지만, 해당 커넥션이 트랜잭션을 사용하기 위한 커넥션인 경우 닫지 않고 트랜잭션 동기화 매니저에 다시 보관해둡니다.

### 1-2. Service에서 트랜잭션 시작, 커밋, 롤백을 트랜잭션 매니저를 사용하여 구현

\[Before]
```java
@RequiredArgsConstructor
public class BeforeService {  
	
    private final DataSource dataSource;  
    private final Repository repository;  
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    
        Connection con = dataSource.getConnection();
         
        try {  
            con.setAutoCommit(false);  
			//************비즈니스 로직************//
            ...
			//************비즈니스 로직************//
            con.commit();
        } catch (Exception e) {  
            con.rollback();  
            throw new IllegalStateException(e);  
        } finally {  
            if (con != null) {  
			    try {  
			        con.setAutoCommit(true);  
			        con.close();  
			    } catch (Exception e) {  
			        log.info("error", e);  
			    }
			}  
        }  
    }
}
```

\[After]
```java
@RequiredArgsConstructor
public class AfterService {  
	
    private final PlatformTransactionManager transactionManager; 
    private final Repository repository;  
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());  
        
        try {  
			//************비즈니스 로직************//
            ...
			//************비즈니스 로직************//
            transactionManager.commit();
        } catch (Exception e) {  
            transactionManager.rollback();  
            throw new IllegalStateException(e);  
        }
    }
}
```
> [!warning] 변경된 점
> PlatformTransactionManager를 주입받도록 변경되었습니다. 덕분에 Service 클래스에선 트랜잭션 시작, 커밋, 롤백 작업을 할 때 데이터 접근 기술에 종속되지 않게 수정되었습니다.
>
>트랜잭션을 생성할 때 트랜잭션 매니저에서 `getTransaction()`을 호출하여 생성할 수 있게 되었습니다. 해당 메서드를 실행하면 `TransactionStatus`형 데이터를 반환하는데, 이는 트랜잭션을 커밋, 롤백할 때 필요합니다.
>
>트랜잭션을 커밋, 롤백할 때 트랜잭션 매니저에서 `commit()`, `rollback()`을 호출하도록 수정되었습니다.

## 2. 불필요한 반복 패턴 해결

`트랜잭션을 생성 -> 성공 시 커밋 -> 오류 시 rollback`과정이 try catch문을 통해 불필요하게 반복되기 때문에 이 반복 패턴을 제거하는 과정을 진행합니다.

### 2-1. [[TransactionTemplate]] 사용

\[Before]
```java
@RequiredArgsConstructor
public class BeforeService {  
	
    private final PlatformTransactionManager transactionManager; 
    private final Repository repository;  
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());  
        
        try {  
			//************비즈니스 로직************//
            ...
			//************비즈니스 로직************//
            transactionManager.commit();
        } catch (Exception e) {  
            transactionManager.rollback();  
            throw new IllegalStateException(e);  
        }
    }
}
```

\[After]
```java
public class AfterService {  
	
	private final TransactionTemplate transactionTemplate;
    private final Repository repository; 
	
	public AfterService(PlatformTransactionManager transactionManager, Repository repository) {
		this.transactionTemplate = new TransactionTemplate(transactionManager);
		this.memberRepository = memberRepository
	}
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    transactionManager.executeWithoutResult((status) -> {
		    try {  
				//************비즈니스 로직************//
	            ...
				//************비즈니스 로직************//
	        } catch (SQLException e) {  
	            throw new IllegalStateException(e);  
	        }
	    })
    }
}
```
> [!warning] 변경된 점
> PlatformTransactionManager을 바로 사용하는 것이 아닌, 생성자로 받아오긴 하지만 이를 TransactionTemplate으로 만들어서 사용했습니다. 
>
>TransactionTemplate에서 지원하는 기능 중 현재는 응답할 데이터가 없는 로직이니 `executeWithoutResult()`를 사용하였습니다.
>
>이 후 트랜잭션을 시작하거나 커밋, 롤백하는 과정을 모두 제거했습니다.

> [!note] try catch문을 사용한 이유
> 위 람다 함수에서는 체크 예외는 밖으로 던질 수 없습니다. 때문에 체크 예외인 SQLException이 발생했을 때 언체크 예외인 `IllegalStateException`으로 바꿔 던지도록 하였습니다.

### 2-2. [[@Transactional]] 사용

[[#2-1. TransactionTemplate 사용|TransactionTemplate를 사용했을 때]]에도 여전히 서비스 로직에서 트랜잭션 처리 로직을 아예 제거할 수는 없었습니다.
서비스 로직에서 아예 비즈니스 로직만 남기기 위해 @Transactional을 사용합니다.

\[Before]
```java
public class BeforeService {  
	
	private final TransactionTemplate transactionTemplate;
    private final Repository repository; 
	
	public AfterService(PlatformTransactionManager transactionManager, Repository repository) {
		this.transactionTemplate = new TransactionTemplate(transactionManager);
		this.memberRepository = memberRepository
	}
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    transactionManager.executeWithoutResult((status) -> {
		    try {  
				//************비즈니스 로직************//
	            ...
				//************비즈니스 로직************//
	        } catch (SQLException e) {  
	            throw new IllegalStateException(e);  
	        }
	    })
    }
}
```

\[After]
```java
@Transactional
@RequiredArgsConstructor
public class AfterService {  
	
    private final Repository repository; 
	
	@Transactional
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
	    
		//************비즈니스 로직************//
	    ...
		//************비즈니스 로직************//
    }
}
```

```java
@Configuartion
public class Config {
	@Bean
	DataSource dataSource() {
		return new DriverManagerDataSource(URL, USERNAME, PASSWORD);
	}
	
	@Bean
	PlatformTransactionManager transactionManager() {
		return new DataSourceTransactionManager(dataSource());
	}
	
	@Bean
	Repository repository() {
		return new Repository(dataSource());
	}
	
	@Bean
	Service service() {
		return new Service(repository());
	}
}
```
> [!warning] 변경된 점
> 드디어 서비스 클래스에서 비즈니스 로직을 제외한 모든 트랜잭션 관련 작업을 제거했습니다. 그리고 해당 메서드에 @Transactional 어노테이션을 추가했습니다.
>
> 그리고 @Transactional은 스프링 AOP 기반으로 동작하기에 스프링 컨테이너에서 관리되는 [[Bean]]이어야 적용이 가능합니다. 때문에 @Component로 Bean을 등록하거나, @Configuration으로 Bean을 등록하여야 합니다.

### 2-3. DataSource와 PlatformTransactionManager 자동 등록

위 Configuration 코드에서 DataSource를 등록할 때 spring 설정을 통해 간편하게 자동 등록이 가능합니다. 

그리고 해당 DataSource가 등록되며 스프링은 자동으로 적절한 PlatformTransactionManager도 `transactionManager`라는 이름으로 자동으로 등록합니다.

\[application.properties]
```properties
spring.datasource.url=jdbc:h2:tcp://localhost/~/test  
spring.datasource.username=sa  
spring.datasource.password=
```

\[Configuration 클래스 수정]
```java
@Configuration
@RequiredArgsConstructor
public class Config {
	
	private final DataSource dataSource;
	
	@Bean
	Repository repository() {
		return new Repository(dataSource());
	}
	
	@Bean
	Service service() {
		return new Service(repository());
	}
}
```
> [!warning] 변경된 점
> DataSource를 생성할 때 따로 데이터베이스 정보를 넣지 않고 선언만 하여 스프링 설정을 통해 자동 생성되도록 변경했습니다.
>
>그리고 DataSource를 통해 자동으로 생성될 PlatformTransactionManager를 따로 또 생성하지 않았습니다.

---
# 최종 구조

![[Pasted image 20250303172631.png]]
