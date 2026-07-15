---
title: STOMP로 Broker 패턴의 WebSocket 서버 구현
date: 2025-03-31T10:31:00
tags:
  - 스프링/웹소켓
---

기본적인 **WebSocket**은 클라이언트와 서버 간의 양방향 통신을 가능하게 하지만, **메시지를 어떻게 구성하고 처리할지에 대한 표준이 없습니다.**

이를 해결하기 위해 WebSocket 위에서 동작하는 [[STOMP]]을 사용하면, 일정한 **규격을 갖춘 메시지를 주고받을 수 있으며, 메시지 브로커를 활용한 Pub/Sub 구조**를 쉽게 구현할 수 있습니다.
(`Pub/Sub 구조`는 [[MQTT 알아보기 1편 - MQTT, Publish, Subscribe, Topic|MQTT]]에서도 사용하고 있으며, 해당 글에 관련 내용을 자세히 정리해놨습니다)

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

## 1. [[WebSocketMessageBrokerConfigurer|WebSocketMessageBrokerConfigurer 구현]]

[[WebSocketMessageBrokerConfigurer]] 페이지 참고

## 2. Controller 구현

@MessageMapping과 @SendTo를 사용하여 **클라이언트가 보낸 메시지를 특정 경로에서 처리하고, 다른 클라이언트들에게 전달할 수 있도록 브로커로 전송**할 수 있습니다.

### 2-1. @SendTo를 사용하여 전달

```java
@Controller  
@RequiredArgsConstructor
public class ChatController {  
	
    private final MessageService messageService;  
	
    // /app/chat.sendMessage 로 들어오는 메시지를 처리  
    @MessageMapping("/chat.sendMessage")
    // /topic/public을 구독하는 클라이언트에게 전달
    @SendTo("/topic/public")  
    public ChatMessage sendMessage(ChatMessage chatMessage) {  
        return chatMessage;  
    }
}
```

### 2-2. SimpMessagingTemplate를 사용하여 전달

```java
@Controller  
@RequiredArgsConstructor
public class ChatController {  
	
    private final MessageService messageService; 
    // 직접 브로커에 메시지를 전달할 수 있는 기능을 갖고 있음
    private final SimpMessagingTemplate messagingTemplate; 
	
    // /app/chat.sendMessage 로 들어오는 메시지를 처리  
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage chatMessage) {  
	    // /topic/public을 구독하는 클라이언트에게 전달
        messagingTemplate.convertAndSend("/topic/public", chatMessage);  
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

`/topic/public`을 구독하며, 해당 브로커에 메시지가 온다면 처리할 로직을 구현할 수 있습니다.

```javascript
stompClient.connect({}, function(frame) {
	
	const subscription = stompClient.subscribe('/topic/public', function(message) {
		
		const data = JSON.parse(message.body);
		displayMessage(data);
	});
});
```

## 3. WebSocket에 데이터 보내기

```javascript
document.getElementById('chat-form').addEventListener('submit', (e) => {

	e.preventDefault();
	
	const input = document.getElementById('chat-input');
	const message = input.value;
	const chatMessage = {
		type: 'CHAT',
		roomId: roomId,
		sender: username,
		content: message
	};
	// 클라이언트에서 사용하는 경로에 send()를 통해 메시지를 전달할 수 있다
	stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
});
```