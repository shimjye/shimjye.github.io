#테스트주도개발

<!--
description = 정리자료
tag = think, engineering, tdd
-->

TDD는 효율성이 떨어진다. TDD는 죽었다는 글이 공감을 얻은 지도 한참이지만 아직도 이상주의자(?)와 그렇지 않은 사람과의 논쟁은 계속되고 있다. 어떤 것이 절대적으로 좋다고 하기는 힘들지만 나는 TDD가 잘못되어 있다고 생각한다.

1. TDD가 이상적으로는 굉장히 좋은 방법임은 분명하다. 하지만 이는 사람과 잘 어우러지지 않는 방법이라 생각한다.
이상적으로 100%의 목표, 높은 커버리지를 지향하며 개발하는 것은, 심지어 1 더하기 1조차도 테스트를 해야 함은 많은 경우에 개발의 실패를 가져온다. 내 개인적 생각으로는 머리가 뛰어난 사람은 테스트를 생각만큼 잘 하지 않는다. 이러한 테스트 방법은 똑똑한 사람이 1+1=2를 테스트 하지 않는 것과 비교해 생각할 수 있다. 물론 나는 머리가 나쁘다 생각하고, 이러한 방법에 대해 조금 더 생각해봤고 그 과정과 결과에서 나온 생각을 이야기하려 한다. 커버리지는 기계적인 측정 방법이고 사람과는 잘 어울리지 않는 점이 있다. 여기에는 휴먼에러를 줄이려는 방법으로 커버리지를 높이는 기술적 방법이 있으나 아직 대부분 개발자가 일하는 환경은 그다지 자동화적이지 못하고 인간적인 데에 문제의 접점이 있다.

2. 또한, 문제는 시간과 복잡도이다. 테스트가 많아지면 유지해야 할 코드의 양이 많아진다. 이는 문서화의 문제점과 비슷한 것 같다. 문서화 양이 많아지면 문서의 정보를 유지하는데 어려움이 생기고 틀린 문서는 버그라는 문제를 가져온다. 테스트는 그래도 어느 정도 서로 간에 연관을 가지고 있기에 틀리는 경우가 비교적 적겠지만, 테스트의 깊이가 깊어져 유지가 힘들어진다면 결국 문서화에서 발생하는 것과 같은 문제가 생길 것이다.

3. 이와 비교해 유닛테스트 자동화는 굉장히 효율성이 높다. 이것은 어느 정도 TDD와 연관되어 있다. 가끔은 혼용되어 사용되고 있으나 나는 이 둘의 의미를 서로 다른 것으로 분리하고자 한다. 일반적으로 테스트가 필요한 사항들은 재사용할 수 있고 기능과 독립된 그리고 실제 동작을 확인할 수 있는 테스트로 작성되어야 하며 출력을 이용한 테스트와 다르게, 유닛테스트는 이러한 기능 요소에 부합하여 작성될 수 있다. 재실행이 가능한 테스트 코드는 계속 자동적인 테스트를 수행하여 오류를 줄여야 한다. 초급시절 기능을 만들 땐 그냥 기계적인 기능을 만든다. 이는 기계적인 TDD 테스트와 비슷하다. 경력이 쌓이고 서비스를 만드는 지금은 100% 커버리지 목표가 아닌 계속적 자동화를 지원하고 독립적인 테스트를 만들고자 한다. 내게 아직은 정립되지 않았지만 때로는 테스트를 먼저 생각하고, 때로는 기능을 먼저 생각해 설계하고 개발한다.

4. 개발은 개발을 위한 목적이 아닌 적절한 방법으로 목적을 달성하기 위한 활동이다. 때로는 오프라인 방법으로 문제를 해결해야 하고 때로는 완벽한 코드를 찾아야 하는 활동이라 생각하며 한 가지 방법론을 맹신하면 안 된다고 생각한다. 또한, 나는 개발자이기에 개발을 위한 활동이 필요하며 부수적인 활동 예를 들어 소프트웨어공학에 너무 빠져서는 안 된다고 생각한다.