---
title: 특정 사용자를 구분하여 데이터를 보내는 WebSocket 구현
date: 2025-03-31T22:28:00
tags:
  - 스프링/웹소켓
---

WebSocket 기반의 STOMP 메시징에서는 **사용자 구분 및 특정 사용자에게 메시지를 전송하는 기능**이 필요할 수 있습니다.

WebSocket에선 사용자가 WebSocket에 연결될 때 Principal 객체를 사용하여 구분할 수 있고, 특정 사용자의 세션 ID를 가져와서 메시지를 개별적으로 보낼 수 있습니다.

# 필요 라이브러리

```java
// build.gradle
...
dependencies {  
    ...
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
}
...
```

---
# 구현

## 1. [[DefaultHandshakeHandler|HandshakeHandler 구현 후 WebSocketMessageBrokerConfigurer에 등록]]

[[DefaultHandshakeHandler]] 페이지 참고

## 2. Controller 구현

SimpMessagingTemplate의 `convertAndSendToUser()`를 사용하면 특정 사용자의 브로커에 메시지를 전달할 수 있습니다.

```java
@Controller
@RequiredArgsConstructor
public class PrivateChatController {

	private final SimpleMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.whisper")
    public void sendPrivateMessage(UUID userId, ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/private", chatMessage);
    }
    
}
```

---
# 클라이언트에서 사용

## 1. WebSocket 연결

```javascript
const socket = new SockJS('http://localhost:8083/ws');
const stompClient = Stomp.over(socket);
```

## 2. 연결 및 구독

위에서 설정한 대로 특정 사용자용 브랜치의 prefix인 `/user`와 귓속말이 전달될 경로인 `/queue/private`를 합쳐 `/user/queue/private`를 구독해야 합니다.

그러면 연결이 시작되고 handshake가 진행될 때 HandShakeHandler에서 지정한 대로 각 사용자별 고유 Principal이 생기고, 이를 통해 생긴 각 사용자별 /user/{userId}/queue/private를 구독하는 과정입니다.

```javascript
stompClient.connect(headers, function(frame) {

	// 공용 메시지 구독
	const subscription = stompClient.subscribe('/topic/public', function(message) {
		displayChatMessage(message)
	});
	
	// 본인 개인에게 보내는 메시지 구독
	const userSubscription = stompClient.subscribe('/user/queue/private', function(message) {
		displayChatMessage(message)
	});

});
```

## 3. 특정 사용자에게 데이터 보내기

```javascript
document.getElementById('whisper-form').addEventListener('submit', (e) => {

	e.preventDefault();

	const userId = document.getElementById('whisper-user-id').value;
	const input = document.getElementById('whisper-input');
	const message = input.value;
	const chatMessage = {
		type: 'WHISPER',
		roomId: roomId,
		sender: username,
		content: message
	};
	
	// 귀속말을 절달하는 경로에서 필요로한 데이터인 메시지를 받을 사용자의 id, 메시지 내용을 인자값으로 넣어 메시지를 전달할 수 있다
	stompClient.send("/app/chat.whisper", {}, JSON.stringify({userId: userId, chatMessage: chatMessage}));
});
```