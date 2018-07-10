# Unity android 기초 소스코드

<!--
description = 조금 오래된 자료
tag = programming, unity, android
-->

## 유니티 싱글톤

- 게임을 중앙에서 관리하는 겍체가 필요. 싱글톤 사용. 개인적 사용소스

```
private static SaveData s_singleton = null;
public static SaveData Instance
{
	get
	{
		if (null == s_singleton)
		{
			GameObject obj = new GameObject();
			obj.name = "SaveData";
			obj.AddComponent<SaveData>();
			s_singleton = obj.GetComponent<SaveData>();
		}
		return s_singleton;
	}
}
void Awake()
{
	DontDestroyOnLoad( this);
}
```

## 유니티 안드로이드 콜

- 안드로이드 프로젝트와 유니티 프로젝트간 호출 개인적 사용소스

```
private static AndroidJavaObject jo
private static void initJo()
{
	if (jo == null )
	{
		Debug .Log("call object!!" );
		AndroidJavaClass jc = new AndroidJavaClass( "com.unity3d.player.UnityPlayer" );
		jo = jc.GetStatic<AndroidJavaObject>("currentActivity" );
	}
}
// unity 에서 안드로이드 호출
public static void CallEvent( string name)
{
	if (jo == null )
	{
		initJo();
		if (jo != null )
		{
			jo.Call(name);
		}
		else
		{
			Debug .Log("java object null!!" );
		}
	}
	else
	{
		jo.Call(name);
	}
}
// android 에서 unity 호출
void sendEventStatus( string eventStatus)
{
	Debug .Log("sendEventStatus !!!" );
	switch (eventStatus)
	{
		case "doSomething" :
			Debug .Log("Do Something !!!" );
		break ;
		default : break ;
	}
}
```

## 유니티 파일 저장 로드

- 피씨의 경우
    * C:\Users\shimjye\AppData\LocalLow\com_shimjye_android\SpaceWarTopGunU
- 안드로이드의 경우
    * Android/Data/패키지 경로에 저장

```
private readonly static object _lock = new object();
public static void initFilePath()
{
	filePath = Application.persistentDataPath + "/" + appName;
}
// when game has started
public static void loadGame()
{
	if (filePath == null )
	{
		initFilePath();
	}
	if (!File .Exists(filePath))
	{
		Debug.Log(filePath + " file empty..." );
		return;
	}
	lock (_lock)
	{
		try
		{
			StreamReader sr = new StreamReader(filePath);
			version = float.Parse(sr.ReadLine());
			isUsedVibe = bool.Parse(sr.ReadLine());
			isUsedMusic = bool.Parse(sr.ReadLine());
			isUsedSound = bool.Parse(sr.ReadLine());
			nick = sr.ReadLine();
			saveDate = DateTime.Parse(sr.ReadLine());
			sr.Close();
		}
		catch (IOException )
		{
			// load from backup
			StreamReader sr = new StreamReader(filePath + ".bak");
			version = float.Parse(sr.ReadLine());
			isUsedVibe = bool.Parse(sr.ReadLine());
			isUsedMusic = bool.Parse(sr.ReadLine());
			isUsedSound = bool.Parse(sr.ReadLine());
			nick = sr.ReadLine();
			saveDate = DateTime.Parse(sr.ReadLine());
			sr.Close();
			// save again
			StreamWriter fw = File .CreateText(filePath);
			fw.WriteLine(version);
			fw.WriteLine(isUsedVibe);
			fw.WriteLine(isUsedMusic);
			fw.WriteLine(isUsedSound);
			fw.WriteLine(nick);
			fw.WriteLine( DateTime.Now.ToString());
			fw.Close();
		}
	}
	Debug.Log(filePath + " file load... " + saveDate);
}
public static void saveGame()
{
	if (filePath == null )
	{
		initFilePath();
	}
	// backup
	if (File .Exists(filePath))
	{
		FileUtil.ReplaceFile(filePath, filePath + ".bak");
	}
	// save
	lock (_lock)
	{
		StreamWriter fw = File .CreateText(filePath);
		fw.WriteLine(version);
		fw.WriteLine(isUsedVibe);
		fw.WriteLine(isUsedMusic);
		fw.WriteLine(isUsedSound);
		fw.WriteLine(nick);
		fw.WriteLine( DateTime.Now.ToString());
		fw.Close();
	}
	Debug.Log(filePath + " file save..." );
	// read file for check
	loadGame();
}
```

## 유니티 안드로이드 종료처리

- 유니티에서는 동작없음. 안드로이드에서 종료처리.
- Application.Quit();

### 안드로이드에서 다른 앱으로 전환되는경우.

- 옵션화면으로 전환하여 pause 처리 했음.

```
void OnApplicationFocus( bool focusStatus)
{
	if (!focusStatus)
	{
		SaveData .onOption();
	}
}
```

### 유니티 게임 정지 처리

- time scale = 0
- Time.time 시간은 게임을 기준한 시간이 0에서부터 float 로 처리되며
- 정지시 처리가 필요한 내용은 Update 에서 처리
- FixedUpdate 는 시간에 따른 값을 계산해 주기때문에 pause시 정지

## unity json lib
- jsonUtility - unity 라이브러리
- lightjson (C# mit)
