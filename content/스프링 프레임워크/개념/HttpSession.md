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
