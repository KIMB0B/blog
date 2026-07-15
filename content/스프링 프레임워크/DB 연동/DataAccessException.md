---
title: 스프링의 데이터 예외 추상화 (DataAccessException)
date: 2025-03-06T13:06:00
tags:
  - 스프링/DB연동
---

# DataAccessException의 정의

> 데이터 접근 중 발생하는 예외를 처리하기 위해 Spring에서 제공하는 런타임 예외
> 체크 예외로 선언될 경우 매번 throws로 전파해야 하는 문제를 방지하고, 일관된 예외 처리를 가능하게 합니다.

## 계층

![[Pasted image 20250306130515.png]]

DataAccessException 하위로 SQL 문법 오류, 타임아웃 오류 등 여러 데이터 접근 상황에서 발생하는 에러들이 구현되어 있습니다.