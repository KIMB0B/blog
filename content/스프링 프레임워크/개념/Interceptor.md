---
title: Interceptor란?
date: 2024-09-14T03:29:00
---
# Interceptor의 정의

> Interceptor란 Spring MVC가 제공하는 기술입니다.
> [[Filter]]와 역할은 같지만 적용되는 순서와 범위, 사용방법이 다릅니다.

---
# [[Filter]]와의 차이점

```
HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터 -> 컨트롤러
```
스프링이 실행되는 흐름을 보면 필터는 서블릿 전에, 인터셉터는 서블릿 후에 호출됩니다.

그리고 인터셉터의 URL 패턴은 서블릿보다 다르고, 더 정밀하게 설정할 수 있습니다.

---
# Interceptor의 인터페이스 형태

```java
 public interface HandlerInterceptor {
     default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {}
     
     default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {}
     
     default void afterCompletion(HttpServletRequest request, HttpServletResponse response,
```

- `preHandle` : 컨트롤러 호출 전에 호출됩니다. (더 정확히는 핸들러 어댑터 호출 전에 호출됩니다.)
	- `preHandle` 의 응답값이 `true` 이면 다음으로 진행하고, `false` 이면 더는 진행하지 않습니다. `false` 인 경우 나머지 인터셉터는 물론이고, 핸들러 어댑터도 호출되지 않습니다.
- `postHandle` : 컨트롤러 호출 후에 호출됩니다. (더 정확히는 핸들러 어댑터 호출 후에 호출됩니다.)
- `afterCompletion` : 뷰가 렌더링 된 이후에 호출됩니다.

---
# 구현 예시

## Interceptor 구현

```java
@Slf4j  
public class LogInterceptor implements HandlerInterceptor {  
  
    public static final String LOG_ID = "logId";  
  
    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {  
  
        String requestURI = request.getRequestURI();  
        String uuid = UUID.randomUUID().toString();  
        request.setAttribute(LOG_ID, uuid);  
  
        if (handler instanceof HandlerMethod) {  
            HandlerMethod hm = (HandlerMethod) handler;  
        }  
  
        log.info("REQUEST [{}][{}][{}]", uuid, requestURI, handler);  
        return true;  
    }  
  
    @Override  
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {  
        log.info("postHandle [{}]", modelAndView);  
    }  
  
    @Override  
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {  
        String requestURI = request.getRequestURI();  
        String logId = (String) request.getAttribute(LOG_ID);  
        log.info("RESPONSE [{}][{}]", logId, requestURI);  
        if (ex != null) {  
            log.error("afterCompletion error!!", ex);  
        }  
    }  
}
```

## Bean에 등록

```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {
	@Override  
	public void addInterceptors(InterceptorRegistry registry) {  
    registry.addInterceptor(new LogInterceptor())  
            .order(1)  
            .addPathPatterns("/**")  
            .excludePathPatterns("/css/**", "*.ico", "/error");
    }
}
```