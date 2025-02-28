---
title: Connection Pool이란?
date: 2025-02-28T19:01:00
---
# 커넥션 풀의 필요성

데이터베이스에 한번 Connection을 만들 때 마다 아래와 같은 복잡한 과정을 거칩니다.

1. 애플리케이션 로직은 DB 드라이버를 통해 커넥션을 조회한다.
2. DB 드라이버는 DB와 `TCP/IP` 커넥션을 연결한다. 물론 이 과정에서 3 way handshake 같은 `TCP/IP` 연결을 위한 네트워크 동작이 발생한다.
3. DB 드라이버는 `TCP/IP` 커넥션이 연결되면 ID, PW와 기타 부가정보를 DB에 전달한다.
4. DB는 ID, PW를 통해 내부 인증을 완료하고, 내부에 DB 세션을 생성한다.
5. DB는 커넥션 생성이 완료되었다는 응답을 보낸다.
6. DB 드라이버는 커넥션 객체를 생성해서 클라이언트에 반환한다.

이러한 Connection을 DB에 요청을 보낼 때 마다 생성한다면 `응답 속도가 느려지고, 사용자에게 좋지 않은 경험을 줄 수 있습니다.`
이러한 문제를 해결하기 위해 Connection Pool이 등장했습니다.

---
# 커넥션 풀의 정의

Connection을 자주 만들지 않도록 Connection Pool이라고 하는 공간을 이용하여 미리 여러개의 Connection들을 만들어 놓아 사용합니다.
즉, Connection Pool은 `여러 생성된 Connection들을 갖고있고, 그 Connection들을 관리하는 공간`입니다.

---
# 커넥션 풀 사용

## 1. 초기화

![[Pasted image 20250228192057.png]]
Connection Pool은 필요한 만큼의 Connection을 DB로부터 미리 확보합니다.

## 2. 사용

![[Pasted image 20250228192228.png]]
Connection Pool을 통해 이미 생성되어 있는 Connection을 객체 참조로 가져다 쓰기만 하면 되기 때문에 매번 Connection을 생성하지 않아도 됩니다.

## 3. 반환

![[Pasted image 20250228192420.png]]
사용한 Connection은 종료하지 않고 다음에 다시 사용할 수 있도록 Connection Pool에 반환합니다.