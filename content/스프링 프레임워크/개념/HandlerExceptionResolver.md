---
title: HandlerExceptionResolver란?
date: 2024-09-18T11:45:00
---
> 기본적으로 서버에서 오류가 발생하면 `500`상태코드의 에러가 발생하게 됩니다.<br>그러나 사용자와 관련된 에러는 `400` 상태코드를 반환하는 등 여러 상황에 따라 알맞은 400번대의 상태코드로 반환해야하는 상황이 있습니다.<br>이 때 HandlerExceptionResolver를 사용하면 이 상황을 해결할 수 있습니다.

# HandlerExceptionResolver를 적용하지 않은 경우

```java
@GetMapping("/api/members/{id}")
public MemberDto getMember(@PathVariable("id") String id) {

	if (id.equals("ex")) {  
		throw new RuntimeException("잘못된 사용자");
	}     
	
	if (id.equals("bad")) {
		throw new IllegalArgumentException("잘못된 입력 값");
	}
	
	return new MemberDto(id, "hello " + id);
}

```

이와 같이 API가 구성되어 있고, `http://localhost:8080/api/members/bad`를 요청하게 되면 IllegalArgumentException이 발생하게 됩니다.<br>그러고 반환된 결과를 확인하면 아래와 같이 어떤 Exception이던간에 500 상태 코드를 가지게 됩니다.

```json
{
     "status": 500,
     "error": "Internal Server Error",
     "exception": "java.lang.IllegalArgumentException",
     "path": "/api/members/bad"
}
```

---
# HandlerExceptionResolver의 역할

HandlerExceptionResolver는 내가 미리 resolver에서 지정한 Exception이 발생하면, WAS까지 Exception이 전달되어서 오류가 발생하는 것이 아니고, HandlerExceptionResolver가 중간에 가로채서 내가 지정한 행동들을 하도록 할 수 있습니다.

이를 이용해서 특정 에러가 났을 때의 상태 코드를 직접 지정할 수도 있고, 에러가 났을 때의 에러 메시지 형태도 지정할 수 있습니다.

<img width="911" alt="image" src="https://gist.github.com/user-attachments/assets/83214626-c8fb-45b0-8920-a4575cfd0dae">
<img width="911" alt="image" src="https://gist.github.com/user-attachments/assets/751f317f-f694-49b7-8084-26e115e55f91">

---
# HandlerExceptionResolver 구현체 만들기

```java
@Slf4j
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {  
    @Override  
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {  
		
        try {  
            if (ex instanceof IllegalArgumentException) {   
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());  
                return new ModelAndView();  
            }  
        } catch (IOException e) {  
            log.error("resolver ex", e);  
        }  
  
        return null;  
    }  
}
```

HandlerExceptionResolver 인터페이스를 구현하여 resolveException() 함수를 Override할 수 있게 됩니다. 해당 부분에서 IllegalArgumentException 예외가 발생하면 response.sendError()를 통해 HttpServletResponse.SC_BAD_REQUEST 상태 코드 즉 400번의 상태 코드로 응답하도록 설정하였습니다.

> [!note] return 을 빈 ModelAndView()로 넘겨준 이유
> resolveException()은 ModelAndView 타입의 return값을 받습니다. <br><br>이를 통해 특정 에러가 발생했을 시 원하는 view로 보낼 수도 있지만, API 환경에서 우리가 원하는 상태 코드와 응답 형태를 지정하고 넘기기 위해선 ModelAndView가 필요하지 않습니다.<br>그러므로 new ModelAndView()를 return하면 에러 처리는 하고 딱히 view와 관련된 처리는 하지 않는다는 뜻입니다.<br><br>추가적으로 return null은 resolver가 아무 영향을 주지 않고 발생할 에러가 원래 처리되려 했던 방식 즉, 500 상태코드로 처리되어 응답이 진행됩니다.

---
# HandlerExceptionResolver 등록 방법

[[Interceptor#Bean에 등록|Filter나 Interceptor를 Bean에 등록할 때 사용했던 WebMvcConfigurer]]에 HandlerExceptionResolver도 등록할 수 있습니다.<br>extendHandlerExceptionResolvers()함수를 Override하여 우리가 만든 resolver 클래스를 추가하면 됩니다.

```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {  
	
    // @Bean  
    public FilterRegistrationBean logFilter() {  
        ... 
    }  
	
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        ...
    }  
	
	/* 이 함수를 Override하여 resolver를 추가할 수 있습니다. */
    @Override  
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {  
        resolvers.add(new MyHandlerExceptionResolver());  
    }  
}
```

