---
title: Servlet이란?
date: 2024-08-21T14:11:00
---

# 정의

> 서블릿은 웹 컴포넌트 중 하나로, 웹 서버 또는 애플리케이션 서버에서 클라이언트의 요청을 처리하고 그 결과를 클라이언트에게 다시 전송하는 역할을 합니다.

# 서블릿 생성 예시

HttpServlet 클래스를 extends하여 service()함수를 구현해 사용할 수 있습니다.
`http://localhost:8080/hello`로 접속하면 일어날 일을 아래 service() 함수에서 정의할 수 있습니다.
```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

	@Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         ...
    }
}
```

# [[HttpServletRequest]]
HTTP에 요청이 들어오면서 서버는 요청 메시지를 받아 다양한 정보를 받습니다.
이걸 코드에서 손쉽게 사용할 수 있게 만들어줍니다.

# [[HttpServletResponse]]
요청을 준 사용자에게 줄 응답에 관련된 내용을 지정할 수 있습니다.

# 스프링 부트에서 서블릿 등록 설정

메인 어플리케이션 클래스에서 `@ServletComponentScan` 을 사용해 프로젝트의 서블릿을 자동으로 등록합니다.
```java
@ServletComponentScan
@SpringBootApplication
public class MainApplication {
     public static void main(String[] args) {
         SpringApplication.run(ServletApplication.class, args);
    }
}
```