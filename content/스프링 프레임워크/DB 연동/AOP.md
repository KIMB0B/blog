---
title: 트랜잭션 AOP란?
date: 2025-03-15T16:34:00
---
# AOP의 정의

> **관점 지향 프로그래밍(AOP)** 을 이용하여 트랜잭션 관리를 자동화하는 기법<br>Spring에서는 [[@Transactional]]을 사용하면 **프록시**가 생성되며 AOP가 자동으로 적용됩니다.

# 스프링 컨테이너에 프록시 등록 과정

`TxBasicTest`라는 클래스에서 `BasicClass`를 가져온다고 가정합니다.<br>`BasicClass`에서 단 하나라도 [[@Transactional]]이 붙은 메서드가 있다면 `BasicClass`의 프록시가 자동으로 생성되며 [[Bean]]으로 등록됩니다.

![[Pasted image 20250315164121.png]]

그리고 프록시 클래스는 실제 `BasicClass`를 상속하는 관계를 갖습니다.

![[Pasted image 20250315164158.png]]

결과적으로 `TxBasicTest`에서 `BasicClass`의 기능을 호출하면, 사실은 `BasicClass`의 프록시를 호출하는 것이고 프록시는 실제 `BasicClass`를 참조하게 됩니다.

![[Pasted image 20250315164350.png]]

# AOP의 특징

## 1. 트랜잭션 적용 시점은 스프링 컨테이너 생성 후

AOP를 통해 트랜잭션이 적용되는 시점은 **스프링 컨테이너가 완전히 생성된 후**입니다.

그러므로 `@PostConstruct`와 같이 스프링 컨테이서 생성이 되기 전인 초기화 시점에는 트랜잭션이 적용되지 않습니다.

```java
@SpringBootTest  
public class InitTxTest {  
	
    @Test  
    void go() {  
	
    }  
	
    @Autowired  
    Hello hello;  
	
    @TestConfiguration  
    static class InitTxTestConfig {  
		
        @Bean  
        Hello hello() {  
            return new Hello();  
        }  
    }  
	
    @Slf4j  
    static class Hello {  
		
        @PostConstruct  
        @Transactional        
        public void initV1() {  
            boolean isActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("Hello init @PostConstruct tx active={}", isActive);  
        } 
		
	    @EventListener(ApplicationReadyEvent.class)
        @Transactional
        public void initV2() {  
            boolean isActive = TransactionSynchronizationManager.isActualTransactionActive();  
            log.info("Hello init ApplicationReadyEvent tx active={}", isActive);  
        }  
    }  
}
```

\[결과]
```text
Hello init @PostConstruct tx active=false

TransactionInterceptor : Getting transaction for [Hello.init2]
..ngtx.apply.InitTxTest$Hello : Hello init ApplicationReadyEvent tx active=true
TransactionInterceptor : Completing transaction for [Hello.init2]
```

로그중 `Hello init @PostConstruct tx active=false`를 보면 아시다시피 @PostConstruct에 @Transactional을 적용했다 하더라도 `isActualTransactionActive()`의 결과가 `false`가 나오면서 트랜잭션이 적용되지 않는다는 것을 알 수 있습니다.

>[!question] 그럼 사전에 트랜잭션 작업을 하는 방법은 없는걸까?
>`initV2()`의 실행 결과를 보면  `isActualTransactionActive()`의 결과가 `true`가 나온것을 확인하실 수 있습니다.
>
>`@PostConstruct`대신 `@EventListener(value = ApplicationReadyEvent.class)`처럼 사전에 실행되긴 하지만 스프링 컨테이너는 다 생성된 후 실행되도록 설정하면 트랜잭션이 잘 적용됩니다. 

## 2. 내부 호출시 트랜잭션 적용 불가능

만일 AOP를 적용한 클래스 내의 메서드에서, 같은 클래스 내의 @Transactional을 적용한 다른 메서드를 호출한다고 할 때, 아무리 @Transactional을 넣었다고 해도 같은 클래스 내부에서 호출했기 때문에 트랜잭션 적용이 되지 않습니다.

아래는 해당 상황의 예시입니다.
```java
@Slf4j  
@SpringBootTest  
public class InternalCallTest {  
	
    @Autowired  
    CallService callService;  
	
    @Test  
    void internalCall() {  
        callService.internal();  
    }  
	
    @Test  
    void externalCall() {  
        callService.external();  
    }  
  
    @TestConfiguration  
    static class InternalCallTestConfig {  
		
        @Bean  
        CallService callService() {  
            return new CallService();  
        }  
    }  
  
    @Slf4j  
    @RequiredArgsConstructor    
    static class CallService {  
		
        public void external() {  
            log.info("call external");  
            printTxInfo();  
            internal();  
        }  
		
        @Transactional  
        public void internal() {  
            log.info("call internal");  
            printTxInfo();  
        }  
		
        private void printTxInfo() {  
            boolean txActive = TransactionSynchronizationManager.isActualTransactionActive();  
            log.info("tx active: {}", txActive);
        }  
    }  
}
```

`CallService`는 내부에 @Transactional이 붙은 `internal()`메서드가 있기 때문에 AOP가 적용되어 프록시가 생성됩니다.
그렇기 때문에 `internal()`을 외부에서 바로 호출하면 트랜잭션이 잘 적용되어 있는 것을 확인할 수 있습니다.

\[결과 - internalCall]
```text
TransactionInterceptor : Getting transaction for

[..CallService.internal]
..rnalCallV1Test$CallService : call internal
..rnalCallV1Test$CallService : tx active=true
TransactionInterceptor : Completing transaction for
[..CallService.internal]
```

\[internal 호출 과정]
![[Pasted image 20250315181015.png]]

같은 클래스 내에서 `internal()` 메서드를 호출한 `external()`을 호출하면 external은 @Transactional이 붙어있지 않기 때문에 트랜잭션 적용이 안되는게 당연하지만, 내부에서 호출된 internal은 트랜잭션이 적용이 될 것 처럼 보입니다. 하지만 결과를 보면 예상과 다릅니다.

\[결과 - externalCall]
```text
CallService : call external
CallService : tx active=false
CallService : call internal
CallService : tx active=false
```

바로 `internal()`을 호출했을 때는 AOP 프록시 내의 internal을 호출했기 때문에 트랜잭션이 적용되었습니다.

그러나 `external()` 내에서 호출한 `internal()`은 AOP 프록시 내의 internal이 아닌 실제 클래스의 `this.internal()`을 호출했기 때문에 프록시 내의 internal이 아니어서 트랜잭션 적용이 되지 않습니다.

\[external 내의 internal 호출 과정]
![[Pasted image 20250315181346.png]]

> [!question] 그럼 내부에 호출해야하는 상황이면 어떻게 하나요?
> 같은 클래스 내에서 호출 시 프록시의 메서드를 불러올 수 없는 상황이기 때문에 두 메서드가 같은 클래스가 아니게 되면 됩니다.
>
>즉, internal()과 external()을 다른 클래스에 들어가도록 나누면 internal()을 포함한 클래스가 AOP 프록시를 생성한 후에 external() 내부에서 internal()을 호출할 수 있게 됩니다. 결과적으로 internal()이 트랜잭션 적용이 된 채 호출됩니다.

## 3. 체크 예외는 커밋, 언체크 예외는 롤백

예외가 발생했을 때 @Transactional이 적용된 AOP 밖으로 예외를 던지면 예외가 체크 예외냐, 언체크(런타임)예외냐에 따라 다르게 동작합니다.

![[Pasted image 20250316005847.png]]

1. 예외가 발생하지 않은 정상 응답이라면 커밋합니다.
2. 예외가 **체크 예외**라면 해당 트랜잭션을 커밋합니다.
3. 예외가 **언체크 예외**라면 해당 트랜잭션을 롤백합니다.

체크 예외가 발생한 상황에 커밋이 아닌 롤백을 해야 하는 상황이라면 [[@Transactional#2. rollbackFor / noRollbackFor|rollbackFor()]]를 지정해주면 됩니다. 반대 상황도 동일합니다.