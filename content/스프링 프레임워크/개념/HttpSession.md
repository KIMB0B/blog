---
title: HttpSession이란?
date: 2024-08-29T11:30:00
---

# 세션이란?

<img width="713" alt="image" src="https://gist.github.com/user-attachments/assets/c91fdd1b-832a-4da4-8bce-bfaaf91c1f57"><br>로그인을 예시로 들면 사용자의 ID값 자체를 쿠키에 저장해버리면 보안이 취약해집니다.
이를 보완하기 위해 브라우저쪽에서 저장되어있는 쿠키 저장소와는 비슷하지만 다르게 서버쪽에서 저장되는 Key-Value타입의 저장공간을 **세션(Session)** 이라고 부릅니다.

사용자의 ID값은 세션 저장소의 value로 저장이 되고, 이에 대해 랜덤하게 생성된 Session ID값을 쿠키 저장소에서 저장되게 함으로써 쿠키 저장소에는 사용자에 대한 직접적인 정보를 저장하지 않도록 하였습니다.

---
# HttpSession의 정의

[[Servlet]]이 제공하는 기능으로, 간편하게 세션을 구성할 수 있게 됩니다.<br>HttpSession을 사용하면서 생성되는 쿠키의 이름은 `JSESSIONID` 이고, 값은 추정 불가능한 랜덤 값으로 지정됩니다.<br>예시) `Cookie: JSESSIONID=5B78E23B513F50164D6FDD8C97B0AD05`

---

# HttpSession 생성

> HttpSession은 [[HttpServletRequest]]을 통해서 생성할 수 있습니다.<br>내부의 메서드인 `getSession()`을 사용하면 세션 저장소가 생성됩니다.

## 생성 예시

```java
public String login(..., HttpServletRequest request) {
	...
	
	HttpSession session = request.getSession(true);
	
	...
}
```

## getSession()의 내부 옵션

getSession()의 내부에는 boolean타입의 `create` 옵션이 있습니다.<br>기본값은 true이기 때문에 아무 값도 안넣으면 기본적으로 true방식으로 작동합니다.

- `request.getSession(true)` **<-기본값**
	- 세션이 있으면 기존 세션을 반환합니다.
	- 세션이 없으면 새로운 세션을 생성해서 반환합니다. 
- `request.getSession(false)`
	- 세션이 있으면 기존 세션을 반환합니다.  
	- 세션이 없으면 새로운 세션을 생성하지 않습니다. 
	- `null` 을 반환합니다.

---

# HttpSession에 데이터 보관과 불러오기

## 데이터 보관

`setAttribute()`을 사용하면 데이터를 보관하는 것이 가능합니다.<br>첫 번째 인자로 key값을, 두번째 인자로 value값을 넣으면 됩니다.

### 사용 예시
```java
public String login(..., HttpServletRequest request) {
	...
	
	HttpSession session = request.getSession();
	
	Member memberA = new Member();
	session.setAttribute("loginMember", memberA);
	
	...
}
```
loginMember라는 이름으로 memberA의 정보를 session 공간에 저장하게 됩니다.

## 데이터 불러오기

`getAttribute()`를 사용하여 데이터를 불러오는 것이 가능합니다.
인자로 session의 key값을 넣어주면 됩니다.

### 사용 예시
```java
public String home(HttpServletRequest request, ...) {
	...
	
	HttpSession session = request.getSession(false);
	Memeber memberA = (Member)session.getAttribute("loginMember");
	
	...
}
```
loginMember가 key값인 데이터를 session에서 가져와서 Member형으로 형변환하여 가져온 예시입니다.

### Spring에서 더 간단하게 불러오기
[[@SessionAttribute]]를 사용하여 더욱 간단하게 불러올 수 있습니다.
자세한 내용은 [[@SessionAttribute]]에서 확인할 수 있습니다.

---

# TrackingModes

JSession을 처음 할당하게 되면 사이트 URL에 jsessionid를 포함하고 있는 것을 확인하실 수 있습니다.<br>예시) ` http://localhost:8080/;jsessionid=F59911518B921DF62D09F0DF8F83F872`

이 이유는 만약 쿠키를 지원하지 않는 환경일 수도 있기 때문에 HttpSession으로 세션을 만들면 jsession의 id를 url에도 저장하게 됩니다.

만일 url 전달 방식을 사용하지 않고 무조건 cookie를 통해 세션을 유지하고 싶으면 `application.properties`에 해당 옵션을 추가하면 됩니다.
```properties
# application.properties
server.servlet.session.tracking-modes=cookie
```

---

# 세션 정보 확인하기

```java
public String sessionInfo(HttpServletRequest request) {
	
	// 세션에 저장된 데이터를 출력
    HttpSession session = request.getSession(false);
	session.getAttributeNames().asIterator().forEachRemaining(name -> 
	    log.info("session name={}, value={}", name, session.getAttribute(name))
	);
	
    log.info("sessionId={}", session.getId());
    log.info("maxInactiveInterval={}", session.getMaxInactiveInterval());
    log.info("creationTime={}", new Date(session.getCreationTime()));
    log.info("lastAccessedTime={}", new Date(session.getLastAccessedTime()));
    log.info("isNew={}", session.isNew());
}
```

- **`sessionId`** : 세션ID, `JSESSIONID` 의 값입니다. 예) `34B14F008AA3527C9F8ED620EFD7A4E1`
- **`maxInactiveInterval`** : 세션의 유효 시간입니다. 예) 1800초, (30분)  
- **`creationTime`** : 세션을 생성한 일시입니다.
- **`lastAccessedTime`** : 세션과 연결된 사용자가 최근에 서버에 접근한 시간, 클라이언트에서 서버로 `sessionId`(`JSESSIONID`)를 요청한 경우에 갱신됩니다.  
- **`isNew`** : 새로 생성된 세션인지, 아니면 이미 과거에 만들어졌고, 클라이언트에서 서버로 `sessionId` (`JSESSIONID`)를 요청해서 조회된 세션인지 여부를 알려줍니다.

---

# 세션 타임아웃 설정

## 타임아웃을 설정해야 하는 이유

HTTP는 비 연결성(ConnectionLess) 이므로 서버 입장에서는 해당 사용자가 웹 브라우저를 종료한 것인지 아닌지를 인식할 수 없습니다. 따라서 서버에서 세션 데이터를 언제 삭제해야 하는지 판단하기가 어렵습니다.

이럴 때 세션을 무한정 보관하면 아래와 같은 문제가 발생할 수 있습니다.
- 세션과 관련된 쿠키(`JSESSIONID`)를 탈취 당했을 경우 오랜 시간이 지나도 해당 쿠키로 악의적인 요청을 할 수 있게 됩니다.  
- 세션은 기본적으로 메모리에 생성됩니다.메모리의 크기는 무한하지 않기 때문에 세션이 계속 생성되고 사라지지 않으면 메모리가 부족해집니다.

그래서 HttpSession은 개발자가 설정해놓은 타임아웃 시간이 될 때 까지 사용자가 아무런 요청을 보내지 않으면 세션을 삭제하는 방식으로 세션을 종료합니다.

## 스프링 설정파일에서 설정

> 분 단위로 설정해야 합니다. (아래는 60분)
```properties
# application.properties

server.servlet.session.timeout=60
```

## 코드에서 특정 세션 단위로 시간 설정

> 초단위로 설정해야 합니다. (아래는 1800초 = 30분)
```java
session.setMaxInactiveInterval(1800);
```