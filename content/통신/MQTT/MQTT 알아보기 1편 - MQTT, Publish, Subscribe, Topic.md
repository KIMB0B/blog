---
title: MQTT 알아보기 1편 - MQTT, Publish, Subscribe, Topic
date: 2022-02-18T14:14:00
---
![](https://blog.kakaocdn.net/dn/d4dDMx/btrtDEA7P7D/rtVQBlODE4NczZkA9M2u3K/img.png)

# **정의**

> MQTT는 컴퓨터에서 데이터를 주고받는 방식 중 하나다.

컴퓨터에서 데이터를 주고받는 방식을 프로토콜이라고 한다. 그래서 MQTT는 프로토콜의 일종이다. MQTT에서 주고받는 데이터는 메시지인데, 우리가 잘 알고 있는 카카오톡, 라인, 페이스북 메신저와 같은 메신저를 쓸 때 메시지를 보낸다 하는 그 메시지다. 실제로 페이스북 메신저는 이 MQTT방식으로 메시지가 오고 가고 있다.

![](https://blog.kakaocdn.net/dn/bkPNp4/btrtADpE0zq/8kvSWKDH8ssaC3zOkBtz81/img.webp)

또롱

---
# **많이 쓰이는 건가?**

페이스북같은 대기업에서 사용하는 MQTT는 얼마나 대단한 걸까? ISO라는 기구가 얘를 표준으로 인정해줬다. 들어본 사람도 있겠지만 ISO는 세계적으로 표준으로 쓰일 만큼 널리 쓰이는 여러 기술들을 진짜 표준으로 인정해주는 국제 표준화 기구이다. 이걸 만든 회사 IBM에서 2013년에 제출하고 2016년에 인증받았으니까 꽤나 따끈따끈한 신기술인 셈이다.

[ISO - ISO/IEC 20922:2016 - Information technology — Message Queuing Telemetry Transport (MQTT) v3.1.1](https://www.iso.org/standard/69466.html)

여담으로 이 친구는 발음으로 '아이에스오'가 아니라 '아이소'라고 읽으면 된다고 한다. 삼성이 그렇단다. 그냥 흥미롭길래 추가해봤다. 난 맨날 아이에스오라고 했었거든...

[ISO는 ‘아이소’라고 읽어주세요! (samsungsds.com)](https://www.samsungsds.com/kr/story/1233835_4655.html)

아무튼 그러다 보니 쓰이는 곳은 많다. 특성에 대해선 뒤에서 얘기하겠지만 MQTT 특성에 맞게 IoT 분야에서 가장 많이 쓰인다. 사실 MQTT가 처음 만들어지게 된 배경도 IoT에 있다. 사막의 송유관들의 센서에 측정된 데이터들을 위성으로 보내기 위해 만든 기술이기에 인터넷이 빵빵한 환경보단 이런 IoT 쪽에 쓰이는 경우가 많다. 또 위에서 말한 페이스북 메신저에도 사용이 되고, 배달의 민족에서 주문 중계 시스템에 적용들 시키려고도 했었다. 하지만 찾아보니 아쉽게 적용이 되지는 못한 것 같다. 이에 대해선 아래에 MQTT의 단점에서 다루도록 하겠다.

[MQTT 적용을 통한 중계시스템 개선 | 우아한 형제들 기술 블로그 (woowahan.com)](https://techblog.woowahan.com/2540/)

---
# **구조와 전송 과정**

위에선 메신저 얘기를 많이 했지만 구조를 이해하기 위해선 트위터를 생각하면 바로 와닿을 것이다.

![](https://blog.kakaocdn.net/dn/7IA0l/btrtDfupKnh/uDxYKd0YCoTnn9NcPKLq31/img.png)<br>(짹짹)

트위터뿐만은 아니지만 트위터는 구독이 메인인 SNS이다. 내가 관심 있는 사람, 기관, 키워드를 구독하면 구독한 모든 곳에서 새롭게 글이 작성될 때마다 내 피드에 하나하나 추가되면서 우리는 그 글들을 확인할 수 있다. 그럼 우리는 구독한 구독자, 우리가 구독한 사람들은 글을 쓴 발행인이 된다.

넷플릭스도 구독이 있다. 그러나 트위터와 다른 점은 오징어 게임이나, 지금 우리 학교는 같은 콘텐츠를 오직 넷플릭스만 발행할 수 있다는 점이다. 우리는 구독해서 보는 것만 가능하다. 그러나 트위터는 내가 구독한 사람들의 글을 피드에 받으며 구독자가 되기도 하지만 내가 직접 글을 올리면 나를 구독한 사람의 피드에 내 글이 올라가며 우리는 발행인의 역할 또한 될 수 있다. 그 두 가지의 역할을 하는 우리는 트위터 사용자인 것이다.

MQTT의 구조는 크게 세 분류로 되어있다. 이것을 위의 twitter에 대입해보면

- Subscriber : 다른 사람, 기관, 키워드를 구독한 사용자
- Publisher : 글을 작성한 사용자
- Broker : twitter 서버

인 것이다. 그래서 전송 과정은 Publisher가 글을 쓰면 Broker로 가서 구독한 Subscriber 전체에게 메시지를 뿌리게 되는 것이다. twitter와의 차이점은 구독한 곳에서 발행된 이전 글들을 모두 볼 수 있지만 MQTT는 내가 접속한 이후부터의 글만 볼 수 있다. 또한 MQTT는 구독한 곳에 메시지가 누적되어 쌓이는 것이 아니라 가장 최근의 메시지만 남아있는 방식이다.

MQTT 안에서는 사람이나 기관, 키워드를 구독하는 것이 아닌 Topic을 구독한다. Topic에 대해서 자세하게 알아보도록 하겠다.

---
# **Topic이 뭘까?**

MQTT는 사용자를 구독하진 않는다. 대신 topic이란 것을 구독한다고 했었다. twitter로 치면 하나의 해시태그를 걸고 구독/발행하는 것이다. 예를 들어 아침밥 사진을 발행한다고 했을 때, 밥이니까 "#food" 라는 이름의 해시태그를 달고 발행을 하면 "#food" 해시태그를 단 게시글이 다 나오도록 구독한 사용자는 아까 발행된 아침밥 사진 받을 수 있는 것이다.

물론 MQTT에서는 # 은 다른 용도가 있어 앞에 달지 않는다. 그리고 MQTT에선 이 food가 아침인지 점심인지 저녁인지 구분할 수 있도록 / 기호를 사용하여 food/breakfast, food/lunch, food/dinner 이런 식으로 나눌 수도 있다. 이렇게 하면 food라는 topic하위의 모든 topic을 구독한다면 food/breakfast, food/lunch, food/dinner topic 전부가 구독이 되는 것이고, 아침 사진만 받을 사용자라면 food/breakfast만 구독하는 식으로 사용할 수 있다. 앞에 말한 현재 topic 하위의 모든 topic을 구독할 때 쓰는 기호가 # 이다. 그렇다는 건 아침, 점심, 저녁을 모두 구독하기 위해선 food/#을 구독하면 된다는 소리이다.

이런 구조는 **tree형 구조**라 한다.

![](https://blog.kakaocdn.net/dn/c4J7D1/btrtE2aNvnv/EvH571Kn5YDIE2iv2on0bk/img.jpg)

(ㄴ..나?)

나뭇가지를 잘 보면 나뭇가지 중간에 나뭇가지가 나고, 그 나뭇가지의 중간에도 나뭇가지가 나고,... 이렇게 쭉 이어진다. 이와 같이 상위의 항목에서 하위의 항목이 하나 또는 여러 개 계속 내려져 이어 가는 구조를 나무 같다 하여 tree형 구조라 한다.

topic을 다시 보면 food아래로 breakfast, lunch, dinner라는 항목이 생성되고, 그 안에서도 main dish, drink 등등 메뉴 구성으로 나누어 구성할 수도 있다. 

윈도우의 파일 구조도 이런 식으로 되어있다. 파일 탐색기를 보고 있다 생각했을 때 food라는 상위 폴더를 들어가면 그 안에도 여러 폴더가 있고, 거기서 lunch폴더로 들어가면 그 안에도 여러 폴더가 있는 식인 것이다.

> **요약하자면**  
> 
> - Topic은 Publisher가 어디에 발행할 것인지, Subscriber가 무엇을 구독할 것인지의 기준이 되며, tree형 구조로 되어 있어 topic 아래 하위 topic을 구성할 수 있고, 하위 topic 전체를 구독할 수도 있다.  
> 
> - / 기호를 기준으로 하위 topic으로 내려간다.  
> 
> - # 기호는 이 topic의 하위 topic 전체를 뜻한다.

---
# **장/단점**

MQTT는 그러니까 자기가 원하는 topic만 구독해서 메시지를 받아볼 수 있고, 자기를 구독한 사용자에게 메시지를 한 번에 팍 전달할 수 있다는 것인데 어디다 써야 좋고 장점과 단점으로는 어떤 게 있을까?

topic의 트리구조 때문에 먼저 IoT에 쓰기 좋다. 위에서도 얘기했지만 애초에 처음 개발되게 된 이유도 IoT에 있기에 매우 IoT에 친화적이다. A라는 로봇이 있고, B라는 로봇이 있을 때 각각 머리, 몸통, 다리 부분에 온도, 습도를 잴 수 있는 센서가 있고, 그 값들이 MQTT 서버에 발행되고 있다고 예시를 들어보자. 

![](https://blog.kakaocdn.net/dn/UcySq/btrtHU4pEkG/fxaHjmIEPUHbPKyzzlKSZ0/img.png)

(위 예시의 topic 구조)

tree구조의 이점을 활용해 A로봇 전체의 측정값이 필요하다면 A/#을, B로봇의 다리 측정값만 필요하다면 B/다리/#을, A로봇의 몸통 온도만 알고 싶다면 A/몸통/온도 이런 식으로 원하는 topic의 값만 실시간으로 값을 구독받을 수 있다는 것이 IoT에서 쓰기 매우 좋은 점이다.

또한 각각의 사용자마다의 topic을 가지고 있고 친구 추가를 하면 그 친구의 topic을 구독하여 메신저의 기능을 만들기도 좋다.

그럼 장점을 정리해보자면

- tree구조의 topic을 이용해 사용자가 원하는 값만 실시간으로 받아올 수 있음.
- 낮은 대역폭으로 인터넷 환경이 좋지 않아도 다른 통신 방법에 비해 원활히 사용이 가능함.
- 한 명 한명 메시지를 보내는 것이 아니라 중간의 Broker가 자신을 구독한 사용자에게 한 번에 뿌려줌.

이 세 개가 큰 장점이라고 할 수 있다.

단점도 존재한다. 이 단점으로 인해 위에서 언급한 배달의 민족이 MQTT를 활용하지 못했다.

바로, Publisher와 Subscriber 둘 다 온라인 상태일 때만 Subscriber가 메시지를 받을 수 있는 것이다. Subscriber가 오프라인일 때 보류해 두었다가 온라인이 되면 메시지를 쏴 주는 방식이 아니라서 배달의 민족에선 배터리를 위해 사용하지 않으면 자동으로 대기모드로 들어가 버리는 스마트폰의 특성 때문에 MQTT의 접속을 지속시킬 수 없었다.

---
# **마치며**

MQTT가 뭐 하는 놈인지에 대해 정리해 보았다. 위의 내용들을 종합해서 있어 보이게 요약해보면 이제 어려워 보이는 말이 나와도 바로 알아들을 수 있다.

> MQTT는 ISO를 통해 국제 표준화된 Publish-Subscribe 기반의 메시지 송/수신형 프로토롤이다.

![](https://blog.kakaocdn.net/dn/mfiFA/btrtBOkJhtc/5CmQkM86Kk1sV0VhgUhi6K/img.jpg)

하지만 아직 이론에 대해 설명하지 못한 내용들이 더 있다. 특히 Broker에 대해서는 다룰 내용이 많아 다음 글에 마저 작성하도록 하겠다. 그 후엔 Python을 통해 MQTT를 사용해 보도록 하겠다. 언제든 댓글로 궁금한 점이 있으면 바로 답장해 주도록 하겠다.