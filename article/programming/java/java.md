# 자바

<!--
description = 정리자료
tag = programming, java
-->

### stream
- Integer[] seqs = areaList.stream().map(item -> item.getSeq()).toArray(Integer[]::new);
- String param = Arrays.stream(seqs).map(i -> String.valueOf(i)).collect(Collectors.joining(",")) ;
- for(Area item : areaList) {
    item.setChildAreaList(childAreaList.stream().filter(p -> p.getParentSeq().equals(item.getSeq()))
                .collect(Collectors.toList()));
}
- distict
orderGroup.setOrderItems(new ArrayList<OrderItem>(orderGroup.getOrderItems().stream()
        .collect(Collectors.toMap(OrderItem::getItemSeq, p -> p, (p, q) -> p)).values()));
- sort
// Override compareTo, equals, hashCode
List<Student> slist = list.stream().sorted().collect(Collectors.toList());
slist = list.stream().sorted(Comparator.reverseOrder()).collect(Collectors.toList());
// variable
slist = list.stream().sorted(Comparator.comparing(Student::getAge)).collect(Collectors.toList());
slist = list.stream().sorted(Comparator.comparing(Student::getAge).reversed()).collect(Collectors.toList());
- top n list
List<String> firstNElementsList = list.stream().limit(n).collect(Collectors.toList());
