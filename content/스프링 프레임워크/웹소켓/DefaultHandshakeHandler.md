---
title: DefaultHandshakeHandler란?
date: 2025-03-31T22:29:00
---
# DefaultHandshakeHandler 정의

> WebSocket 연결 시 Principal을 설정하여 **사용자를 구분**할 수 있는 핸들러입니다.<br> WebSocket 세션과 사용자를 매핑하는 데 유용하며, SimpMessagingTemplate을 사용하여 특정 사용자에게 메시지를 보낼 때 활용됩니다.

---
# 주요 메서드

| **메서드**                                                                                                                                         | **설명**                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| determineUser(<br>ServerHttpRequest request, <br>WebSocketHandler wsHandler, <br>Map<String, Object> attributes)                                | WebSocket 연결을 요청한 사용자의 **Principal(사용자 식별 정보)** 을 설정함. |
| doHandshake(<br>ServerHttpRequest request, <br>ServerHttpResponse response, <br>WebSocketHandler wsHandler, <br>Map<String, Object> attributes) | WebSocket 핸드셰이크 요청을 처리하고, 허용된 경우 연결을 설정함.              |
| getSupportedProtocols()                                                                                                                         | 이 핸들러가 지원하는 WebSocket 하위 프로토콜 목록을 반환함.                 |
| getSelectedProtocol(List<String> requestedProtocols)                                                                                            | 클라이언트가 요청한 WebSocket 프로토콜 중, 서버가 지원하는 프로토콜을 선택함.       |

---
# 구현 예시

DefaultHandshakeHandler에서 가장 중요한 메서드는 `determineUser()`입니다.
이 메서드를 재정의하면 WebSocket을 연결하는 사용자의 Principal을 커스텀할 수 있습니다.

아래는 간단히 사용자별로 UUID를 Id로 갖도록 설정했습니다.

```java
@Component
public class MyHandshakeHandler extends DefaultHandshakeHandler {
	
	@Override
	protected Principal determineUser(
			ServerHttpRequest request, 
			WebSocketHandler wsHandler, 
			Map<String, Object> attributes
	) {
		// UUID 기반 사용자 식별자 생성
		String userId = UUID.randomUUID().toString();
		return () -> userId; // Principal 구현체로 반환
	}
}
```

---
# [[WebSocketMessageBrokerConfigurer]]에 적용

```java
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	
	private final MyHandshakeHandler myHandshakeHandler;
	
	@Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // 특정 사용자가 메시지를 받을 수 있는 브로커 경로 추가 (예: /queue)
        registry.enableSimpleBroker("/topic", "/queue"); 
        registry.setApplicationDestinationPrefixes("/app");
        // 사용자별 메시지 전송을 위한 경로(prefix)
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                // 작성한 DefaultHandshakeHandler 클래스를 추가
                .setHandshakeHandler(myHandshakeHandler)
                .withSockJS();
    }
}
```