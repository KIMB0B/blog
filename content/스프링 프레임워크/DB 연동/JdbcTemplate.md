---
title: JdbcTemplate란?
date: 2025-03-07T18:41:00
---
# JdbcTemplate의 정의

> 템플릿 콜백 패턴을 사용하여 [[JDBC]]를 직접 사용할 때 발생하는 반복 작업을 대신 처리해주는 유틸리티

# JDBC 단순 사용과의 비교

\[Before]
```java
@RequiredArgsConstructor
public class BeforeRepository {  
	
	private final DataSource dataSource;
	private final SQLExceptionTranslator exTranslator;
	
	public void update(String memberId, int money) { 
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
	        throw exTranslator.translate("update", sql, e);
	    } finally {  
	        JdbcUtils.closeStatement(rs);
	        JdbcUtils.closeStatement(pstmt); 
	        DataSourceUtils.releaseConnection(con, dataSource);
	    }  
	}
}
```

\[After]
```java
public class AfterRepository {  
	
	private final JdbcTemplate template;
	
	public AfterRepository(DataSource dataSource) {
		template = new JdbcTemplate(dataSource);
	}
	
	public void update(String memberId, int money) { 
	    String sql = "update MEMBER set money=? where member_id=?";  
		template.update(sql, money, memberId);
	}
}
```

> [!note] 처리해주는 반복 작업 목록
> - 커넥션 획득
> - `statement` 를 준비하고 실행
> - 결과를 반복하도록 루프를 실행
> - 커넥션 종료, `statement` , `resultset` 종료
> - 트랜잭션 다루기 위한 커넥션 동기화
> - 예외 발생시 스프링 예외 변환기 실행
> - 등등

# 이름을 지정하여 파라미터 바인딩하기

```java
String sql = "update MEMBER set money=? where member_id=?";  
template.update(sql, money, memberId);
```

해당 부분을 보면 파라미터 `?`가 있는 순서대로 들어갈 값을 update()의 파라미터로 넣었습니다.<br>하지만 이는 개발자가 직접 순서를 확인하며 넣는 것이기에 실수의 위험성이 커 SQL에서 `?`가 있는 부분에 이름을 지정하여 파라미터를 바인딩할 수 있습니다.

우선 JdbcTemplate대신 `NamedParameterJdbcTemplate`를 주입받도록 해야 합니다.<br>`NamedParameterJdbcTemplate`또한 [[DataSource]]를 주입받습니다.
```java
public class Repository {  
	private final NamedParameterJdbcTemplate template;
	
	public Repository(DataSource dataSource) {
		template = new NamedParameterJdbcTemplate(dataSource);
	}
	
	...
}
```

SQL의 파라미터 이름 지정은 아래와같이 SQL에서 `?`대신 `:이름`을 넣으면 됩니다.
```java
String sql = "update MEMBER set money=:money where member_id=:id";  
```

해당 파라미터에 들어갈 값을 매칭해줄 데이터를 생성하는 방법은 3가지가 있습니다.

## 1. Map 사용

java의 기본 기능인 Map을 사용하여 SQL에 넣은 파라미터의 이름과 해당 파라미터에 들어갈 값 쌍을 구성할 수 있습니다.

```java
public class Repository {  
	
	private final NamedParameterJdbcTemplate template;
	
	public Repository(DataSource dataSource) {
		template = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public void update(String memberId, int money) { 
	    String sql = "update MEMBER set money=:money where member_id=:id";
	    
	    Map<String, Object> param = Map.ofEntries(
			Map.entry("id", 1),
			Map.entry("money", 10000)
		);
		
		template.update(sql, param);
	}
}
```

## 2. MapSqlParameterSource 사용

Map과 유사하지만 SQL 타입을 지정할 수 있는 등 SQL에 더 특화된 기능을 제공합니다.
`SqlParameterSource`인터페이스의 구현체이고, Map보단 사용이 편리합니다.

```java
public class Repository {  
	
	private final NamedParameterJdbcTemplate template;
	
	public Repository(DataSource dataSource) {
		template = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public void update(String memberId, int money) { 
	    String sql = "update MEMBER set money=:money where member_id=:id";
	    
	    SqlParameterSource param = new MapSqlParameterSource()
		    .addValue("id", memberId)
		    .addValue("money", money);
		
		template.update(sql, param);
	}
}
```

## 3. BeanPropertySqlParameterSource 사용

SQL 쿼리에 바인딩할 파라미터를 객체의 필드로부터 자동으로 매핑해주는 기능을 제공합니다.<br>`SqlParameterSource`인터페이스의 구현체입니다.

만일 아래와 같이 update를 위한 Dto가 있다고 가정해보겠습니다.

```java
@Getter
public class UpdateMemberDto {
	
	private String id;
	private int money;
}
```

그럼 `UpdateMemberDto`객체로부터 SQL 쿼리에 매핑될 데이터를 BeanPropertySqlParameterSource를 통해 구성할 수 있습니다.

```java
public class Repository {  
	
	private final NamedParameterJdbcTemplate template;
	
	public Repository(DataSource dataSource) {
		template = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public void update(UpdateMemberDto updateMemberDto) { 
	    String sql = "update MEMBER set money=:money where member_id=:id";
	    
	    SqlParameterSource param = new BeanPropertySqlParameterSource(updateMemberDto);
		
		template.update(sql, param);
	}
}
```

# 