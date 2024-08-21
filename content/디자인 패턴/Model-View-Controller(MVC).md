---
title: MVC 패턴이란?
date: 2024-08-21T14:16:00
---

# MVC 패턴의 정의

> 하나의 애플리케이션, 프로젝트를 구성할 때 그 구성요소를 세가지의 역할로 구분한 패턴<br>그 역할 3개가 Model, View, Controller입니다.

---
# 구성

![image](https://gist.github.com/user-attachments/assets/ac18087f-863a-41aa-a121-3b25bb0ea5c1)

- `controllers` : 미들웨어 함수를 분리해서 관리해 줄 곳
- `models` : DB 생성을 관리해주는 곳
- `view` : 화면에 보여지는 파일들(html 파일)을 관리해주는 곳

---
# 실행 과정

1. controller를 조작합니다.
2. controller는 model을 통해서 데이터를 가져옵니다.
3. 그 정보를 바탕으로 시각적인 표현을 담당하는 View를 제어해서 사용자에게 전달합니다.

---
# 예시

![image](https://gist.github.com/user-attachments/assets/f510efec-7e58-496d-9629-861d09826415)
(TypeScript 환경에서의 예시)
현재 예시에서는 추가로 [[의존성 주입(DI)]]를 통해 결합을 느슨하게 하는 과정도 추가적으로 필요함