# 정의

> 직접 xml이나 java코드로 설정파일을 작성할 필요 없이 @Component 어노테이션이 붙은 클래스들을 스프링 빈으로 등록해줌.
> [[@Autowired]]를 이용하여 설정했던 의존관계도 그대로 적용된 채로 빈에 등록됨.

# 사용 예시
```java
@Configuration
@ComponentScan
public class AutoAppConfig {
}
```

# 추가 옵션
## 탐색 패키지 위치 지정
```java
@ComponentScan(basePackages = "hello.core")
```
>[!note] 코드 설명
>@ComponentScan은 기본 옵션으로 @ComponentScan 어노테이션을 붙힌 클래스가 있는 위치부터 그 하위로 @Component 어노테이션이 붙은 클래스를 스캔한다.
>이 옵션을 통해 탐색을 시작할 경로를 변경할 수 있다.
## 필터링 기능
### 1. FilterType 옵션
- ANNOTATION: 기본값, 애노테이션을 인식해서 동작한다. 
	ex) `org.example.SomeAnnotation`
- ASSIGNABLE_TYPE: 지정한 타입과 자식 타입을 인식해서 동작한다. 
	ex) `org.example.SomeClass`
- ASPECTJ: AspectJ 패턴 사용  
	ex) `org.example..*Service+`
- REGEX: 정규 표현식  
	ex) `org\.example\.Default.*`
- CUSTOM: `TypeFilter` 이라는 인터페이스를 구현해서 처리 
	ex) `org.example.MyTypeFilter`
### 2. 스캔 대상에서 추가
```java
@ComponentScan(
	includeFilters = {
		@Filter(
			type = FilterType.ASSIGNABLE_TYPE, classes = RateDiscoutPolicy.class
		)
	}	
)
```
### 3. 스캔 대상에서 제외
```java
@ComponentScan(
	excludeFilters = {
		@Filter(
			type = FilterType.ASSIGNABLE_TYPE, classes = FixedDiscoutPolicy.class
		)
	}
)
```

