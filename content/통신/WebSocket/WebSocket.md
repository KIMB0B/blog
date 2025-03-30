---
title: WebSocket이란?
date: 2025-03-30T12:49:00
---
# WebSocket의 정의

> WebSocket은 서버와 클라이언트 간의 `양방향 통신`을 가능하게 해주는 프로토콜입니다.
> 한 번 연결이 맺어지면 지속적으로 데이터를 주고받을 수 있는 특징이 있습니다.

| **비교 항목** | **WebSocket**        | **Rest API**           |
| --------- | -------------------- | ---------------------- |
| 연결 방식     | 한 번 연결 후 유지          | 요청할 때마다 새로운 연결 생성      |
| 데이터 전송    | 양방향 (Full-duplex)    | 단방향 (Request-Response) |
| 헤더 오버헤드   | 최초 핸드셰이크 시만 존재       | 매 요청마다 헤더 포함           |
| 사용 사례     | 실시간 채팅, 스트리밍, 알림 시스템 | 정적인 데이터 요청, API 호출     |

---
# WebSocket의 연결 흐름

![[Pasted image 20250330130209.png]]

---
# Handshake 과정

## 1단계: 클라이언트 -> 서버

클라이언트는 HTTP 프로토콜을 사용해 WebSocket 연결을 요청합니다.
이때 `Upgrade` 헤더를 포함하여 WebSocket 프로토콜을 사용할 것임을 알립니다.

```
GET /ws HTTP/1.1
Host: localhost:8083
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

- `Upgrade: websocket` : WebSocket으로 프로토콜 변경 요청
- `Connection: Upgrade` : 프로토콜 업그레이드를 승인하도록 지정
- `Sec-WebSocket-Key` : 클라이언트에서 생성한 키 (보안 목적)
- `Sec-WebSocket-Version` : WebSocket 버전 정보

## 2단계: 서버 -> 클라이언트

서버는 WebSocket 연결 요청을 확인한 후, **101 Switching Protocols** 응답을 반환합니다.

![[Pasted image 20250330131325.png]]

---
# WebSockt 대체 기술과의 비교

## 1. Long Polling

![[Pasted image 20250330131829.png]]

| **비교 항목**   | **WebSocket**     | **Long Polling**      |
| ----------- | ----------------- | --------------------- |
| **통신 방향**   | 양방향 (Full-duplex) | 단방향 (Client → Server) |
| **연결 유지**   | 지속적 연결            | 매 요청마다 새 연결           |
| **서버 부하**   | 낮음                | 높음 (요청이 많아질수록 부담 증가)  |
| **응답 속도**   | 실시간               | 지연 발생 가능              |
| **브라우저 지원** | 완벽 지원             | 완벽 지원                 |

✅ **Long Polling이 더 적합한 경우**
- WebSocket을 사용할 수 없는 환경 (예: 제한적인 네트워크, 방화벽 문제)
- 서버 부하가 상대적으로 적은 경우
- 간단한 실시간 데이터 업데이트 (예: 채팅 메시지 조회)

❌ **Long Polling의 한계**
- 클라이언트가 지속적으로 요청을 보내므로 서버 부하 증가
- 요청-응답 방식이므로 WebSocket만큼 빠른 실시간성이 부족

## 2. Server-Sent Events (SSE)

![[Pasted image 20250330131622.png]]

| **비교 항목**   | **WebSocket**     | **Server-Sent Events (SSE)** |
| ----------- | ----------------- | ---------------------------- |
| **통신 방향**   | 양방향 (Full-duplex) | 단방향 (서버 → 클라이언트)             |
| **프로토콜**    | WebSocket         | HTTP (EventSource API)       |
| **연결 유지**   | 지속적 연결            | 지속적 연결                       |
| **데이터 형식**  | 텍스트, 바이너리         | 텍스트(일반적으로 JSON)              |
| **재연결 지원**  | 직접 구현 필요          | 자동 재연결 지원                    |
| **브라우저 지원** | 대부분 지원            | 일부 브라우저에서 제한                 |

✅ **SSE가 더 적합한 경우**
- 서버에서 클라이언트로만 데이터를 푸시하는 경우 (예: 실시간 뉴스, 알림 시스템)
- HTTP 기반이므로 방화벽을 우회해야 하는 경우

❌ **SSE의 한계**
- 클라이언트에서 서버로 메시지를 보낼 수 없음
- 브라우저의 동시 연결 수 제한이 존재 (일반적으로 6개)