---
title: "@SessionAttribute란?"
date: 2024-08-29T23:08:00
---
# @SessionAttribute의 정의

> Spring에서 Session의 데이터를 더 간편하게 가져올 수 있도록 하는 기능입니다.
> 이 기능을 사용하면 세션을 따로 생성하진 않고 값을 가져오기만 합니다.

# 사용 예시

```java
public String home(
	@SessionAttribute(name = "loginMember", required = false) Member loginMember,
	HttpServletRequest request,
	...) {
	
	...
	
}
```

해당 함수 내에서 session에서 loginMember라는 Key를 가지고 있는 부분의 값을 `loginMember`로 home() 함수 내에서 사용할 수 있게 됩니다.