---
title: "@RequestParam이란?"
date: 2024-08-20T23:42:00
---

# @RequestParam의 정의

>클라이언트가 보낸 요청 중 파라미터의 값을 불러오고 싶을 때 사용하는 Annotation

# 기본 사용법
`http://localhost:8080/request-param?username=hello&age=20` 경로로 요청했을 때
```java
@ResponseBody
@RequestMapping("/request-param")
public String requestParam(
	    @RequestParam("username") String memberName,
	    @RequestParam("age") int memberAge) {
	log.info("username={}, age={}", memberName, memberAge);
	return "ok";
}
```
> [!note] @RequestParam 설명
> @RequestParam으로 파라미터의 이름을 인자로 넣어 해당 변수를 사용할 수 있습니다.

# 파라미터명 인자값 생략
```java
@ResponseBody
@RequestMapping("/request-param")
public String requestParam(
         @RequestParam String username,
         @RequestParam int age) {
    log.info("username={}, age={}", username, age);
    return "ok";
}
```
>[!note] 생략 설명
>변수명을 파라미터명과 동일하게 지정하면 @RequestParam 뒤의 인자를 생략할 수 있습니다.

# 추가 옵션
```java
@RequestParam(required = true, defaultValue = "guest") String username,
@RequestParam(required = false, defaultValue = "-1") int age
```
>[!note] required 옵션 설명
>required값을 true로 주면 필수 입력해야 하는 파라미터, false면 입력하지 않아도 되는 파라미터 입니다.
>따로 설정해주지 않으면 기본적으로는 true로 설정되어 있습니다.

>[!note] defaultValue 설명
> 해당 파라미터의 값을 지정하지 않으면 기본적으로 지정될 값을 설정할 수 있습니다.

# 파라미터 전체 Map으로 조회
```java
@ResponseBody
@RequestMapping("/request-param-map")
public String requestParamMap(@RequestParam Map<String, Object> paramMap) {
	log.info("username={}, age={}", paramMap.get("username"), paramMap.get("age"));
    return "ok";
}
```