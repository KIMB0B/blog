---
title: Filter란?
date: 2024-09-14T03:28:00
---
# Filter의 정의

> [[Servlet]]이 지원하는 기능으로, 공통적인 관심사를 가지고 있는 기능들이 실행되기 전 공통적으로 수행할 작업을 진행할 수 있음.

---
# Filter의 인터페이스 형태

```java
 public interface Filter {
     public default void init(FilterConfig filterConfig) throws ServletException {}
     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;
     
     public default void destroy() {}
}
```
- `init():` 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출됩니다.  
- `doFilter():` 고객의 요청이 올 때 마다 해당 메서드가 호출됩니다. 필터의 로직을 구현하면 됩니다.
- `destroy():` 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출됩니다.

---
# 구현 예시

## Filter 구현

```java
@Slf4j  
public class LogFilter implements Filter {  

    @Override  
    public void init(FilterConfig filterConfig) throws ServletException {  
        log.info("log filter init");  
    }  
  
    @Override  
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {  
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;  
        String requestUri = httpRequest.getRequestURI();  
        String uuid = UUID.randomUUID().toString();  
  
        try {  
            log.info("REQUEST [{}][{}][{}]", uuid, requestUri, httpRequest.getRemoteAddr());  
            filterChain.doFilter(servletRequest, servletResponse);  
        } catch (Exception e) {  
            throw e;  
        } finally {  
            log.info("RESPONSE [{}][{}]", uuid, requestUri);  
        }  
    }  
  
    @Override  
    public void destroy() {  
        log.info("log filter destroy");  
    }  
}
```

> [!note] filterChain.doFilter()
> 정상적으로 Filter 처리가 완료되면 마지막에 filterChain.doFilter함수를 호출합니다.<br>이는 해당 Filter가 끝나면 다른 Filter가 있다면 그 필터를 호출하고, 없으면 서블릿을 호출하도록 할 수 있기 때문에 꼭 넣어 줘야 합니다.

## Bean에 등록

```java
@Configuration  
public class WebConfig {  
  
    @Bean  
    public FilterRegistrationBean logFilter() {  
        FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();  
        filterRegistrationBean.setFilter(new LogFilter());  
        filterRegistrationBean.setOrder(1);  
        filterRegistrationBean.addUrlPatterns("/*");  
        return filterRegistrationBean;  
    }
}
```