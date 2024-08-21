---
title: Bean Validation이란?
date: 2024-08-21T12:33:00
---

# Bean Validation의 정의

>Bean Validation 2.0(JSR-380)이라는 기술 표준으로 검증 애노테이션과 여러 인터페이스의 모음입니다.

# 사전 작업
### 의존관계 추가

Bean Validation을 사용하기 위해선 우선 `build.gradle`에서 의존관계를 추가해줘야합니다.
```properties
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

### 다른 검증기 연결 코드 제거

[[@Validated#^dfaab1|다른 검증기 연결 코드]]가 있으면 Spring의 Bean Validation만 적용해주기 위해 다른 검증기 연결 코드는 삭제해야 합니다.

# 사용 예시

### 도메인에 적용
```java
@Data
 public class Item {

     private Long id;
     
     @NotBlank
     private String itemName;

     @NotNull
     @Range(min = 1000, max = 1000000)
     private Integer price;

     @NotNull
     @Max(9999)
     private Integer quantity;
}
```
>[!note] 설명
>@NotBlank, @NotNull, @Range, @Max 등등 여러가지의 Bean Validation이 있습니다.

### 호출 메서드
```java
@PostMapping("/add")
public String addItem(
	@Validated @ModelAttribute Item item, 
	BindingResult bindingResult, 
	...) {
	...
}
```

### Message 등록
```properties
// 상세
NotBlank.item.itemName=상품 이름은 필수입니다.

// 범용
NotBlank={0} 공백X 
Range={0}, {2} ~ {1} 허용 
Max={0}, 최대 {1}
```
>[!note] 인자값
>`{0}` 은 필드명이고, `{1}` , `{2}` ...은 각 애노테이션 마다 다릅니다.

# 오브젝트 에러 처리

[[BindingResult#1. 필드 오류 - FieldError|FieldError]]가 아닌 [[BindingResult#2. 글로벌 오류 - ObjectError|ObjectError]]관련 오류는 오브젝트 오류 관련 부분만 [[BindingResult#2. reject()|직접 자바 코드]]로 작성하는 것을 권장합니다.

# 검증 로직 분리
### Groups

같은 Model이어도 상황별로 검증 로직이 다를 때 사용할 수 있습니다.

예시) 상품 등록할 때는 수량을 9999까지만 넣을 수 있지만 수정할 때는 무제한으로 넣을 수 있는 경우
##### 1. Interface 생성
```java
package hello.itemservice.domain.item;
public interface SaveCheck { }
```
```java
package hello.itemservice.domain.item;
public interface UpdateCheck { }
```
##### 2. Groups 적용
```java
@Data
public class Item {
	...
	
	@NotNull(groups = {SaveCheck.class, UpdateCheck.class}) // 등록 수정 둘 다 적용
	@Max(value = 9999, groups = SaveCheck.class) // 등록시에만 적용
	private Integer quantity;
```
##### 3. Groups 로직 Controller에 적용
```java
// 저장 로직에 추가 예시

@PostMapping("/add")
public String addItemV2(
	@Validated(SaveCheck.class) @ModelAttribute Item item, // 인터페이스를 인자로 추가
	BindingResult bindingResult, ...) {
	...
}
```

### 객체 자체를 분리

Groups보다 더 범용적으로 쓰는 방법. 데이터 객체 자체를 추가용, 수정용 등으로 따로 만듭니다.

##### 1. 객체 각각 생성
```java
// 추가용

@Data
public class ItemSaveForm {

    @NotBlank     
    private String itemName;

    @NotNull
    @Range(min = 1000, max = 1000000)
    private Integer price;

    @NotNull
    @Max(value = 9999)
    private Integer quantity;
}
```

```java
// 수정용

@Data
public class ItemUpdateForm {

    @NotNull
    private Long id;
    
    @NotBlank
    private String itemName;

    @NotNull
    @Range(min = 1000, max = 1000000)
    private Integer price;

	//수정에서는 수량은 자유롭게 변경할 수 있다. 
	private Integer quantity;
```
### 2. 분리 로직 Controller에 적용
```java
// 저장 로직에 추가 예시

@PostMapping("/add")
public String addItemV2(
	@Validated @ModelAttribute("item") ItemSaveForm item, // ItemSaveForm 타입
	BindingResult bindingResult, ...) {
	...
	Item item = new Item(); 
	item.setItemName(form.getItemName()); 
	item.setPrice(form.getPrice()); 
	item.setQuantity(form.getQuantity());
	...
}
```
>[!note] 설명
>분리해서 만든 데이터 모델 타입으로 item을 파라미터로 추가함.
>코드 중간에 new Item();을 이용하여 기존의 Item타입으로 객체를 새로 만들어준 후 이용할 수 있음.

>[!warning] 주의
`@ModelAttribute("item")` 에 `item` 이름을 넣어준 부분을 주의하자. 
이것을 넣지 않으면 `ItemSaveForm` 의 경우 규칙에 의해 `itemSaveForm` 이라는 이름으로 MVC Model에 담기게 된다. 
이렇게 되면 뷰 템플릿에서 접근하 는 `th:object` 이름도 함께 변경해주어야 한다.