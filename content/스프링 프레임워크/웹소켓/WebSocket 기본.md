---
title: Spring으로 WebSocket 서버 구현
date: 2025-03-30T13:24:00
---
기본적인 [[WebSocket]] 기능을 사용하여 채팅을 주고 받을 수 있도록 구현해보겠습니다.

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

## 1. WebSocketHandler 구현

Spring에서는 WebSocket을 처리하기 위해 WebSocketHandler 인터페이스를 제공하며, 이를 구현하는 방식에 따라 **TextWebSocketHandler**와 **BinaryWebSocketHandler**로 나뉩니다.

