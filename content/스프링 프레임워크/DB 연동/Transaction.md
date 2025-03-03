---
title: Transaction이란?
date: 2025-03-02T00:36:00
---
# Transaction의 정의

> 데이테베이스에서 상태를 변화시키기 위해 수행하는 작업의 단위

ex) A가 B에게 5000원을 송금하는 경우
	-> A의 잔고에서 5000원을 감소시키고, B의 잔고에서 5000원을 증가시키는 작업이 하나의 Transaction이 됩니다.

 ---
# Transaction이 안지켜져 문제가 되는 경우

A가 B에게 5000원 송금을 하는데, 오타로 인해 아래와 같이 실행되면 문제가 생깁니다.
```sql
update member set money=10000 - 5000 where member_id = 'memberA';
update member set money=10000 + 5000 where member_iddd = 'memberB';
```

A의 출금 처리는 되었지만 B의 입금 처리에 오류가 생기면서 출금만 된 채 송금이 종료되었습니다. 
이로인해 A는 5000원, B는 10000원의 금액을 가지며 5000원이 공중분해되었습니다...

## ✅ 해결 방법

출금과 송금 작업을 하나의 Transaction으로 묶습니다.

사전에 `set autocommit = false`로 진행하고 비즈니스 로직 진행 중 오류가 발생하면 `rollback`으로 이전 상태로 되돌리고, 문제가 없으면 `commit`으로 송금 처리를 완료하게 하면 안전한 송금이 가능합니다.

---
# 단순 적용
## 1. 같은 커넥션 내에서 작업되도록 수정

위 해결 방법을 그대로 적용하기 위해서는 두 업데이트 적용이 같은 커넥션에서 실행이 되어야 합니다.
그러나 [[Connection Pool]]을 사용중이라면 update를 진행할 때 Connection Pool이 준비해둔 커넥션을 하나씩 받아 작업하기 때문에, 커넥션을 한번만 생성하고 인자로 커넥션을 받도록 수정해야합니다.

\[Before]
```java
public class BeforeRepository {  
  
    private final DataSource dataSource;
    
	public Member findById(String memberId) throws SQLException {  
	    String sql = "select * from MEMBER where member_id = ?";  
	  
	    Connection con = null;  
	    PreparedStatement pstmt = null;  
	    ResultSet rs = null;  
	  
	    try {  
	        con = dataSource.getConnection(); 
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setString(1, memberId);  
	  
	        rs = pstmt.executeQuery();  
	        if (rs.next()) {  
	            Member member = new Member();  
	            member.setMemberId(rs.getString("member_id"));  
	            member.setMoney(rs.getInt("money"));  
	            return member;  
	        } else {  
	            throw new NoSuchElementException("member not found memberId=" + memberId);  
	        }  
	    } catch (SQLException e) {  
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(pstmt);  
	        JdbcUtils.closeResultSet(rs);  
	        JdbcUtils.closeStatement(con);
	    }  
	}  
	  
	public void update(String memberId, int money) throws SQLException {  
	    String sql = "update MEMBER set money=? where member_id=?";  
	  
	    Connection con = null;  
	    PreparedStatement pstmt = null;  
	  
	    try {  
	        con = dataSource.getConnection(); 
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setInt(1, money);  
	        pstmt.setString(2, memberId);  
	        int resultSize = pstmt.executeUpdate();  
	        log.info("update resultSize={}", resultSize);  
	    } catch (SQLException e) {   
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(pstmt);
	        JdbcUtils.closeStatement(con);
	    }  
	}
}
```

\[After]
```java
public class AfterRepository {  
	
	private final DataSource dataSource;
    
	public Member findById(Connection con, String memberId) throws SQLException {  
	    String sql = "select * from MEMBER where member_id = ?";  
		
	    PreparedStatement pstmt = null;  
	    ResultSet rs = null;  
		
	    try {  
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setString(1, memberId);  
			
	        rs = pstmt.executeQuery();  
	        if (rs.next()) {  
	            Member member = new Member();  
	            member.setMemberId(rs.getString("member_id"));  
	            member.setMoney(rs.getInt("money"));  
	            return member;  
	        } else {  
	            throw new NoSuchElementException("member not found memberId=" + memberId);  
	        }  
	    } catch (SQLException e) {   
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(pstmt);  
	        JdbcUtils.closeResultSet(rs);  
	    }  
	}
	
	// 기존 findById <- transaction에서가 아닌 그냥 member를 찾을 때 사용하기 위함
	public Member findById(String memberId) { ... }
	
	public void update(Connection con, String memberId, int money) throws SQLException {  
	    String sql = "update MEMBER set money=? where member_id=?";  
		
	    PreparedStatement pstmt = null;  
		
	    try {  
	        pstmt = con.prepareStatement(sql);  
	        pstmt.setInt(1, money);  
	        pstmt.setString(2, memberId);  
	        int resultSize = pstmt.executeUpdate();  
	        log.info("update resultSize={}", resultSize);  
	    } catch (SQLException e) {  
	        throw e;  
	    } finally {  
	        JdbcUtils.closeStatement(pstmt);  
	    }  
	}
}
```
> [!note] 주요 변경점
> Connection을 [[DataSource]]에서 가져오는 것이 아닌 인자값에서 넣어져서 가져오는 방식으로 변경되었습니다.
> 
> 그리고 가져온 Connection은 여기서 끊어버리면 안되기 때문에 finally부분에서 Connection을 close하는 부분은 제거했습니다.

## 2. 서비스 로직 변경

[[#✅ 해결 방법]]에서 얘기한 대로 출금, 입금 로직을 실행할 때 앞 뒤로 autocommit을 false로 설정하고 성공시 commit, 실패시 rollback이 되도록 설정해줘야합니다.

\[Before]
```java
public class BeforeService {  
	
    private final Repository repository;  
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
        Member fromMember = repository.findById(fromId);  
        Member toMember = repository.findById(toId);  
		
        repository.update(fromId, fromMember.getMoney() - money);  
        validation(toMember);  
        repository.update(toId, toMember.getMoney() + money);  
    }  
	
	// 예외를 일부러 발생시키기 위한 경우
    private static void validation(Member toMember) {  
        if (toMember.getMemberId().equals("ex")) {  
            throw new IllegalStateException("이체중 예외 발생");  
        }  
    }  
}
```

^005d9f

\[After]
```java
public class AfterService {  
	
    private final DataSource dataSource;  
    private final Repository repository;  
	
    public void accountTransfer(String fromId, String toId, int money) throws SQLException {  
        Connection con = dataSource.getConnection();  
        try {  
            con.setAutoCommit(false);  
			//************기존 로직************//
            Member fromMember = repository.findById(con, fromId);  
			Member toMember = repository.findById(con, toId);  
  
			repository.update(con, fromId, fromMember.getMoney() - money);  
			validation(toMember);  
			repository.update(con, toId, toMember.getMoney() + money);
			//************기존 로직************//
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
	
	private static void validation(Member toMember) {  
        if (toMember.getMemberId().equals("ex")) {  
            throw new IllegalStateException("이체중 예외 발생");  
        }  
    }  
}
```

^e526ac

> [!note] 주요 변경점
> 기존 서비스 로직 앞뒤로 트랜잭션을 관리하는 기능이 추가되었습니다.
> 
> 우선, autocommit을 비활성화한 상태에서 로직을 실행하며, 실행 중 오류가 발생하면 rollback()을 호출하여 이전 상태로 되돌립니다. 반대로 정상적으로 실행되었을 경우에는 commit()을 실행하여 변경사항을 확정합니다. 이를 통해 오류가 발생하더라도 송금이 이루어지기 전 상태로 복구할 수 있도록 했습니다.
> 
> 또한, finally 블록에서 Connection 객체를 반환하기 전에 autocommit을 다시 true로 설정했습니다. 이는 Connection의 기본 autocommit 값이 true이므로, 반환된 Connection이 다른 곳에서 사용될 때 예상치 못한 트랜잭션 문제를 방지하기 위함입니다. 마지막으로 close()를 호출하여 연결을 안전하게 종료하도록 처리했습니다.

## 3. 실행해보기

현재 아래와 같이 Database가 구성되어 있다고 가정해보겠습니다.

| member_id | **money** |
| --------- | --------- |
| memberA   | 10,000    |
| ex        | 10,000    |

[[#^e526ac|서비스 로직]]의 validation()을 확인해보면 ex라는 이름의 member에게 이체하면 오류가 발생되도록 설정했습니다.
그럼 memberA가 ex에게 5,000원을 이체하더라도 오류가 발생하여 rollback이 되며 각 member는 다시 10,000원씩 갖게 될 것입니다.

확인하기 위한 테스트코드를 작성하고 실행해보겠습니다.

```java
class TransactionTest{
	
	DriverManagerDataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);
	private Repository repository = new Repository();
	private Service service = new Service(dataSource);
	
	@Test  
	@DisplayName("이체중 예외 발생")  
	void accountTransferEx() throws SQLException {  
		
		String memberA_id = "memberA"
		String memberEX_id = "ex"
		
	    assertThatThrownBy(() -> service.accountTransfer(memberA_id, memberEX_id, 5000))  
	        .isInstanceOf(IllegalStateException.class);  
		
		// 여기 findById는 기존 findById를 사용하여 connection정보를 전달하지 않음
	    Member findMemberA = repository.findById(memberA_id);
	    Member findMemberEX = repository.findById(memberEX_id);  
	    
	    assertThat(findMemberA.getMoney()).isEqualTo(10000);  
	    assertThat(findMemberEX.getMoney()).isEqualTo(10000);  
	}
}
```

해당 테스트코드를 확인해보면 ex 사용자에게 송금을 하는 상황이니 Service에서 작성한 대로 IllegalStateException 오류가 발생해야 합니다.
그리고 오류가 발생했으니, 송금하기 전의 상태인 각각 10,000원씩 갖고 있는 상태로 돌아갔는지 확인했습니다.

![[Pasted image 20250302094906.png]]

결과적으로 해당 테스트코드가 성공적으로 돌아간 것을 확인할 수 있었습니다.

그러나, 서비스 클래스에 서비스 로직 이외의 과정이 복잡하게 같이 들어있습니다.
때문에 이를 해결해야 합니다.
해결하는 과정은 아래 글에 있습니다.
-> [[스프링의 Transaction 처리]]