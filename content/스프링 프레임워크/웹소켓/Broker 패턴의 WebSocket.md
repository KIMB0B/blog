---
title: STOMP로 Broker 패턴의 WebSocket 서버 구현
date: 2025-03-31T10:31:00
---
기본적인 **WebSocket**은 클라이언트와 서버 간의 양방향 통신을 가능하게 하지만, **메시지를 어떻게 구성하고 처리할지에 대한 표준이 없습니다.**

이를 해결하기 위해 WebSocket 위에서 동작하는 [[STOMP]]을 사용하면, 일정한 **규격을 갖춘 메시지를 주고받을 수 있으며, 메시지 브로커를 활용한 Pub/Sub 구조**를 쉽게 구현할 수 있습니다.
(`Pub/Sub 구조`는 [[MQTT 알아보기 1편 - MQTT, Publish, Subscribe, Topic|MQTT]]에서도 사용하고 있으며, 해당 글에 관련 내용을 자세히 정리해놨습니다)

