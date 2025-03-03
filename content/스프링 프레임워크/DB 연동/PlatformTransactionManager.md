---
title: PlatformTransactionManager란?
date: 2025-03-03T15:56:00
---
# PlatformTransactionManager의 정의

> 트랜잭션을 시작하고 커밋, 롤백하는 과정을 [[JDBC]]와 같은 특정 데이터 접근 기술에 종속되지 않게 하기 위해 추상화하여 만든 인터페이스

---
# 구조

![[Pasted image 20250303155058.png]]

---
# 기능

\[인터페이스 전체 구조]
```java
package org.springframework.transaction;

public interface PlatformTransactionManager extends TransactionManager {

	TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
	
	void commit(TransactionStatus status) throws TransactionException;
	
	void rollback(TransactionStatus status) throws TransactionException;

}
```

- `getTransaction()`: 트랜잭션을 시작합니다. 기존에 이미 진행중인 트랜잭션에 참여도 가능합니다.
- `commit()`: 트랜잭션을 커밋합니다.
- `rollback()`: 트랜잭션을 롤백합니다.

---
# TransactionSynchronizationManager

트랜잭션 매니저는 스프링이 제공하는 트랜잭션 동기화 매니저를 통해 리소스를 동기화할 수 있습니다.

한 로직의 여러 작업을 트랜잭션으로 처리하려면 같은 커넥션에서 진행이 되어야 하기 때문에 트랜잭션 매니저는 트랜잭션 동기화 매니저에 커넥션을 보관하고 Repository가 커넥션이 필요할 때 보관된 커넥션을 꺼내 사용하면서 커넥션을 동기화할 수 있습니다.

![[Pasted image 20250303160125.png]]