---
title: STOMP란?
date: 2025-03-31T10:56:00
tags:
  - 스프링/웹소켓
---

# STOMP 정의

> STOMP(Simple Text Oriented Messaging Protocol)는 **텍스트 기반의 메시징 프로토콜**로, WebSocket 위에서 동작하는 **Pub/Sub(발행/구독) 모델**을 지원하는 프로토콜입니다.<br>**[[WebSocket]]이 양방향 통신을 위한 저수준 프로토콜**이라면, STOMP는 **메시지 브로커를 활용한 고수준 프로토콜**로서 메시징을 보다 쉽게 관리할 수 있도록 도와줍니다.

---
# 특징

- **프레임 기반 메시징**
	- CONNECT, SEND, SUBSCRIBE, DISCONNECT 등의 프레임을 사용
- **텍스트 기반 프로토콜**
	- HTTP처럼 텍스트로 메시지를 주고받기 때문에 디버깅이 쉬움
- **Pub/Sub 모델**
	- 클라이언트는 특정 토픽(채널)을 구독하고, 다른 클라이언트가 메시지를 발행하면 자동으로 전달됨
- **메시지 브로커 지원**
	- STOMP는 RabbitMQ, ActiveMQ, Apache Kafka 같은 메시지 브로커와 연동 가능

---
# 메시지 프레임 구조

## 1. CONNECT

STOMP 서버에 연결 요청

\[예시]
```
CONNECT
login:user
passcode:1234

^@
```

## 2. SEND

특정 대상(토픽 또는 큐)에 메시지 전송

\[예시]
```
SEND
destination:/topic/chat

Hello World!^@
```
## 3. SUBSCRIBE

특정 토픽을 구독

\[예시]
```
SUBSCRIBE
destination:/topic/chat
id:sub-1

^@
```
## 4. MESSAGE

서버가 클라이언트에 메시지 전송

\[예시]
```
MESSAGE
destination:/topic/chat

Hello!^@
```
## 5. DISCONNECT

연결 해제

\[예시]
```
DISCONNECT
receipt:77

^@
```
