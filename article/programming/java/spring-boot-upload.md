# spring-boot-upload

<!--
description = 정리자료
tag = programming, java, spring, boot, upload
-->

## upload-image

### spring-boot multipart
- application.yml
```
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

### process
- multipart file-upload - save-file - resize - s3-upload - db-insert - clean
- 업로드 파일저장, jpg: jpg 저장, bmp, gif, png: png 저장
- image type https://stackoverflow.com/questions/11447035/java-get-image-extension-type-using-bufferedimage-from-url
- MultipartFile image type file.getContentType(), MIME_IMAGE_PNG="image/png"
- spring boot 2.0 setting
  - spring.servlet.multipart.max-file-size: 10MB
  - spring.servlet.multipart.max-request-size: 100MB
- image (seq, insert_date, update_date, insert_user, update_user, use_yn, domain, s3_bucket, s3_key, s3_file, origin_file_name, image_type, type_code, size, width, height)

### aws-s3
- s3에 업로드 하여 static website hosting
- CloudFront 기능 사용 별도

### aws-s3-upload
- s3 doc https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/dev/Welcome.html
- s3 java doc https://docs.aws.amazon.com/ko_kr/sdk-for-java/v1/developer-guide/getting-started.html
- aws s3 security credentials
  - iam: add user
  - programmatic access
  - Attach existing policies directly - AmazonS3FullAccess
  - get access-key, secret-key
- java source example http://www.baeldung.com/aws-s3-java
- public file upload
  - putObjectRequest.setCannedAcl(CannedAccessControlList.PublicRead);
