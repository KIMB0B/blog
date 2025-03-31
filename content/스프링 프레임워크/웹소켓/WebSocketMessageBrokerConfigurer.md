---
title: WebSocketMessageBrokerConfigurer란?
date: 2025-03-31T11:25:00
---
# WebSocketMessageBrokerConfigurer 정의

> WebSocketMessageBrokerConfigurer는 **Spring에서 STOMP 기반의 WebSocket 메시지 브로커를 설정할 때 사용하는 인터페이스**입니다.
> 
> **메시지 브로커 기반으로 설정**하는 클래스이며, 단순 WebSocket 설정을 위해서는 [[WebSocketConfigurer]]로 설정을 해 줘야 합니다.

---
# 주요 메서드

| **메서드**                                                                  | **설명**                          |
| ------------------------------------------------------------------------ | ------------------------------- |
| configureMessageBroker(MessageBrokerRegistry registry)                   | 메시지 브로커의 경로와 동작 방식 설정           |
| registerStompEndpoints(StompEndpointRegistry registry)                   | WebSocket 연결을 위한 STOMP 엔드포인트 등록 |
| configureClientInboundChannel(ChannelRegistration registration)          | 클라이언트가 보낸 메시지의 인터셉터 설정          |
| configureClientOutboundChannel(ChannelRegistration registration)         | 서버에서 클라이언트로 보낼 메시지의 인터셉터 설정     |
| configureWebSocketTransport(WebSocketTransportRegistration registration) | WebSocket 전송 관련 옵션 설정           |

---
# 필요 어노테이션

메시지 브로커 기반의 WebSocket 기능을 Spring에서 활성화하기 위해 WebSocketConfigurer에 `@EnableWebSocketMessageBroker`를 추가해야 합니다.

| **어노테이션**                     | **용도**                     | **주요 특징**                              |
| ----------------------------- | -------------------------- | -------------------------------------- |
| @EnableWebSocketMessageBroker | **STOMP 기반 WebSocket 활성화** | 메시지 브로커를 통한 Pub/Sub 방식 지원              |

---
# 구현 예시

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // ✅ 1. 메시지 브로커 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // 구독자가 메시지를 받을 수 있는 경로 지정 (브로커 역할)
        registry.enableSimpleBroker("/topic", "/queue"); 

        // 클라이언트가 메시지를 보낼 때 사용할 prefix 설정
        registry.setApplicationDestinationPrefixes("/app");
    }

    // ✅ 2. STOMP 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws-stomp") // WebSocket 엔드포인트
                .setAllowedOrigins("*")   // CORS 허용
                .withSockJS();            // WebSocket 미지원 브라우저를 위한 SockJS 설정
    }

    // ✅ 3. 클라이언트에서 서버로 들어오는 메시지를 가로채는 인터셉터 추가
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        registration.interceptors(new MyInboundChannelInterceptor());
    }

    // ✅ 4. 서버에서 클라이언트로 나가는 메시지를 가로채는 인터셉터 추가
    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {

        registration.interceptors(new MyOutboundChannelInterceptor());
    }
}
```