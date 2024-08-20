---
title: "@ModelAttribute란?"
date: 2024-08-20T23:25:00
---

# @ModelAttribute의 정의

>[[@RequestParam]]으로 프로퍼티 값을 하나 하나 받아오기 쉽지 않은 상황이 많습니다.
>이럴 때 파라미터들의 값을 프로퍼티 접근법(setXXX)으로 알아서 입력하여 객체로 값들을 받을 수 있게 해줍니다.

# 데이터가 들어갈 객체 생성
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
@RequestMapping("/model-attribute-v1")
public String modelAttributeV1(@ModelAttribute HelloData helloData) {
    log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());
    return "ok";
}
```