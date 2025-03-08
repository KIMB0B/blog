---
title: 스프링 테스트에서 Transaction으로 데이터 격리 적용하기
date: 2025-03-08T17:33:00
---
# 데이터 격리 처리가 필요한 이유

각 테스트별로 데이터가 추가가 되면, 이는 다른 테스트에 영향을 줄 수 있고, 또 테스트를 중복 실행할 때 이전에 성공했던 테스트가 다음엔 실패하게 될 수 있습니다.

**테스트의 일관성을 유지**하고, **다른 테스트에 간섭을 하지 않기 위해서** 테스트를 위해 생성했던 데이터는 테스트가 끝나면 모두 지워줘야 합니다.

그러나 생성했던 데이터 하나하나를 `DELETE SQL`을 사용해서 지워주면 복잡도 하고, 테스트 실행 도중 `DELETE SQL`이 실행되기 전에 예외가 발생하여 삭제가 되지 않을 수도 있습니다. 

때문에 [[Transaction]]을 통한 데이터 격리가 필요합니다.

# 적용 방법

## 1. 직접 데이터 롤백

[[PlatformTransactionManager]]을 통해 직접 Transaction을 열고 테스트가 끝날 때 `rollback`을 하도록 테스트 코드를 작성합니다.

```java
@SpringBootTest
class DbTest {
	
	@Autowired
	PlatformTransactionManager transactionManager;
	TransactionStatus status;
	  
	@BeforeEach  
	void beforeEach() {  
	    status = transactionManager.getTransaction(new DefaultTransactionDefinition());  
	}  
	  
	@AfterEach  
	void afterEach() {  
	    transactionManager.rollback(status); // 롤백 진행
	}
	
	@Test
	void asnvsab() {
		...
	}
}
```
>[!note] 정리
>`BeforeEach` 함수는 매 테스트가 실행되기 전에 실행되는데, 여기서 `PlatformTransactionManager`의 `getTransaction()`을 실행하여 트랜잭션을 시작합니다.
>`AfterEach` 함수는 매 테스트가 끝난 후 실행되는데, 여기선 `rollback()`을 실행하여 각 테스트를 진행하며 실행된 DDL 쿼리를 롤백합니다.

## 2. [[@Transactional]] 사용

@Transactional을 테스트 클래스에서 사용하면 트랜잭션 환경을 구성 후, 각 테스트가 끝날 때 자동으로 rollback하도록 해줍니다.

```java
@Transactional
@SpringBootTest
class DbTest {
	
	@Test
	void asnvsab() {
		...
	}
}
```
> [!note] 정리
> 위 경우는 클래스에 `@Transactional`을 넣어 해당 클래스 내의 모든 메서드에서 트랜잭션이 시작되고 자동으로 rollback됩니다.
> 만약 특정 메서드에만 트랜잭션 환경을 구성하고 싶으면 해당 메서드에 `@Transactional`을 넣어주면 됩니다.