var currentIndex = 0
var clock
var audio = new Audio
var musicList = []
audio.autoplay = true

//DOM查询
function $(selector){
  return document.querySelector(selector)
}

//歌曲信息序列化
getMusicList(function(list){
  musicList = list
  setPlaylist(list)
  loadMusic(list[currentIndex])
})

//时间显示
audio.onplay = function(){
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime%60) + ''
    sec = sec.length === 2? sec : '0' + sec
    $('.musicbox .time').innerText = min + ':' + sec
  }, 1000)
}
audio.onpause = function(){
  clearInterval(clock)
}
audio.onended = function(){
  currentIndex = (++currentIndex)%musicList.length
  loadMusic(musicList[currentIndex])
}

//进度条显示
audio.ontimeupdate = function(){
  $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
}



// 用AJAX获取歌曲的信息
function getMusicList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', './music.json', true)
  xhr.onload = function(){
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      callback(JSON.parse(this.responseText))
    }else {
      console.log('获取数据失败')
    }
  }
  xhr.onerror = function(){
    console.log('网络异常')
  }
  xhr.send()
}

//歌曲信息展示，更改对应背景图片
function loadMusic(musicObj){
  audio.src = musicObj.src
  $('.musicbox .title').innerText = musicObj.title
  $('.musicbox .auther').innerText = musicObj.auther
  $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
  for(var i = 0; i < $('.musicbox .list').children.length; i++){
    $('.musicbox .list').children[i].classList.remove('playing')
  }
  $('.musicbox .list').children[currentIndex].classList.add('playing')
}

//歌曲列表点击事件
$('.musicbox .list').onclick = function(e){
  if(e.target.tagName.toLowerCase() === 'li'){
    for(var i = 0; i < this.children.length; i++){
      if (this.children[i] === e.target){
        currentIndex = i
      }
    }
    loadMusic(musicList[currentIndex])
  }
}

//添加歌曲列表
function setPlaylist(musiclist){
  var container = document.createDocumentFragment()
  musicList.forEach(function(musicObj){
    var node = document.createElement('li')
    node.innerText = musicObj.auther + '-' + musicObj.title
    container.appendChild(node)
  })
  $('.musicbox .list').appendChild(container)
}

//暂停、播放键事件
$('.musicbox .play').onclick = function(){
  if (audio.paused){
    audio.play()
    this.querySelector('.fa').classList.remove('fa-play')
    this.querySelector('.fa').classList.add('fa-pause')
  }else {
    audio.pause()
    this.querySelector('.fa').classList.remove('fa-pause')
    this.querySelector('.fa').classList.add('fa-play')  }
}

//点击下一曲事件
$('.musicbox .forward').onclick = function(){
  currentIndex = (++currentIndex)%musicList.length
  loadMusic(musicList[currentIndex])
  console.log(currentIndex)
}
//点击上一曲事件
$('.musicbox .back').onclick = function(){
  currentIndex = (musicList.length + --currentIndex)%musicList.length
  loadMusic(musicList[currentIndex])
  console.log(currentIndex)
}

//点击进度条播放事件
$('.musicbox .bar').onclick = function(e){
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  audio.currentTime = audio.duration * percent
}