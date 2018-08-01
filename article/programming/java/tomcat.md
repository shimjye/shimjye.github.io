# Tomcat Utf-8

<!--
description = 정리자료
tag = programming, java, lib, tomcat
-->

## Tomcat Utf-8

- 인코딩으로 인한 문제를 해결하기 위해 서버에서 소스까지 일괄적으로 UTF-8 사용
- DB 인코딩에서도 UTF-8 사용
- 파일 인코딩 utf-8 이클립스 설정
- Tomcat Server.xml

```
<Connector connectionTimeout="20000" port="8080" protocol="HTTP/1.1" redirectPort="8443" URIEncoding="UTF-8"/>
```

- Filter 설정

```
<filter>
<filter-name>Set Character Encoding</filter-name>
<filter-class>filters.SetCharacterEncodingFilter</filter-class>
<init-param>
<param-name>encoding</param-name>
<param-value>UTF-8</param-value>
</init-param>
</filter>
<filter-mapping>
<filter0name>EncodingFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
```

- 필터 클래스

```
public class EncodingFilter implements Filter {
	private String encoding = "utf-8";
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		request.setCharacterEncoding(encoding);
		filterChain.doFilter(request, response);
	}
	public void init(FilterConfig filterConfig) throws ServletException {
		String encodingParam = filterConfig.getInitParameter("encoding");
		if(encodingParam != null) {
			encoding = encodingParam;
		}
	}
	public void destroy() {
		// nothing todo
	}
}
```

- Html, jsp 파일

```
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
```

- 자바 실행명령 인자
- JAVA_OPTS -Dfile.encoding=UTF-8
- 톰캣 실행시 인자가 입력되도록 이클립스, tomcat 실행명령 라인, windows 환경변수에 실행방식에 따르는 인자 입력.
- 업로드등 파일 기능시 파일 읽기, 저장등에 따른 인코딩

- 참조 http://dertompson.com/2007/01/29/encoding-filter-for-java-web-applications/
