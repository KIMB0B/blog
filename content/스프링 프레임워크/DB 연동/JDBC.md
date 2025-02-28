---
title: JDBC란?
date: 2025-02-28T16:34:00
---
# JDBC 정의

> Java에서 데이터베이스와 연동을 위해서 먼저 커넥션 연결을 확인하고 SQL을 전달해 DB로부터 결과를 응답받습니다.<br>그러나 데이터베이스의 종류(ex) MySQL, Oracle)에 따라 커넥션 연결, SQL, 결과 응답에 대한 방법이 다르기 때문에 데이터베이스별로 코드를 각각 작성하는 대신 자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API인 JDBC가 등장합니다.

---
# 대표적 기능

- `java.sql.Connection` - 연결
- `java.sql.Statement` - SQL을 담은 내용
- `java.sql.ResultSet` - SQL 요청 응답

즉 연결, SQL 전달, 응답된 결과 가져오기가 주요 JDBC 기능입니다.

---
# 단순 사용 예시

## 1. 연결

JDBC가 제공하는 `DriverManager.getConnection(url, username, password)`를 사용하면 연결을 생성할 수 있습니다.
반환값으로 [[#대표적 기능]]에서 설명한 `java.sql.Connection`을 반환하여 연결을 생성합니다.

```java
public class DBConnectionUtil {

	public static Connection getConnection() {
		try {
			Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
			return connection;
		} catch (SQLException e) {
			throw new IllegalStateException(e);
		}
	}
}
```

JDBC의 연결 방식을 통해 데이터베이스가 H2나 MySQL, Oracle 등 어떤 것이 오더라도 JDBC는 해당 데이터베이스에 맞는 연결 방식을 처리합니다.
![[Pasted image 20250228174622.png]]

## 2. SQL 전달

[[#대표적 기능]]에서 설명한 Statement 의 자식 타입인 `PreparedStatement`를 사용하여 DB에게 SQL을 전달합니다.
Connection 객체에서 지원되는 메서드인 `prepareStatement()`안에 문자열로 원하는 SQL문을 넣고, PreparedStatement 객체에서 지원되는 메서드인 `executeUpdate()`를 사용하여 실행 가능합니다.

```java title='Create 예시'
public Member save(Member member) throws SQLException {
	
	String sql = "insert into member(member_id, money) values(?, ?)";
	Connection con = null;
	PreparedStatement pstmt = null;
	
	try {
		con = getConnection();
		//*********************************************************//
		pstmt = con.prepareStatement(sql); // PreparedStatement 생성
		pstmt.setString(1, member.getMemberId()); // SQL에 들어갈 요소 설정
		pstmt.setInt(2, member.getMoney()); // SQL에 들어갈 요소 설정
		pstmt.executeUpdate(); // SQL 실행
		//*********************************************************//
		return member;
	} catch (SQLException e) {
		log.error("db error", e);
		throw e;
	} finally {
		close(con, pstmt, null);
	}
}
```

> [!note] PreparedStatement를 사용하는 이유
> 해당 클래스는 Statement의 자식 타입인데, 위에서 보다시피 SQL문에서의 `?` 부분을 바인딩 가능하게 해줍니다. setString(), setInt()등으로 ?에 들어갈 데이터를 설정할 수 있어 `SQL Injection`공격을 예방할 수 있습니다.

> [!note] executeUpdate()의 반환값
> 참고로 executeUpdate()는 성공 시 int형의 숫자를 반환합니다.<br>해당 숫자는 실행한 SQL로 영향을 받은 행의 수입니다.

## 3. 응답 데이터 받기

조회 쿼리를 실행 시 DB로부터 응답된 데이터를 받게됩니다.
이는 [[#대표적 기능]]에서 ResultSet 객체 형태로 받아오게 되며, PrepareStatement객체에서 지원하는 `executeQuery()`를 통해 만들 수 있습니다.
ResultSet에서 지원하는 메서드인 `next()`를 통해 데이터를 한 행씩 불러올 수 있습니다.

```java title='Read 예시'
public Member findById(String memberId) throws SQLException {
	
	String sql = "select * from member where member_id = ?";
	Connection con = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	try {
		con = getConnection();
		pstmt = con.prepareStatement(sql);
		pstmt.setString(1, memberId);
		//*********************************************************//
		rs = pstmt.executeQuery(); // ResultSet 생성
		if (rs.next()) { // 처음 한 행은 넘겨야 데이터가 있음
			Member member = new Member();
			member.setMemberId(rs.getString("member_id")); // 현재 행의 member_id 필드의 값을 불러오기
			member.setMoney(rs.getInt("money")); // 현재 행의 money 필드의 값을 불러오기
			return member;
		} else { // rs.next()가 false면 다음 값이 없다는 뜻이라 불러온 데이터가 없다는 뜻
			throw new NoSuchElementException("member not found memberId=" + memberId);
		}
		//*********************************************************//
	} catch (SQLException e) {
		log.error("db error", e);
		throw e;
	} finally {
		close(con, pstmt, rs);
	}
}
```

> [!note] rs.next()를 우선 한번 한 이유
> if문을 진행하면서 rs.next()를 통해 ResultSet으로 가져온 데이터를 한 행 넘기고 시작하게 구현했습니다.<br>이는 맨 처음 행을 무시한 것이 아니고, 원래 ResultSet에서 최초의 행은 데이터를 가리키고 있지 않아 next()를 한번 진행해야 데이터를 확인할 수 있습니다.

![[Pasted image 20250228183106.png]]

## 4. 리소스 정리

위에서 만든 Connection, Statement, ResultSet은 쿼리를 실행하고 나면 리소스 정리를 해줘야 합니다.
생성한 역순으로 ResultSet, Statement, Connection 순으로 종료를 해야하고, 하지 않을 시 `리소스 누수`가 일어나서 커넥션 부족으로 장애가 발생할 수 있습니다.

```java
private void close(Connection con, Statement stmt, ResultSet rs) {
	
	// ResultSet 종료
	if (rs != null) {
		try {
			rs.close();
		} catch (SQLException e) {
			log.info("error", e);
		}
	}
	
	// Statement 종료
	if (stmt != null) {
		try {
			stmt.close();
		} catch (SQLException e) {
			log.info("error", e);
		}
	}

	// Connection 종료
	if (con != null) {
		try {
			con.close();
		} catch (SQLException e) {
			log.info("error", e);
		}
	}
}
```

> [!question] try catch가 많은 이유
> 그냥 close()를 쓰지 않고 null이 아닐 때의 조건과 SQLException 예외일 때의 try catch문을 추가했습니다.<br>try catch문이 없으면 우선 종료중인 ResultSet을 종료하다 오류가 발생할 때, 밑의 Statement와 Connection은 리소스 정리를 시도해보지도 못하고 close()함수가 종료되어버리기 때문입니다.