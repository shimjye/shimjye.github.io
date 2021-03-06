# Knot Theory

<!--
description = 정리자료
tag = think, rule, minimum
-->

## 이어폰 꼬이지 않게 보관하기
- 매듭 이론, 수학이 실생활에 도움을 얼마나 많이 주는지 생각하다가 조회한 글 내용이다. 수많은 사람의 난제인 이어폰 꼬이지 않게 보관하기를 해결하기 위해 매듭 이론이 사용된다.
- 하지만 몇몇 방법을 살펴본바 그다지 편리하지 않고 명확하지 않아 이론적인 공식으로 접근해 다시 생각해 봤다.
- 기초적인 매듭 이론. 그중 unknot 그냥 원 모양이다. 정확히 꼬이지 않은 매듭이다. 이어폰을 원 모양으로 보관하면 절대 꼬이지 않는다.(??) 하지만 이어폰 줄이 1m 정도일 때 50cm 길이로 보관할 수 있다.
- 여기에서 또 발견한 공식이 Fary–Milnor theorem이다. 매듭이 어쩌고저쩌고 4 pi보다 작은 경우 항상 꼬이지 않은 상태임을 증명한 공식이다.

## Fary–Milnor theorem
If K is any closed curve in Euclidean space that is sufficiently smooth to define the curvature k at each of its points, and if the total absolute curvature is less than or equal to 4pi, then K is an unknot.
- https://en.wikipedia.org/wiki/Fary%E2%80%93Milnor_theorem

## 활용
- 수학적인 증명은 생략하고 이어폰을 가지고 접근한다. 매듭 이론은 끝이 없는 원 형태의 매듭이고 이어폰은 직선 줄이다. 매듭 이론을 적용하기 위해 줄 끝과 끝을 서로 가상의 직선으로 연결하여 원 형태로 생각한다.
- 이어폰을 한 번 접으면 가상의 선을 통해 원이 되고 2 pi, 한 번 더 접으면 4 pi가 된다. 1m 이어폰 줄을 25cm까지 줄이는 데 성공했다.

![4pi](images/d20180802_knot0.jpg)

- 이 상태로라면 아무리 가방에 오래, 주머니에 오래 있어도 절대 꼬이지 않는다. 그 증명은 Fary–Milnor theorem으로 되어있으니 나는 모른다.
- 역시 25cm를 보관하기는 불편하다. 여기서 다른 방법에 많이 나온 것과 같이 현재 꼬인 상태를 유지하며 길이를 줄이는 방법이 필요하다. 나는 그냥 한 바퀴 묶었다. 그리고는 잘된다.
- 이것은 위상적인 형태를 유지하며 선을 묶어주는 방법이다. 다른 방법에서는 집게를 사용한다던가 자석을 사용하여 그 형태를 유지하도록 한다. 그냥 묶어도 잘되는 것 같아 그냥 사용하기로 한다. 사실 여기서는 묶는 것이 아니라 위상적인 형태를 유지하기 위해 공간을 뒤틀어 준 것이다. 이어폰은 계속 4 pi로 있다.

![topology](images/d20180802_knot1.jpg)

- 이어폰에서는 가상의 선을 이었다는 점과 Y자로 선이 구성되어 있음에 실제로는 꼬임이 발생할 수 있겠지만 이론적으로는 절대로 꼬이지 않는 이어폰 보관방법이다.

## conclusion
- 수학은 생활에 도움이 된다.
- Fary–Milnor theorem = 니 이어폰을 2번만 접은 상태로 유지하여 보관하면 절대 꼬이지 않는다.
