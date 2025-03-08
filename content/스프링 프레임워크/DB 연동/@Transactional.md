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
