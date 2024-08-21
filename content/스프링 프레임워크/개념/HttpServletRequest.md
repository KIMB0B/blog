---
title: HttpServletRequest란?
date: 2024-08-21T13:58:00
---

# HttpServletRequest의 정의
> [[Servlet]]은 개발자가 HTTP 요청 메시지를 편리하게 사용할 수 있도록 개발자 대신에 HTTP 요청 메시지를 파싱하고, 그 결과를 `HttpServletRequest` 객체에 담아서 제공합니다.

# HTTP 요청 메시지 조회

`http://localhost:8080/hello?username=hello`에 접속한 상황
## 1. Start-Line 정보
```java
System.out.println("request.getMethod() = " + request.getMethod());
System.out.println("request.getProtocol() = " + request.getProtocol());
System.out.println("request.getScheme() = " + request.getScheme());
System.out.println("request.getRequestURL() = " + request.getRequestURL());
System.out.println("request.getRequestURI() = " + request.getRequestURI());    
System.out.println("request.getQueryString() = " + request.getQueryString());  
System.out.println("request.isSecure() = " + request.isSecure()); 
```
결과
```console
request.getMethod() = GET
request.getProtocol() = HTTP/1.1
request.getScheme() = http
request.getRequestURL() = http://localhost:8080/request-header
request.getRequestURI() = /request-header
request.getQueryString() = username=hello
request.isSecure() = false
```

## 2. 헤더 정보
```java
request.getHeaderNames().asIterator().forEachRemaining(headerName -> 
	System.out.println(headerName + ": " + request.getHeader(headerName))
);
```
결과
```console
host: localhost:8080
connection: keep-alive
cache-control: max-age=0
sec-ch-ua: "Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/ webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
```

## 3. Accept Language 편의 조회
```java
request.getLocales().asIterator().forEachRemaining(locale -> 
	System.out.println("locale = " + locale)
);
// 제일 우선순위 높은 한 언어만 가져옴
System.out.println("request.getLocale() = " + request.getLocale());
```
결과
```console
locale = ko  
locale = en_US  
locale = en
locale = ko_KR

request.getLocale() = ko
```

## 4. Cookie 편의 조회
testCookie란 이름으로 hello값을 가진 쿠키 값을 넣었을 때
```java
if (request.getCookies() != null) {
    for (Cookie cookie : request.getCookies()) {
        System.out.println(cookie.getName() + ": " + cookie.getValue());
	}
}
```
결과
```console
testCookie: hello
```

## 5. Remote 정보
```java
System.out.println("request.getRemoteHost() = " + request.getRemoteHost());
System.out.println("request.getRemoteAddr() = " + request.getRemoteAddr());
System.out.println("request.getRemotePort() = " + request.getRemotePort());
```
결과
```console
request.getRemoteHost() = 0:0:0:0:0:0:0:1 
request.getRemoteAddr() = 0:0:0:0:0:0:0:1 
request.getRemotePort() = 54305
```

## 6. Local 정보
```java
System.out.println("request.getLocalName() = " + request.getLocalName()); System.out.println("request.getLocalAddr() = " + request.getLocalAddr());
System.out.println("request.getLocalPort() = " + request.getLocalPort());
```
결과
```console
request.getLocalName() = localhost
request.getLocalAddr() = 0:0:0:0:0:0:0:1
request.getLocalPort() = 8080
```

# 전달값 조회
## 1. 쿼리 파라미터
```java
//단일 파라미터 조회
String username = request.getParameter("username"); 
//파라미터 이름들 모두 조회
Enumeration<String> parameterNames = request.getParameterNames(); 
//파라미터를 Map으로 조회
Map<String, String[]> parameterMap = request.getParameterMap(); 
//동일한 이름의 복수 파라미터 조회
String[] usernames = request.getParameterValues("username"); 
```
## 2. 단순 텍스트
```java
ServletInputStream inputStream = request.getInputStream();
String messageBody = 
	StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
```
## 3. JSON
들어오는 데이터가 `{"username": "hello", "age": 20}` 형태인 경우
```java
// 우선 해당 JSON 형태에 맞게 데이터 클래스를 생성

@Getter @Setter
 public class JsonData {
     private String username;
     private int age;
}
```

```java
// 단순 텍스트를 불러올 때와 마찬가지로 우선 body값을 불러옴
ServletInputStream inputStream = request.getInputStream();
String messageBody = 
	StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
	
// objectMapper를 사용하여 읽어온 body값을 미리 생성한 데이터 클래스에 맞게 매핑해줌
JsonData jsonData = objectMapper.readValue(messageBody, JsonData.class);
```

# 임시 저장소 기능
해당 HTTP 요청이 시작할 때 부터 끝날 때 까지 유지되는 임시 저장소 기능을 제공
- 저장: `request.setAttribute(name, value)`
- 조회: `request.getAttgribute(name)`

# 세션 관리 기능
request.getSession(create: true)