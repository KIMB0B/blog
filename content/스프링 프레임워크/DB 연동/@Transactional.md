---
title: "@Transactional이란?"
date: 2025-03-03T17:02:00
---
# @Transactional의 정의

> 트랜잭션을 시작하고 커밋, 롤백 후 트랜잭션을 종료하는 과정을 서비스 로직에서 분리하기 위해 `트랜잭션 프록시`를 만드는 과정을 처리해주는 어노테이션

# 사용 예시

## 1. 클래스에서 사용

```java
@Transactional
public class Service() {
	
	public void save() {
	
	}
	
	public void delete() {
	}
}
```
> [!note] 정리
> 클래스에서 `@Transactional` 사용 시 하위의 모든 메서드인 `save()`, `delete()`에 트랜잭션이 적용됩니다.

## 2. 메서드에서 사용

```java
public class Service() {
	
	@Transactional
	public void save() {
	
	}
	
	public void delete() {
	}
}
```
> [!note] 정리
> 메서드에서 `@Transactional` 사용 시 해당 메서드에만 트랜잭션이 적용됩니다.

# Main과 Test 환경에서 사용 시 차이점

| **환경**           | **동작 방식**                                |
| ---------------- | ---------------------------------------- |
| **Main (운영 환경)** | 실제 데이터베이스에 반영됨 (commit 발생)               |
| **Test 환경**      | 기본적으로 rollback 처리됨 (테스트 종료 후 데이터가 남지 않음) |
# 옵션

\[@Transactional 코드]
```java
public @interface Transactional {
	
	String value() default "";
	String transactionManager() default "";
	Class<? extends Throwable>[] rollbackFor() default {};
	Class<? extends Throwable>[] noRollbackFor() default {};
	Propagation propagation() default Propagation.REQUIRED;
	Isolation isolation() default Isolation.DEFAULT;
	int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;
	boolean readOnly() default false;
	String[] label() default {};
	
}
```

## 1. value / transactionManager

등록된 [[Bean]] 중 어떤 [[PlatformTransactionManager|TransactionManager]]를 사용할지 알려주는 옵션입니다.<br>사용할 스프링 빈의 이름을 넣어주면 됩니다.

```java
public class Service {
	
	@Transactional(value = "memberTxManager")
	public void member() {...}
	
	@Transactional(transactionManager = "orderTxManager")
	public void order() {...}

}
```

## 2. rollbackFor / noRollbackFor

`@Transactional`은 원래 런타임 에러가 발생하면 롤백하고, 체크 예외가 발생하면 커밋합니다. [[AOP#3. 체크 예외는 커밋, 언체크 예외는 롤백|관련 내용]]

체크 예외여도 롤백이 되도록 하고 싶은 특정 체크예외 클래스를 지정할 수 있습니다.

```java
public class Service {
	
	@Transactional(rollbackFor = Exception.class)
	public void member() {...}
	
}
```

체크 예외인 `Exception`과 그 하위 예외들이 `member()`에서 발생하더라도 commit 대신 rollback이 됩니다.

`noRollbackFor`는 `rollbackFor`와 반대로 동작합니다.

## 3. propagation

## 4. isolation

트랜잭션의 격리 수준을 지정합니다. 

\[격리 수준\]
- `DEFAULT` : 데이터베이스에서 설정한 격리 수준을 따른다.
- `READ_UNCOMMITTED` : 커밋되지 않은 읽기
- `READ_COMMITTED` : 커밋된 읽기
- `REPEATABLE_READ` : 반복 가능한 읽기
- `SERIALIZABLE` : 직렬화 가능

## 5. timeout

트랜잭션 수행 시간을 초단위로 설정합니다.

# 6. readOnly

기본적으론 읽기/쓰기가 모두 가능한 트랜잭션이 기본적으로 생성되지만, 읽기만 가능하도록 설정하고 싶다면 `@Transactional = readOnly=true`