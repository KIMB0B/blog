---
title: WebSocketConfigurer란?
date: 2025-03-31T09:34:00
tags:
  - 스프링/웹소켓
---

# WebSocketConfigurer 정의

> WebSocketConfigurer는 **Spring에서 WebSocket 핸들러를 등록하는 인터페이스**<br>이를 구현하면 WebSocket 엔드포인트를 설정하고, 특정 핸들러와 매핑할 수 있습니다.
> 
> **단순 WebSocket**이 필요한 상태일 때 사용하는 설정 클래스이며, 메시지 브로커 기반으로 설정을 위해서는 [[WebSocketMessageBrokerConfigurer]]로 설정을 해 줘야 합니다.

---
# 주요 메서드

| **메서드**                                                      | **설명**                  | **주요 역할**                    |
| ------------------------------------------------------------ | ----------------------- | ---------------------------- |
| registerWebSocketHandlers(WebSocketHandlerRegistry registry) | WebSocket 핸들러를 등록하는 메서드 | WebSocket 엔드포인트 설정 및 CORS 허용 |

---
# WebSocketHandlerRegistry의 하위 메서드

| **메서드**                                               | **설명**                                    | **주요 역할**                                 |
| ----------------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| setAllowedOrigins(String... origins)                  | WebSocket CORS 정책을 설정                     | 특정 도메인에서만 WebSocket 연결 허용                 |
| withSockJS()                                          | SockJS 지원을 추가하여 WebSocket 미지원 환경에서도 작동 가능 | Long Polling, HTTP Streaming을 통한 대체 연결 지원 |
| addInterceptors(HandshakeInterceptor... interceptors) | WebSocket 연결 전에 인터셉터를 적용                  | JWT 인증, 사용자 검증 등의 보안 처리 가능                |

---
# 필요 어노테이션

WebSocket 기능을 Spring에서 활성화하기 위해 WebSocketConfigurer에 `@EnableWebSocket`를 추가해야 합니다.

| **어노테이션**                     | **용도**                     | **주요 특징**                              |
| ----------------------------- | -------------------------- | -------------------------------------- |
| @EnableWebSocket              | **Raw WebSocket API** 활성화  | WebSocket 핸들러(WebSocketHandler)를 직접 등록 |

---

# 구현 예시

```java
@RequiredArgsConstructor  
@Configuration  
@EnableWebSocket  
public class WebSocketConfig implements WebSocketConfigurer {  
	
    private final MyWebSocketHandler myWebSocketHandler;  
	
    @Override  
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {  
        registry
	        .addHandler(myWebSocketHandler, "/ws")
            .setAllowedOrigins("*");  
    }  
}
```

`addHandler()`에는 구현해놓은 [[WebSocketHandler]]를 넣어주고, 엔드포인트를 등록해줘야 합니다.