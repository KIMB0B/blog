---
title: 의존성 주입이란?
date: 2024-08-20T23:17:00
---

# 정의

> Dependency Injection 즉 의존성주입은 [[의존성 주입(DI)#강한 결합(Tight Coupling)|강한 결합]] 을 [[의존성 주입(DI)#느슨한 결합(Loose Coupling)|느슨한 결합]]으로 전환 시키는 방법<br>제어의 역전(Inversion of Control)의 기술 중 하나

---
# 강한 결합(Tight Coupling)

### 특징

- 하나의 객체를 변경하게 되면 다른 객체들을 변경을 요구되어 변경점들을 확인하고 쉽게 놓칠 수 있음
- 결합이 강하게 되어있어 결합이 되어있지 않으면 사용을 할 수 없게 됨
- new를 선언할 때마다 컴퓨터 메모리를 사용하게 되는데 비교적으로 강한 결합에서 new를 더 많이 사용해 메모리를 많이 잡아먹게 됨

### 형태

![image](https://gist.github.com/user-attachments/assets/1b9f675d-c047-46f7-b6e9-16d7578e03d4)
(TypeScript 환경에서의 예시)

---
# 느슨한 결합(Loose Coupling)

### 특징

- 클래스/클래스를 느슨하게 결합되어 새로운 기능을 개발하거나 기존 기능을 수정하고 확장하는게 쉬움
- 코드의 유지 보수가 쉬움
- 테스트 대역으로 치환하기가 쉬워 유닛 테스트가 용이함

### 형태

![image](https://gist.github.com/user-attachments/assets/7d59949d-7c0b-4410-bfca-9230be74e19b)
(TypeScript 환경에서의 예시)