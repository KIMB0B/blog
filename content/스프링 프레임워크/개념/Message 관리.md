# 정의

>Spring 프로젝트에서 여러 곳에 사용되는 다양한 문구를 한 곳에서 관리할 수 있도록 하는 기능
>국가별로 설정할 수도 있어서 국제화 기능을 제공함

# 초기 설정

Spring에선 `ResourceBundleMessageSource`를 [[Bean]]으로 등록해주면 됨
```java
@Bean
public MessageSource messageSource() {
	ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
	
	messageSource.setBasenames("messages", "errors"); //properties 파일명
    messageSource.setDefaultEncoding("utf-8");
    return messageSource;
	
}
```

Spring Boot에서는 자동으로 등록이 되어 있어서 `application.properties`에서 설정해주면 됨
```properties
spring.messages.basename=messages
```

메시지 파일은 `src/main/resources/` 경로에 넣어주면 됨
![[Pasted image 20240423005450.png]]

# Message 파일 생성

messages.properties에 저장하고 싶은 문구들을 <span style="background:#fff88f">코드=문구</span> 형태로 저장한다.
```properties
# messages.properties
hello=안녕
hello.name=안녕 {0}
```
```properties
# messages_en.properties
hello=hi
hello.name=hi {0}
```

# Spring 소스 내에서 사용

<span style="background:#fff88f">MessageSource</span> 클래스를 사용하면 메시지를 소스로 불러오는 것이 가능함
```java
@Autowired
MessageSource ms;

ms.getMessage("hello", null, Locale.ENGLISH) // hi
ms.getMessage("hello", new Object[]{"Spring"}, null) // 안녕 Spring
```
>[!note] 정리
>getMessage에는 일반적으로 총 3개의 인자가 들어옴
>
>첫번째: 코드값
>두번째: 인자값
>세번째: 지역
>
>인자값으로는 한개의 인자만 있다 하더라도 Object 타입의 배열로 전달해야함

# ThymeLeaf에 적용

[[표현식 종류#3. 메시지 표현식 - ` {...}`|ThymeLeaf의 메시지 표현식]]을 통해 정해놓은 문구를 코드를 입력하여 가져올 수 있음
```html
<div th:text="#{hello.name(${user.name})}"></h2>
```
>[!note] 설명
>#{...}으로 메시지의 코드를 입력하여 값을 가져오고 그 안쪽의 뒤에 (...) 부분에 인자값으로 넣을 값을 넣음