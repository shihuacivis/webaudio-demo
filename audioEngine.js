/* =============================================
 * v20160106
 * =============================================
 * Copyright 石华
 *
 * webaudio-demo
 * ============================================= */

(function(e) {
  var audioEngine = {};
  audioEngine['_context'] = '';
  audioEngine['oBuffer'] = {};  // 存放webaudio的buffer
  audioEngine['oAudio'] = {};   // 存放audio标签用于支持安卓微信
  audioEngine['oNode'] = {};    // 存放webaudio结点
  audioEngine['bgm'] = '';      // 当前背景音乐地址
  var bSWA = false;             // 是否支持webaudio
  if (window.AudioContext || window.webkitAudioContext || window.mozAudioContext) {
    audioEngine['_context'] = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
    bSWA = true;
  }

  audioEngine.loadAudio = function(url, bPlay, bLoop) {
    if (!/\.(mp3|wav|ogg)$/.test(url)) {
      console.error('error type of media, only support mp3|wav|ogg files');
      return;
    }
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      audioEngine['_context']['decodeAudioData'](request.response, function(buffer) {
        audioEngine['oBuffer'][url] = buffer;
        bPlay && audioEngine._play(url, bLoop);
      });
    };
    request.send();
  }

  audioEngine.init = function(aList) {
    if (typeof aList == 'undefined' || (!(aList instanceof Array) && !(typeof aList == 'string'))) {
      return;
    }
    if (!(aList instanceof Array) && typeof aList == 'string') {
      aList = [aList];
    }
    for (var i = 0; i < aList.length; i++) {
      var url = aList[i];
      audioEngine.loadAudio(url);
    }
  }

  audioEngine.playMusic = function(url, bLoop) {
    if (!bSWA) {
      audioEngine._playMusicByTag(url, bLoop);
      return;
    }
    if (typeof audioEngine['oBuffer'][url] == 'undefined') {
      if (audioEngine['bgm'] != '') {
        audioEngine.stopMusic();
      }
      audioEngine.loadAudio(url, true, bLoop);
      audioEngine['bgm'] = url;
    } else {
      if (audioEngine['bgm'] == url) {
        return;
      } else if (audioEngine['bgm'] != '') {
        audioEngine.stopMusic();
      } else if (audioEngine['bgm'] == '') {
        audioEngine._play(url, bLoop);
        audioEngine['bgm'] = url;
      } 
    }
  }

  audioEngine.playEffect = function(url, bLoop) {
    if (!bSWA) {
      audioEngine._playEffectByTag(url, bLoop);
      return;
    }
    if (typeof audioEngine['oBuffer'][url] == 'undefined') {
      audioEngine.loadAudio(url, true, bLoop);
    } else {
      audioEngine._play(url, bLoop);
    }
  }

  audioEngine._playMusicByTag = function(url, bLoop) {
    audioEngine['oAudio']['bgm'] = audioEngine['oAudio']['bgm'] || new Audio();
    audioEngine['oAudio']['bgm'].src = url;
    audioEngine['oAudio']['bgm'].loop = bLoop || false;
    audioEngine['oAudio']['bgm'].play();
  }

  audioEngine._playEffectByTag = function(url, bLoop) {
    audioEngine['oAudio'][url] = audioEngine['oAudio'][url] || new Audio();
    audioEngine['oAudio'][url].src = url;
    audioEngine['oAudio'][url].play();
  }

  audioEngine._stopMusicByTag = function() {
    audioEngine['oAudio']['bgm'].stop();
  }

  audioEngine._stopEffectByTag = function(url) {
    audioEngine['oAudio'][url].stop();
  }

  audioEngine.stopMusic = function() {
    if (!bSWA) {
      audioEngine._stopMusicByTag();
      return;
    }
    var url = audioEngine['bgm'];
        console.log(url)
    if (url == '') {
      return;
    }

    audioEngine['oNode'][url].stop && audioEngine['oNode'][url].stop();
  }

  audioEngine.stopEffect = function(url) {
    if (!bSWA) {
      audioEngine._stopEffectByTag(url);
      return;
    }
    if (url == '' || typeof audioEngine['oNode'][url] == 'undefined' || typeof audioEngine['oNode'][url].stop == 'undefined') {
      return;
    }
    audioEngine['oNode'][url].stop();
  }

  audioEngine._play = function(url, bLoop) {
    //支持webaudio
    var _buffer = audioEngine['oBuffer'][url];
    var destination = audioEngine['_context'].destination;
    var audio = audioEngine['_context'].createBufferSource();
    audio.buffer = _buffer;
    audio.connect(destination);
    audio.loop = bLoop || false;
    audioEngine['oNode'][url] = audio;
    if (audio.start) {
      audio.start(0, 0);
    } else if (audio['noteGrainOn']) {
      var duration = audio.buffer.duration;
      audio['noteGrainOn'](0, 0, duration);
    } else {
      audio['noteOn'](0);
    }
  }
  window.audioEngine = audioEngine;
})(this);