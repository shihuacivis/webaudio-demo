# webaudio-demo

简单封装webaudio的demo，用audio标签向下兼容安卓微信浏览器

可用于简单的H5音效开发。

## api

### 预加载音效
```js
	audioEngine.init('res/count.mp3'); // 单文件
	audioEngine.init(['res/count.mp3', 'res/music.mp3']); // 多文件

```

### 播放背景音乐
一般一个应用只同时播放一个背景音乐
param： （音乐文件地址， 是否循环播放）
```js
	audioEngine.playMusic('res/music.mp3', true);
	audioEngine.stopMusic();

```

### 播放背景音乐
一般一个应用只同时播放一个背景音乐
param： （音乐文件地址， 是否循环播放）
```js
	audioEngine.playEffect('res/count.mp3', true);
	audioEngine.stopEffect('res/count.mp3');

```