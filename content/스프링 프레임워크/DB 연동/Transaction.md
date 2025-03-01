---
title: Spring에서의 DB Transaction
date: 2025-03-02T00:36:00
---
# Transaction의 정의

> 데이테베이스에서 상태를 변화시키기 위해 수행하는 작업의 단위

ex) A가 B에게 5000원을 송금하는 경우
	-> A의 잔고에서 5000원을 감소시키고, B의 잔고에서 5000원을 증가시키는 작업이 하나의 Transaction이 됩니다.

 ---
# Transaction이 안지켜져 문제가 되는 경우

A가 B에게 5000원 송금을 하는데, 오타로 인해 아래와 같이 실행되면 문제가 생깁니다.
```sql
update member set money=10000 - 5000 where member_id = 'memberA';
update member set money=10000 + 5000 where member_iddd = 'memberB';
```

A의 출금 처리는 되었지만 B의 입금 처리에 오류가 생기면서 출금만 된 채 송금이 종료되었습니다. 
이로인해 A는 5000원, B는 10000원의 금액을 가지며 5000원이 공중분해되었습니다...

## ✅ 해결 방법

출금과 송금 작업을 하나의 Transaction으로 묶습니다

사전에 `set autocommit = false`로 진행하고 비즈니스 로직 진행 중 오류가 발생하면 `rollback`으로 이전 상태로 되돌리고, 문제가 없으면 `commit`으로 송금 처리를 완료하게 하면 안전한 송금이 가능합니다.

---
