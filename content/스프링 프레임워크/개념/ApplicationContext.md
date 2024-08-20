# 정의

> [[Bean|Spring Bean]]을 관리하고 조회하는 Spring Container의 최상위 인터페이스인 BeanFactory라는 인터페이스의 기능을 모두 상속받아서 제공하는 역할을 함
> 거기다가 추가적으로 편리한 부가기능을 더 제공함

# 구조
![[ApplicationContext 구조.png]]

# 기능
- **Bean 조회/관리 기능**
	getBean()등의 빈 조회나 관리를 하는 메서드를 사용 가능
- **메시지소스를 활용한 국제화 기능**  
	예를 들어서 한국에서 들어오면 한국어로, 영어권에서 들어오면 영어로 출력
- **환경변수**  
	로컬, 개발, 운영등을 구분해서 처리
- **애플리케이션 이벤트**  
	이벤트를 발행하고 구독하는 모델을 편리하게 지원
- **편리한 리소스 조회**  
	파일, 클래스패스, 외부 등에서 리소스를 편리하게 조회

# 사용 예시
## 1. XML 파일을 통해 생성된 빈 조회
```java
ApplicationContext ac = new GenericXmlApplicationContext("appConfig.xml");

ac.getBean(RateDiscountPolicy.class);
```
## 2. [[@Configuration]]을 통해 생성된 빈 조회
```java
AnnotationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

ac.getBean(RateDiscountPolicy.class);
```