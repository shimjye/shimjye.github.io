# Spring Controller Annotation

<!--
description = 조금 오래된 자료
tag = programming, java, spring
-->

## 어노테이션

- @RequestMapping : URI를 맵핑해 주며 HTTP Header / Method를 처리해 준다.
- @PathVariable : REST URI를 파라미터로 맵핑해 준다.
- @ResponseBody : return value를 HTTP response body로 변환해 준다.
- @RequestParam : 파라미터를 받는다.

## 소스
```
@RequestMapping(value="/{id}", method=RequestMethod.GET)
@ResponseBody
public RestDTO getRest(@PathVariable("id") long id, @RequestParam("idValue") String idValue) {
	return restService.findRest(id);
}
```

## 참조
- http://www.egovframe.go.kr/wiki/doku.php?id=egovframework:rte2:ptl:annotation-based_controller
