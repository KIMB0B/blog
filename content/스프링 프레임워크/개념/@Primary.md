# 정의

>조회하고 싶은 [[Bean]]과 타입이 동일한 다른 [[Bean]] 이 한 개 이상 있다면 오류가 남
>우선적으로 조회할 빈을 @Primary를 통해 지정해줄 수 있음

# 사용 예시
## 빈 등록
```java
@Component
@Primary
public class RateDiscountPolicy implements DiscountPolicy {
}
```
## 의존성 주입
```java
@Autowired
public OrderServiceImpl(
	MemberRepository memberRepository,
	DiscountPolicy discountPolicy
) {     
	this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
}
```
>[!note] 코드 설명
>빈 등록할 때 우선적으로 선언할 빈에게 @Primary 어노테이션을 추가해주면 별 다른 작업 없이 해당 타입의 빈을 의존성 주입하면 @Primary를 적용한 RateDiscoutPolicy타입의 빈이 주입됨