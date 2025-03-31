---
title: WebSocketHandler란?
date: 2025-03-31T09:32:00
---
# WebSocketHandler 정의

> Spring에서 제공하는 WebSocket을 처리하기 위해 WebSocketHandler 인터페이스<br>이를 구현하는 방식에 따라 `TextWebSocketHandler`와 `BinaryWebSocketHandler` 등으로 나뉩니다.

# WebSocketHandler 종류

|**핸들러 종류**|**사용 목적**|**지원 메시지 유형**|
|---|---|---|
|**WebSocketHandler**|기본 WebSocket 인터페이스|텍스트 + 바이너리|
|**TextWebSocketHandler**|텍스트 메시지 전용 (채팅, JSON)|TextMessage|
|**BinaryWebSocketHandler**|파일, 이미지, 오디오 등 바이너리 전용|BinaryMessage|
|**PerConnectionWebSocketHandler**|세션별 독립적인 핸들러 생성|텍스트 + 바이너리|

# 주요 메서드

| **메서드**                    | **설명**                    |
| -------------------------- | ------------------------- |
| afterConnectionEstablished | 클라이언트가 연결되었을 때 호출         |
| handleMessage              | 클라이언트가 메시지를 보냈을 때 호출      |
| handleTransportError       | WebSocket 통신 중 오류 발생 시 호출 |
| afterConnectionClosed      | 클라이언트가 연결을 종료했을 때 호출      |
| supportsPartialMessages    | 부분 메시지(프레임 분할)를 지원하는지 여부  |

# 구현 예시

간단히 TextWebSocketHandler를 구현한 예시입니다.

```java
@RequiredArgsConstructor
public class MyWebSocketHandler extends TextWebSocketHandler {    
    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();  
    
    @Override  
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {  
        sessions.add(session);  
    }  
	
    @Override  
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {  
        for (WebSocketSession webSocketSession : sessions) {  
            if (webSocketSession.isOpen()) {  
                webSocketSession.sendMessage(message);  
            }  
        }  
    }  
	
    @Override  
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {  
        sessions.remove(session);  
    }  
}
```

> [!note] CopyOnWriteArraySet 으로 Session 을 저장한 이유
> WebSocket 연결은 멀티스레드 환경에서 동작하기 때문에 여러 스레드가 sessions에 접근하는데, 클라이언트가 연결/해제될 때 sessions을 안전하게 수정할 수 있어야 합니다.<br>CopyOnWriteArraySet을 사용하면 synchronized 없이도 스레드가 안전하게 세션을 추가/삭제 가능합니다.