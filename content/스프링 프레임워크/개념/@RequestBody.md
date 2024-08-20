---
title: "@RequestBody란?"
date: 2024-08-20T23:35:00
---

# @RequestBody의 정의

> HTTP 요청의 Body를 자바 객체로 변환하여 그 메소드의 파라미터로 전달하도록 합니다.<br>즉, 클라이언트로부터 받은 요청 본문을 자동으로 원하는 타입의 객체로 매핑해주는 역할

# JSON과 같은 형태의 객체 생성
```java
@Data
 public class HelloData {
     private String username;
     private int age;
 }
```

# 기본 사용법
```java
@ResponseBody
@PostMapping("/request-body-json")
public HelloData requestBodyJson(@RequestBody HelloData data) {
    log.info("username={}, age={}", data.getUsername(), data.getAge());
    return data;
}
```
>[!note] 설명
>@RequestBody 어노테이션이 붙은 HelloData 형태의 data 변수를 바로 지정할 수 있습니다.
>추가적으로 이렇게 생성한 data를 그대로 클라이언트에게 return하기 위해 [[@ResponseBody]]를 사용합니다.
