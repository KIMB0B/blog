---
title: TypeScript의 Interface 알아보기
date: 2024-08-20T22:46:00
---

# Interface 정의

>TypeScript에서 Object(객체)의 타입을 지정할 때 사용함
>상호간에 정의한 약속 혹은 규칙을 의미

---
# Object 정의 범주

- 객체의 스펙(속성과 속성의 타입)
- 함수의 파라미터
- 함수의 스펙(파라미터, 반환 타입 등)
- 배열과 객체를 접근하는 방식
- 클래스

---
# 예시

**인터페이스**
```typescript
interface IProfile { 
	name: string 
	age: number | string 
	school: string 
	hobby?: string 
}
```

**객체 선언**
```typescript
let profile: IProfile = { 
	name: "철수", 
	age: 8, 
	school: "다람쥐초등학교" 
}

profile.hobby = "수영" // 미리 지정된 속성이기 때문에 데이터 추가 가능!
profile.height = 180 // 🚨 기존 profile 객체에는 height가 없기에 데이터 추가 불가능!
```

---
# 특징

1. 기본적으로 interface안에 지정한 **속성**들은 객체 선언 시 **무조건 선언**되어야 하고, 무조건을 원치 않다면 interface의 속성명 뒤에 <u>물음표(?)</u>를 붙힘(예시의 hobby속성 참고)
2. interface를 생성할 때 넣지 않은 속성을 나중에 코드 내에서 추가할 순 없음(예시의 height속성 참고)