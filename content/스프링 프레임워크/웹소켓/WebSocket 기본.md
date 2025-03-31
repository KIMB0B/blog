---
title: Spring으로 WebSocket 서버 구현
date: 2025-03-30T13:24:00
---
기본적인 [[WebSocket]] 기능을 사용하여 양방향 통신이 가능하도록 구현합니다.

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

## 1. [[WebSocketHandler|WebSocketHandler 구현]]

[[WebSocketHandler]] 페이지 참고

## 2. [[WebSocketConfigurer|WebSocketConfigurer 구현]]

[[WebSocketConfigurer]] 페이지 참고

---

# 클라이언트에서 WebSocket 서버 사용

## 1. WebSocket 연결

```javascript
const socket = new WebSocket(`ws://localhost:8083/ws`);
```

## 2. WebSocket에 데이터 보내기

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
	
	// send()메서드로 데이터 전달
	socket.send(JSON.stringify(chatMessage));
});
```

## 3. WebSocket에서 이벤트 수신

```javascript
socket.addEventListener('message', (event) => {
	const data = JSON.parse(event.data);
	displayMessage(data);
});
```