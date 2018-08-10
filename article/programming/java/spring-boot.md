# spring-boot

<!--
description = 정리자료
tag = programming, java, spring, boot
-->

## maven spring boot project
- java project maven base pom
  - https://spring.io/guides/gs/maven/
- spring boot dependence
  - https://projects.spring.io/spring-boot/#quick-start
- maven config

```
<properties>
    <maven.compiler.source>1.8<maven.compiler.source>
    <maven.compiler.target>1.8<maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>
```

- pom.xml

```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.4.RELEASE</version>
</parent>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>1.5.4.RELEASE</version>
</dependency>
<dependency>
    <groupId>joda-time</groupId>
    <artifactId>joda-time</artifactId>
    <version>2.9.2</version>
</dependency>
```

- spring boot base
  - https://spring.io/guides/gs/rest-service/
  - https://docs.spring.io/spring-boot/docs/2.0.0.BUILD-SNAPSHOT/reference/htmlsingle/
  - https://spring.io/docs/reference

## run
- application.yml https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-multi-profile-yaml
- active profiles https://docs.spring.io/spring-boot/docs/current/reference/html/howto-properties-and-configuration.html#howto-set-active-spring-profiles

```
@SpringBootApplication
public class Application {
    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(Application.class, args);
    }
}
```

- pkill -f 'java -jar'
- nohup java -jar -Dserver.port=8080 server-api-0.1.0.jar > output.log 2>&1&
- profile -Dspring.profiles.active=local, export SPRING_PROFILES_ACTIVE=dev

## controller
-  https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-developing-web-applications.html#boot-features-spring-mvc
- @Configuration, @EnableWebMvc
- static content WebMvcConfigurer https://stackoverflow.com/questions/47552835/the-type-webmvcconfigureradapter-is-deprecated
- @ControllerAdvice

## model
- @JsonInclude(Include.NON_NULL) jackson
- ToStringBuilder https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/builder/ToStringBuilder.html
- toJson new GsonBuilder().setDateFormat(Const.ymdhmssz).create().toJson(this);
- @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSSZ", timezone="Asia/Seoul")
- JsonProperty
- @JsonIgnoreProperties(value = { "intValue" }), JsonIgnore

## log
- https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-logging.html
- https://docs.spring.io/spring-boot/docs/current/reference/html/howto-logging.html
- https://logback.qos.ch/manual/configuration.html
- http debug log - debug log level

```
@Bean
public CommonsRequestLoggingFilter requestLoggingFilter() {
    CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
    loggingFilter.setIncludeClientInfo(true);
    loggingFilter.setIncludeQueryString(true);
    loggingFilter.setIncludePayload(true);
    loggingFilter.setMaxPayloadLength(1000);
    return loggingFilter;
}
```

## datasource mybatis
- https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-sql.html
- properties https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
- https://github.com/brettwooldridge/HikariCP
- useSSL=false&useUnicode=yes&characterEncoding=utf-8
- pom.xml

```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>6.0.6</version>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.0</version>
</dependency>
```

- http://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure
- database config /src/main/resouces/application.yml

```
mybatis:
  mapper-locations: classpath:latest/mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
spring:
  profiles: local
  datasource:
    url: jdbc:mysql://localhost/apollo?useSSL=false&useUnicode=yes&characterEncoding=utf-8&useLegacyDatetimeCode=false&serverTimezone=Asia/Seoul
    username: apolloxlab
    password: dkvhffh!
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      minimum-idle: 50
      maximum-pool-size: 50
```

- DataSourceConfig.java (not auto-config case)

```
@Configuration
public class AppConfig {
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource firstDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public SqlSessionFactory firstSqlSessionFactory(DataSource firstDataSource, ApplicationContext applicationContext)
            throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(firstDataSource);
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:mapper/**/*.xml"));
        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate firstSqlSessionTemplate(SqlSessionFactory firstSqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(firstSqlSessionFactory);
    }
}
```

## Exception ControllerAdvice

```
@ControllerAdvice
public class ExceptionHandler {
    @ExceptionHandler(SomeException.class)
    @ResponseBody
    public ResultModel<String> handleException(SomeException e, HttpServletRequest req, HttpServletResponse resp) {
        e.printStackTrace();
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        ResultModel<String> result = new ResultModel<Integer>(e.getCode(), "message");
        return result;
    }

    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(OtherException.class)
    public void handleConflict() { 
        // Nothing to do 
    }
}
```

## utf-8

```
@Bean
public HttpMessageConverter<String> responseBodyConverter() {
    return new StringHttpMessageConverter(Charset.forName("UTF-8"));
}

@Bean
public Filter characterEncodingFilter() {
    CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
    characterEncodingFilter.setEncoding("UTF-8");
    characterEncodingFilter.setForceEncoding(true);
    return characterEncodingFilter;
}
```

- properties

```
spring.http.encoding:
    force: true
    force-request: true
    force-response: true

server.tomcat.uri-encoding: UTF-8
```

- java -Dfile.encoding=UTF-8 -jar

## interceptor

```
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor()).addPathPatterns("/v1/**").excludePathPatterns("/v1/auths/**");
    }
}
```

## filter
FilterRegistrationBean
Filter @Component

## value
- http://www.baeldung.com/spring-value-annotation
- property
- https://stackoverflow.com/questions/3965446/how-to-read-system-environment-variable-in-spring-applicationcontext
- resources https://code.i-harness.com/ko/q/e5eba

## jackson
- http://www.baeldung.com/jackson-object-mapper-tutorial
- http://www.baeldung.com/jackson-custom-serialization

## EnableScheduling
- https://howtodoinjava.com/spring/spring-boot/enable-scheduling-scheduled-job-example/
- https://stackoverflow.com/questions/30431776/using-scheduled-and-enablescheduling-but-gives-nosuchbeandefinitionexception
- http://www.baeldung.com/spring-scheduled-tasks
- Application.java

```
@EnableScheduling
@SpringBootApplication
public class Application {
```

- CronService.java

```
@Service
public class CronService {
    // daily 11:22:00
    @Scheduled(cron = "0 10 22 * * *")
    public void closeJob() {
    }
    // monthly 1st 10:22:00
    @Scheduled(cron = "0 10 22 1 * *")
    public void closeJob() {
    }
}
```

## mail
- https://docs.spring.io/spring/docs/5.0.6.RELEASE/spring-framework-reference/integration.html#mail
- gmail google account alert
- https://www.google.com/settings/security/lesssecureapps
- aws inbound 587
- 제목 한글 깨짐 - utf-8 설정
- https://docs.spring.io/spring/docs/5.0.0.RELEASE/spring-framework-reference/integration.html#mail
- spring-boot-starter-mail
- application.yml

```
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: {account@gmail.com+
    password: {password}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

- Mailconfig.java (not auto-config case)

```
@Configuration
public class MailConfig {
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSender mailSender = new JavaMailSenderImpl();
        ((JavaMailSenderImpl) mailSender).setHost(host);
        ((JavaMailSenderImpl) mailSender).setPort(port);
        ((JavaMailSenderImpl) mailSender).setUsername(send);
        ((JavaMailSenderImpl) mailSender).setPassword(password);
        Properties props = ((JavaMailSenderImpl) mailSender).getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        return mailSender;
    }
}
```

- MailService.java

```
@Service
public class EmailService {
    private JavaMailSender mailSender;
    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    private void send() throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("from@email.com");
        helper.setTo("to@email.com");
        helper.setSubject("subject");
        helper.setText("text", true);
        mailSender.send(message);
    }
}
```

## static structure
- default static: /src/main/resources/static
- default template: /src/main/resources/template

## lombok
- install https://projectlombok.org/mavenrepo/
- 주의 http://kwonnam.pe.kr/wiki/java/lombok/pitfall

## swagger
- swagger https://springfox.github.io/springfox/docs/current/
- http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api
- pom.xml springfox-swagger2, springfox-swagger-ui, guava

```
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.7.0</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.2.2</version>
</dependency>
```

- SwaggerConfig.java

```
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select().apis(RequestHandlerSelectors.basePackage("com.package"))
                .paths(PathSelectors.any()).build();
    }
}
```

- WebMvcConfig.java
- /static 경로 resource 설정

```
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
    registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
}

```

- controller @ApiOperation#value(), @ApiOperation#notes(), @ApiParam#value(), @RequestParam#defaultValue(), @ApiImplicitParams#value()

```
@ApiOperation(value = "value doc", notes = "note doc<br/>"
        + "<br/>")
@RequestMapping(method = RequestMethod.GET, value = "/v1/url")
public ResultModel<List<Account>> getAccountListByUser(HttpServletRequest req) throws Exception {
    return value;
}
```

- model @ApiModelProperty
- auth header https://github.com/springfox/springfox/issues/1804

## ref
- spring-boot doc https://docs.spring.io/spring-boot/docs/current/reference/html/index.html
- transaction, dbroute
