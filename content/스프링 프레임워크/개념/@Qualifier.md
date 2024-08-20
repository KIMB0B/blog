# 정의

> 조회하고 싶은 Bean과 타입이 동일한 다른 Bean 이 한 개 이상 있다면 오류가 남
> 원하는 빈에게 조회할 때 사용할 별명을 @Qualifier로 지정해줄 수 있음

# 사용 예시
## 빈 등록
```java
@Component
@Qualifier("mainDiscountPolicy") //
public class RateDiscountPolicy implements DiscountPolicy {
}
```
## 의존성 주입
```java
@Autowired
public OrderServiceImpl(
	MemberRepository memberRepository,
	@Qualifier("mainDiscountPolicy") DiscountPolicy discountPolicy
) {
	this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
}
```
>[!note] 코드 설명
>빈 등록할 때 해당 빈에 @Qualifier를 통해 별명을 지어주고, 의존성을 주입할 때 @Qualifier를 이용하여 지어놓은 별명을 넣어 의존성 주입을 함