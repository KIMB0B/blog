---
title: "@ExceptionHandler란?"
date: 2024-09-17T00:59:00
---
> [[HandlerExceptionResolver]]는 직접 구현하기 까다롭기도 하고, 굳이 ModelAndView를 반환하는 방식이라 API 응답에는 유용하지 않은 과정이었습니다.<br>또한 같은 종류의 Exception이라 하더라도 다른 Controller에 따라 처리 방법을 다르게 하고 싶어도 [[HandlerExceptionResolver]]에서는 불가능했습니다.<br>이런 애로사항을 @ExceptionHandler를 사용함으로써 해결할 수 있습니다.

# @ExceptionHandler의 작동 흐름

@ExceptionHandler는 [[예외 처리#1) ExceptionHandlerExceptionResolver|ExceptionHandlerExceptionResolver]]를 통해 처리됩니다. ExceptionHandlerExceptionResolver는 아래와 같은 작업을 합니다.

1. 컨트롤러 호출 결과 예외가 발생함.
2. ExceptionHandlerExceptionResolver는 발생한 예외를 처리할 수 있는 @ExceptionHandler가 있는지 확인함.
3. 해당 예외를 처리하는 @ExceptionHandler가 붙은 함수에서 짜여진 대로 응답을 진행함.

---
# @ExceptionHandler 사용

우선 API가 예외 상황일 때 응답할 형태로 사용할 객체 `ErrorResult`를 정의해보았습니다.
```java
@Data
@AllArgsConstructor 
public class ErrorResult {
    private String code;
    private String message;
}
```

^4f3ead

그리고 사용자 관련 예외 상황일 때 사용할 객체로 `UserException`도 RuntimeException을 확장하여 만들어보았습니다. (직접 만든 예외도 처리가 가능하다는 것을 보여주기 위함입니다.)
```java
public class UserException extends RuntimeException {  
  
    public UserException() {  
        super();  
    }  
  
    public UserException(String message) {  
        super(message);  
    }  
  
    public UserException(String message, Throwable cause) {  
        super(message, cause);  
    }  
  
    public UserException(Throwable cause) {  
        super(cause);  
    }  
  
    protected UserException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {  
        super(message, cause, enableSuppression, writableStackTrace);  
    }  
}
```

그리고 예외 처리를 원하는 컨트롤러에 아래와 같이 @ExceptionHandler 어노테이션이 포함된 함수들을 추가하면 됩니다.
```java
@RestController  
public class ApiExceptionController {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalExHandle(IllegalArgumentException e) {
        return new ErrorResult("BAD", e.getMessage());
    }
	
	@ExceptionHandler
    public ResponseEntity<ErrorResult> userExHandle(UserException e) {
        ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
    }
    
    @GetMapping("/api/members/{id}")  
    public ApiExceptionController.MemberDto getMember(@PathVariable("id") String id) {  
		
        if (id.equals("bad")) {  
            throw new IllegalArgumentException("잘못된 입력 값");  
        }  
		
        if (id.equals("user-ex")) {  
            throw new UserException("사용자 오류");  
        }  
        
        return new ApiExceptionController.MemberDto(id, "hello " + id);  
    }  
}
```

^8ac7ae

## 1. IllegalArgumentException 처리

```java
@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler(IllegalArgumentException.class)
public ErrorResult illegalExHandle(IllegalArgumentException e) {
    return new ErrorResult("BAD", e.getMessage());
}
```

해당 부분은 @ExceptionHandler로 인해 IllegalArgumentException이 발생했을 때 실행될 부분으로 설정되었습니다.

@ResponseStatus 어노테이션을 통해 HttpStatus.BAD_REQUEST 상태 코드 즉 400으로 응답하게 되며, 미리 지정한 [[#^4f3ead|ErrorResult]]의 형태대로 JSON 형태로 반환됩니다.(Controller가 @RestController이기 때문입니다.)

## 2. UserException 처리

```java
@ExceptionHandler
public ResponseEntity<ErrorResult> userExHandle(UserException e) {
    ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
    return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
}
```

@ResponseStatus 어노테이션을 안 쓴 예시도 보여주기 위해 추가했습니다.

대신에 ResponseEntity를 사용했는데, 이는 응답 코드를 프로그래밍 코드 내에서 동적으로 변경하여 지정할 수 있는 장점이 있습니다.(@ResponseStatus를 사용해서 응답 코드를 지정하면 어노테이션 옆에 응답 코드를 적어야 하기 때문에 프로그래밍 코드 내에서 변경이 불가능합니다.)

---
# @ControllerAdvice 사용

> @ExceptionHandler를 사용하면 Controller 코드 내에 예외 처리 코드, controller의 코드가 한번에 들어가야 하기 때문에 분리를 하는 것이 유지보수에 좋습니다. 이를 위해 사용하는 것이 @ControllerAdvice입니다.

[[#^8ac7ae|위의 Controller 코드]]에서 @ExceptionHandler 처리하는 메서드만 따로 빼서 아래와 같이 만들면 예외 처리가 Controller에 적용됩니다.

```java
@RestControllerAdvice
public class ExControllerAdvice {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalExHandle(IllegalArgumentException e) {
        return new ErrorResult("BAD", e.getMessage());
    }
	
	@ExceptionHandler
    public ResponseEntity<ErrorResult> userExHandle(UserException e) {
        ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
    }
}
```

## @ControllerAdvice 범위 지정하기

위처럼 @ControllerAdvice에 아무 인자값을 주지 않으면 해당 Advice는 모든 Controller에 글로벌하게 적용됩니다.<br>특정 Controller에게만 적용될 Advice를 만들기 위해선 @ControllerAdvice에 인자값을 추가해야합니다.

### 1. 특정 어노테이션이 있는 Controller들에게 적용하기

```java
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}
```
@RestController 어노테이션이 붙은 Controller들에게만 적용되는 Advice 입니다.

### 2. 특정 패키지에 있는 Controller들에게 적용하기

```java
@ControllerAdvice("org.example.controllers")
public class ExampleAdvice2 {}
```
org.example.controllers 하위에 있는 Controller들에게만 적용되는 Advice 입니다.

### 3. 특정 Controller들에게 적용하기

```java
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```
예시로 ControllerInterface라는 클래스와 이를 구현한 클래스들, 그리고 AbstractController라는 클래스와 이를 상속받은 클래스들 등등 특정 클래스, 그리고 이를 구현하거나 상속한 클래스들에게 적용되는 Advice입니다.