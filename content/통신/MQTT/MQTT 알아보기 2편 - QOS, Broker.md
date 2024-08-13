---
title: MQTT 알아보기 2편 - QOS, Broker
date: 2022-03-08T14:48:00
---
![](https://blog.kakaocdn.net/dn/034Cl/btrvbeIjplf/BavUdHa2uQSRvzWKvDoYZk/img.png)

지난시간엔 MQTT에 대한 기본적인것과 Public, Subscribe, Topic에 대해 알아보았다. 기억이 나지 않는다면 1편을 다시 보도록 하자.

[[MQTT] MQTT란 무엇일까? - 1편 (MQTT/Publish/Subscribe/Topic)](https://hel-p.tistory.com/15)

# **QoS는 뭘까?**

Broker에 대해 알아보기 전에 먼저 QoS에 대해 알아보자. QoS는 MQTT가 기본적으로 제공하는 기능으로 영어 약자다. 풀어서 말하면 Quality of System. 해석한 대로 서비스의 품질 단계를 설정할 수 있는 것이다.  
  
단계는 3종류가 있고, 역시 컴공 공돌이가 만들어서 그런지 0부터 센다. 그래서 QoS0, QoS1, QoS2가 있다. 0부터 2로 갈 수록 더 확실하게 메시지를 전달하고, 대신에 부하가 더 많아진다.

![](https://blog.kakaocdn.net/dn/bBzWwd/btrvGbpCWTb/Ke73DhYF3XXjvAhRGNpKH1/img.png)

(QoS0, QoS1, QoS2의 차이)

QoS 0 : 메시지를 보내고 잘 갔는지 아닌지 확인 한번 하지 않는 방법이다. 요즘 선거때문에 허경영 뭐시기 사무소에서 계속 오는 ARS를 생각하면 쉽다. 경영이는 ARS를 아무나에게 막 보내고 우리에게 전화가 정확히 갔는지 아닌지 알바가 아니고 부하를 줄여 한명이라도 더 전화가 가게 하는게 중요하니 이 방식을 사용했다고 생각하면 된다.  
  
QoS 1 : 메시지가 전달되었다는 신호를 받고, 신호가 안오면 신호가 올 때 까지 계속 메시지 전송을 시도하는 방법이다. 확실하게 메시지를 한번 보낼 수 있지만, 안 보낸거라 착각해서 여러 번 보낼수도 있게되는 단점이 있을 수 있다.  
  
QoS 2 : 메시지를 확실하게 딱 한번 보내는 방법이다. 위 사진에서 보이듯이 확인하는 절차가 많아 부하가 많다는 단점이 있다.  
  

---
# **MQTT Broker는 뭘까?**

지난 글에서는 Broker에 대한 간단한 설명만 있었다. 대충 서버 역할을 하는 것이라는 건 알겠는데 정확히 뭘까?  
  
정확히 Broker는 서버는 아니다. 그냥 메시지가 흐르는 통로일 뿐이고, 말 그대로 Broker는 중개인 역할을 해준다. Broker가 하는 일들은 아래와 같다.

1. Publisher Client가 Publish 한 메시지를 가져온다.
2. Publish 된 메시지 Topic을 확인한다.
3. 본인에게 연결된 Client들 중 그 Topic을 Subscribe 하고 있는 Client를 찾아서 메시지를 보낸다.

주소같은 Topic을 보고 맞는 위치에 메시지를 전달해주는 집배원분들과 비슷한 역할을 하는 것이다.

![](https://blog.kakaocdn.net/dn/sDPKk/btrvtdnXrTe/uWRDzvH238hAWGW4Ef8bL0/img.jpg)

그러고 보니 우체통 못 본지 오래됐네..

이렇듯 Broker는 중요하지만 이해하기 간단한 친구다.  
  
여기까지는 모든 Broker가 기본적으로 하는 일인데 Broker마다 조금씩 추가적으로 할 수 있는 기능이 차이가 나기도 한다. Broker 마다라니? 그렇다. Broker는 한 종류가 아니다. 여러 회사에서 만들어놓은 Broker들이 많아서 내가 MQTT로 무얼 할 지에 따라 MQTT Broker를 맞게 정하는 것이 중요하다.  
  
이제 여러 Broker중 내가 원하는 Broker를 선택하는 법을 알아보자.

---
# **MQTT Broker 선택**

Computer나 Server에서 MQTT전송을 해 줄 Broker 프로그램을 설치하고, 작동하도록 설정해야 하는데 그전에 일단 Broker가 너무 많다.  
우리가 신경써야 할 목록이다.

- QoS 0, 1, 2 지원 여부
- Broker 접속 보안 방식
- Cluster, Bridge 방식 지원 여부
- $SYS Topic 지원 여부
- SSL 보안 프로토콜 지원 여부
- Plugin System 여부
- MQTT 5 지원 여부
- Cloud 방식 혹은 설치 방식
- 속도와 가격

아직 모르는 것도 많고, 신경 쓸게 너무 많다. Cluster, Bridge는 여러 Broker들을 하나로 묶어서 사용하기 위한 것으로만 알고있으면 되고 자세한건 추후 설명하도록고, SSL, $SYS는 실습해보면서 설명하도록 하겠다. 연습용 실습을 하기 위해서라면 구글에 쳐서 나오는 것 중에 많이 나오는 거 쓰면 되지만 프로젝트를 진행한다면 하나하나 신경을 써야 한다.  
  
다행히도 MQTT 깃허브에 이와 관련해 정리된 문서가 있다.

|                                                                                                                         |          |          |          |                                                        |            |          |         |             |                   |                   |
| ----------------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------- | ------------------------------------------------------ | ---------- | -------- | ------- | ----------- | ----------------- | ----------------- |
| **Server**                                                                                                              | **QoS0** | **QoS1** | **QoS2** | **auth**                                               | **Bridge** | **$SYS** | **SSL** | **Cluster** | **Plugin System** | **MQTT5 Support** |
| [Aedes](https://github.com/moscajs/aedes)                                                                               | ✔        | ✔        | ✔        | Username/Password                                      | **rm**     | ✔        | ✔       | ✔           | ✔                 | ✘                 |
| [AWS IoT Services](https://aws.amazon.com/en/iot/)                                                                      | ✔        | ✔        | ✔        | Client certificates                                    | ?          | ✘        | ✔       | ✔           | ✘                 | ✘                 |
| [Apache ActiveMQ Artemis](http://activemq.apache.org/)                                                                  | ✔        | ✔        | ✔        | JAAS                                                   | ✘          | ✘        | ✔       | ✔           | ✔                 | ✘                 |
| [BevywiseIoTPlatform](https://www.bevywise.com/iot-platform/)                                                           | ✔        | ✔        | ✔        | Key based                                              | ✔          | ✔        | ✔       | ✔           | **rm**            | ✘                 |
| [ClearBlade](https://clearblade.com/)                                                                                   | ✔        | ✔        | ✔        | OAuth based User/Pass  <br>& Per-channel authorization | ?          | ✔        | ✔       | ✔           | ?                 | ✘                 |
| [ejabberd](https://www.process-one.net/en/ejabberd)                                                                     | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✔                 |
| [emitter](https://github.com/emitter-io/emitter)                                                                        | ✔        | ✘        | ✘        | Per-channel authorization                              | ✘          | ✘        | ✔       | ✔           | ✘                 | ✘                 |
| [EMQ X](https://www.emqx.io/)                                                                                           | ✔        | ✔        | ✔        | Username/Password,  <br>JWT, LDAP, ClientID, ...       | ✔          | ✔        | ✔       | ✔           | ✔                 | ✔                 |
| [flespi](https://flespi.com/mqtt-broker)                                                                                | ✔        | ✔        | ✔        | ✔                                                      | ✘          | ✘        | ✔       | ✔           | ✘                 | ✘                 |
| [GnatMQ / M2MQTT](https://github.com/ppatierno/gnatmq)                                                                  | ✔        | ✔        | ✔        | Username/Password                                      | ✘          | ✘        | ✔       | ✘           | ✘                 | ✘                 |
| [HBMQTT](https://github.com/beerfactory/hbmqtt)                                                                         | ✔        | ✔        | ✔        | Username/Password,  <br>Client certificates            | ✔          | ✔        | ✔       | ✘           | ✔                 | ✘                 |
| [HiveMQ](http://www.hivemq.com/)                                                                                        | ✔        | ✔        | ✔        | Username/Password                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✔                 |
| [IBM IoT MessageSight](https://www.ibm.com/downloads/cas/QXL3EAWJ)                                                      | ✔        | ✔        | ✔        | Username/Password                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✘                 |
| [IBM Watson IoT Platform](https://www.ibm.com/us-en/marketplace/watson-iot-platform-message-gateway)                    | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✘                 |
| [IBM WebSphere MQ Middleware](https://www.ibm.com/support/knowledgecenter/SSFKSJ_7.5.0/com.ibm.mq.pro.doc/q001020_.htm) | ✔        | ✔        | ✔        | Username/Password,  <br>client certificate             | ✔          | ✔        | ✔       | ✔           | ✘                 | ✘                 |
| [Jmqtt](https://github.com/Cicizz/jmqtt)                                                                                | ✔        | ✔        | ✔        | Username/Password,  <br>Client certificates            | ✔          | ✔        | ✔       | ✘           | ✔                 | ✘                 |
| [JoramMQ](http://mqtt.jorammq.com/)                                                                                     | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✘                 |
| [Mongoose](https://github.com/cesanta/mongoose)                                                                         | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✘        | ✔       | ✘           | ✔                 | ✘                 |
| [moquette](https://github.com/andsel/moquette)                                                                          | ✔        | ✔        | ✔        | ?                                                      | ✔          | ✘        | ✔       | **rm**      | ✘                 | ✘                 |
| [mosca](https://github.com/moscajs/mosca)                                                                               | ✔        | ✔        | ✘        | ✔                                                      | ✘          | ✘        | ✔       | ✘           | ✘                 | ✘                 |
| [mosquitto](https://mosquitto.org/)                                                                                     | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✔        | ✔       | §           | ✔                 | ✘                 |
| [MQTT.js](https://github.com/mqttjs/MQTT.js)                                                                            | ✔        | ✔        | ✔        | §                                                      | ✘          | ✘        | ✔       | ✘           | ✘                 | ✘                 |
| [MQTTnet](https://github.com/chkr1011/MQTTnet)                                                                          | ✔        | ✔        | ✔        | §                                                      | §          | §        | ✔       | §           | §                 | **rm**            |
| [MqttWk](https://github.com/Wizzercn/MqttWk)                                                                            | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ?        | ✔       | ✔           | ✘                 | ✘                 |
| [RabbitMQ](http://www.rabbitmq.com/blog/2012/09/12/mqtt-adapter/)                                                       | ✔        | ✔        | ✘        | SASL                                                   | ✘          | ✘        | ✔       | ✔           | ✔                 | ✘                 |
| [Software AG Universal Messaging](https://www.softwareag.com/de/products/az/universal_messaging/default.html)           | ✔        | ✔        | ✔        | ✔                                                      | §          | ✘        | ✔       | §           | ✘                 | ✘                 |
| [Solace](http://dev.solacesystems.com/tech)                                                                             | ✔        | ✔        | ✘        | Basic, client certificate,  <br>Kerberos               | §          | ✔        | ✔       | ✔           | ✘                 | ✘                 |
| [SwiftMQ](http://www.swiftmq.com/landing/router/index.html)                                                             | ✔        | ✔        | ✔        | ✔                                                      | ✔          | ✘        | ✔       | ✔           | ✔                 | ✘                 |
| [TraferoTstack](https://github.com/trafero/tstack)                                                                      | ✔        | ✔        | ✔        | ✔                                                      | ✘          | ✘        | ✔       | ✘           | ✘                 | ✘                 |
| [VerneMQ](https://vernemq.com/)                                                                                         | ✔        | ✔        | ✔        | Username/Password                                      | ✔          | ✔        | ✔       | ✔           | ✔                 | ✘                 |
| [Waterstream](https://waterstream.io/)                                                                                  | ✔        | ✔        | ✔        | Username/Password,  <br>SSL client certificates        | ✔          | ✘        | ✔       | ✔           | ✘                 | **rm**            |

모바일은 표가 좀 지저분해서 원 출처 Github에서 보는 것을 추천한다.  
[MQTT Broker Support(github.com)](https://github.com/mqtt/mqtt.org/wiki/server-support)
  
표를 보면서 나는 안정적인 전송을 무조건 해야 해서 QoS 2 지원을 원한다면 QoS2에 X 쳐져있는 Broker는 지우고, 여러개의 Broker를 쓰기 위해 Bridge나 Cluster방식이 꼭 필요해라 한다면 거기에 X쳐져있는 Broker 지우고 이런 식으로 나의 프로젝트에 맞지 않는 Broker들을 하나하나 지우면 선택지가 많이 줄어들 것이다.  
  
다음은 Cloud방식을 택할지 설치방식을 택할지인데, Cloud방식의 Broker 홈페이지에 들어가면 가격 당 무료는 한 번에 몇 개의 메시지, 100달러는 몇개의 메시지 이런 식으로 지원되는 가격정책을 확인할 수 있다. 그걸 확인하면서 가격과 트래픽 양을 비교해 보고, 많이 전송할 일이 없거나, 빵빵한 서버를 갖고 있어서 거기에 프로그램을 설치해서 사용하길 원한다면 가격을 비교해 보면 될 것이다. 사실 속도는 자료가 많이 없어서 찾기 힘들다...

[Bevywise사 속도 테스트 자료](https://blog.kakaocdn.net/dn/bbtmXR/btrvngUrJXD/kVjRDXl4eN8YgBCWjiFi8K/tfile.pdf)

그나마 찾은 자료는 Bevywise사에서 같은 환경으로 실험한 속도 테스트 자료이다.  
Mosquitto, Bevywise MQTT Route, ActiveMQ, HiveMQ, VerrneMQ, EMQ X Broker들을 대상으로 실험한 수치이니 참고하면 좋을 듯하다.  
  
나는 결과적으로 실습을 위해 Mosquitto를 선택했다.

---
# **Mosquitto를 선택한 이유**

![](https://blog.kakaocdn.net/dn/pGiVG/btrvqkho1KM/dCgpien6sTXKopVRrOJXa1/img.png)

(웨엥-)

Mosquitto 우리말로 번역하면 모기다. 이제 또 여름이 올텐데 모기는 제일 꼴보기 싫은 녀석이지만 얘는 아니다.  
  
Mosquitto는 Cloud방식이 아니라 설치 방식이고, Cluster 외에 내가 위에 얘기한 모든 기능이 적용된다. 첨부파일을 보면 이친구가 다른 애들에 비해 더 빠른 결과가 나오기도 했다. 그리고 Broker에 대해 인터넷에 찾아보면 이 친구에 대한 내용이 가장 많이 나와있기 때문에 실습하기 좋다고 생각했다.  
  
추가적으로 전에 쓴 1편 글에서 Facebook Messenger에서 MQTT를 적용했다고 했었는데, 그 때 Facebook이 쓴 Broker가 바로 Mosquitto이다.

![](https://blog.kakaocdn.net/dn/b48uui/btrvvaLeHCz/TRf3NJR3FoUpryGzk22oZ1/img.png)

옛날 옛적 추억이 새록새록 돋아나는 UI다.

---
# **마치며**

정리하자면 MQTT Broker는 메세지를 받아 그 메세지의 Topic을 구독한 Client에게 배달해주는 녀석이고, 얘는 깔아서 쓸 수도 있고, 설치해서 쓸 수도 있으며, Broker마다 지원되는게 다 달라서 잘 살펴보고 선택해야 한다는 것이다. 그리고 실습을 따라올 사람들은 Mosquitto를 사용하게 될 것이라는 것을 알고있으면 되겠다.  
  
다음엔 재미없는 얘기말고 실습을 해 보도록 하겠다. 우리는 Python을 사용해 MQTT를 써볼 예정이므로 Python에 MQTT를 컨트롤할 수 있는 PAHO 라이브러리에 대한 설명과 Mosquitto 설치 설명에 대한 글을 작성할 예정이다.  
Python 설치하는 글 먼저 썼어야 하는데 어.... 안바쁘면 내일 써야겠다.