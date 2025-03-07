---
title: SQLExceptionTranslator란?
date: 2025-03-06T13:24:00
---
# SQLExceptionTranslator의 정의

> Spring에서 체크 예외인 SQLException을 적절한 [[DataAccessException]] 계열의 예외로 변환하는 인터페이스

# 사용법

## translate() 사용

`DataAccessException translate(String task, @Nullable String sql, SQLException ex);`

- `task`: 예외가 발생한 작업(예: “Executing query”)
- `sql`: 실행한 SQL 문 (null 가능)
- `ex`: 변환할 SQLException 객체