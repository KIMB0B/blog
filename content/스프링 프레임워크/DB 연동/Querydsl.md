---
title: Querydsl이란?
date: 2025-03-12T22:43:00
---
# Querydsl의 정의

> Java 코드 기반으로 SQL, JPA, MongoDB 등의 쿼리를 생성할 수 있도록 해주는 라이브러리<br>JPA와 함께 사용할 경우, 컴파일 타임에 검증 가능한 코드로 복잡한 동적 쿼리를 간결하게 작성할 수 있습니다.

# Q클래스

> Querydsl이 엔티티를 대상으로 자동 생성하는 클래스<br>해당 클래스를 통해 Java 코드 기반으로 쿼리를 작성하게될 수 있습니다.

**Q클래스를 생성하기 위해 빌드하는 명령어**

```bash
./gradlew clean compileJava
```

**생성 확인**

``build -> generated -> sources -> annotationProcessor -> java/main` 하위에 엔티티명 앞에 `Q`가 붙은 클래스가 생성되어있는지 확인합니다.

# 동적 쿼리 적용 예시

`ItemSearchCond`에는 검색 조건이 item의 이름, 최대 가격이 들어있고, 해당 조건에 값이 있으면 필터링을 하고, 없으면 모든 item을 가져오는 기능을 만든다고 가정하겠습니다.

## 1. BooleanBuilder 사용

```java
public List<Item> findAll(ItemSearchCond itemSearch) {
	String itemName = itemSearch.getItemName();
	Integer maxPrice = itemSearch.getMaxPrice();
	QItem item = QItem.item;
	
	BooleanBuilder builder = new BooleanBuilder();
	if (StringUtils.hasText(itemName)) {
	builder.and(item.itemName.like("%" + itemName + "%"));
	}
	if (maxPrice != null) {
	builder.and(item.price.loe(maxPrice));
	}
	
	List<Item> result = query
		.select(item)
		.from(item)
		.where(builder)
		.fetch();
		
	return result;
}
```

## 2. BooleanExpression 사용

```java
public List<Item> findAll(ItemSearchCond cond) {
	String itemName = cond.getItemName();
	Integer maxPrice = cond.getMaxPrice();
	
	List<Item> result = query
		.select(item)
		.from(item)
		.where(likeItemName(itemName), maxPrice(maxPrice))
		.fetch();
	
	return result;
}

private BooleanExpression likeItemName(String itemName) {
	if (StringUtils.hasText(itemName)) {
		return item.itemName.like("%" + itemName + "%");
	}
	return null;
}

private BooleanExpression maxPrice(Integer maxPrice) {
	if (maxPrice != null) {
		return item.price.loe(maxPrice);
	}
	return null;
}
```