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
