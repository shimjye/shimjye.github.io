# Javascript 이미지 처리

<!--
description = 정리자료
tag = programming, design, javascript, java, image
-->

## 이미지 파일확인

### 자바

```
// Java Image 클래스에 넣어 확인
File file = new File("D:\\test.jpg");
ImageIcon ii = new ImageIcon( file.getPath() );
if(ii.getIconWidth() == -1&&ii.getIconHeight() == -1 ) {
	System.out.println("not valid.");
}
```

### 자바스크립트

- img 태그에 넣어 오류 확인

## 이미지 크기 - 자바스크립트

### 1

```
var img = document.getElementById('imageid');
var width = img.clientWidth;
var height = img.clientHeight;
```

### 2

```
var img = new Image();
img.onload = function() {
	alert(this.width + 'x' + this.height);
}
img.src = 'http://www.google.com/intl/en_ALL/images/logo.gif';
```

### 3

```
$("img").load(function() {
	alert($(this).height());
	alert($(this).width());
});
```

- 참고 http://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript

## javascript local preview

### 1

- 참고 http://www.nczonline.net/blog/2012/05/31/working-with-files-in-javascript-part-4-object-urls/

```
var URL = window.URL || window.webkitURL, imageUrl, image;
if (URL) {
	imageUrl = URL.createObjectURL(file);
	image = document.createElement("img");
	image.onload = function() {
		URL.revokeObjectURL(imageUrl);
	};
	image.src = imageUrl;
	document.body.appendChild(image);
}
```

### 2

- 참고 http://stackoverflow.com/questions/922057/is-it-possible-to-preview-local-images-before-uploading-them-via-a-form

```
function createObjectURL(object) {
	return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}
function revokeObjectURL(url) {
	return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
}
function myUploadOnChangeFunction() {
	if(this.files.length) {
		for(var i in this.files) {
			var src = createObjectURL(this.files[i]);
			var image = new Image();
			image.src = src;
		}
	}
}
```
