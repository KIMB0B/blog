---
title: TransactionTemplate란?
date: 2025-03-03T16:36:00
tags:
  - 스프링/DB연동
---

# TransactionTemplate의 정의

> 템플릿 콜백 패턴을 적용하여 Transaction 과정에서 반복적으로 작업하는 `트랜잭션 만들기 -> 오류 없으면 commit하기 -> 오류 있으면 rollback하기`과정을 간단하게 진행하게 해 주는 클래스입니다.

---
# 기능

```java
public class TransactionTemplate {

	private PlatformTransactionManager transactionManager;
	
	public <T> T execute(TransactionCallback<T> action){..}
	
	void executeWithoutResult(Consumer<TransactionStatus> action){..}

}
```

- `execute()` : 응답 값이 있을 때 사용합니다.
- `executeWithoutResult()` : 응답 값이 없을 때 사용합니다.