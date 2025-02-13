---
title: ResponseStatusExceptionResolver란?
date: 2024-09-18T12:03:00
---
Spring에선 기본적으로 에러가 발생했을 때 가로채서 내가 원하는대로 처리해줄 수 있도록 하는 ExceptionResolver를 지원합니다.

[[예외 처리#4. 스프링이 제공하는 ExceptionResolver 사용하기|Spring이 기본적으로 지원하는 ExceptionResolver는 3종류가 있으며]], 그 중 ResponseStatusExceptionResolver는 아래 두가지의 경우를 자동으로 처리할 수 있습니다.

# @ResponseStatus가 달려있는 예외 처리

내가 만든 Exception 클래스에 @ResponseStatus 어노테이션을 추가하면 HTTP 상태 코드를 변경해줍니다.

**예시**
```java
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "잘못된 요청 오류") 
public class BadRequestException extends RuntimeException { }
```

이렇게 만든 Exception을 발생시키면(`throw new BadRequestException()`) Spring은 자동으로 `HttpStatus.BAD_REQUEST`의 상태번호 즉 400번 상태번호로 에러를 발생시킵니다.

# ResponseStatusException 예외 처리

내가 직접 만든 Exception이 아닌 라이브러리의 예외 클래스 등 내가 직접 어노테이션을 추가해줄 수 없는 예외 클래스를 사용할 때에는 ResponseStatusException예외를 사용하여 처리할 수 있습니다.

**예시**
```java
public String responseStatusEx() {
     throw new ResponseStatusException(HttpStatus.NOT_FOUND, "잘못된 요청 오류", new IllegalArgumentException());
}
```

이렇게 ResponseStatusException을 throw하는데, 인자값으로 `상태 코드`, `오류 메시지`, `발생시킬 Exception 클래스`를 넣어주면 IllegalArgumentException으로 HttpStatus.NOT_FOUND의 상태 코드인 404 코드로 에러를 발생시킬 수 있습니다.