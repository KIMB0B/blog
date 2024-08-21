---
title: Spring의 Bean이란?
date: 2024-08-21T12:31:00
---

# Bean의 정의

> Spring IoC(Inversion of Control) 컨테이너가 관리하는 객체입니다.
> [[의존성 주입(DI)]]을 통해 외부에서 관리 및 주입이 가능합니다.

# 선언 방법

## 1. XML을 통한 선언
```xml
<beans> 
	<bean id="myBean" class="com.example.MyClass"/> 
</beans>
```
## 2. @Component를 통한 선언
### 주요 Annnotation
- `@Component`: 일반적인 컴포넌트.
- `@Repository`: 데이터 저장소의 역할을 수행하는 Bean에 사용.
- `@Service`: 비즈니스 로직을 수행하는 Bean에 사용.
- `@Controller`: 웹 요청과 응답을 처리하는 Bean에 사용.
### 사용 예시
```java
@Component 
public class MyBean { 
	...
}
```
>[!Tip]
>Bean 선언 이후 @Component가 붙은 클래스들을 자동으로 설정파일으로 만들어주기 위해서 [[@ComponentScan]]을 사용하여 설정 클래스를 만들어줘야 합니다.
## [[@Configuration|3. Configuration을 통한 선언]]

# 의존성 주입 방법

> [[@Autowired]]를 통해 의존성 주입이 가능합니다..

# Bean 사용 방법

> [[ApplicationContext]] 형식의 변수를 선언하여 getBean()등의 함수를 통해 등록된 Bean을 불러올 수 있습니다.