<template>
  <div class="player" v-if="songLists.length">
    <div v-if="fullScreen" class="big">
      <!-- 头部 -->
      <div class="top">
        <span @click="changeScreen(false)"
          class="tosmall">
          ∨
        </span>
        {{currentSong.songname}}
      </div>
      <!-- 背景图 -->
      <div class="bgimg">
        <img :src="currentSong.albumUrl" alt="">
      </div>
      <!-- 歌手名 -->
      <p class="name">{{currentSong.singer[0].name}}</p>
      <!-- 专辑图片 -->
      <div class="img">
        <img :class="todist" :src="currentSong.albumUrl" alt="">
      </div>
      <!-- 歌词 -->
      <Lyric :seekTime='seekTime' :play="play"></Lyric>
      <!-- 进度条 -->
      <div class="progressbox">
        <Progress
        class="pg"
        :startTime='startTime'
        :endTime='endTime'
        @seek='seek'>
        </Progress>
      </div>

      <!-- 控制器 -->
      <div class="topcontroler">
        <div class="con-left">
          <!-- <button @click="changeLoopMode">{{modes[mode]}}</button> -->
          <span class="iconfont" @click="toggleMode()" ref="imode">&#xe620;</span>
        </div>
        <div class="con-left">
          <!-- 上一曲 -->
          <span class="iconfont" @click="prev">&#xe63a;</span>
        </div>
        <div class="con-center">
          <!-- 播放 -->
          <span class="iconfont" @click="togglePlay" ref="toggleplay">&#xe667;</span>
        </div>
        <div class="con-right">
          <!-- 下一曲 -->
          <span class="iconfont" @click="next">&#xe63b;</span>
        </div>
        <div class="con-right">
          <!-- 收藏 -->
          <span class="iconfont" ref="collecttion" @click="collect">&#xe6c8;</span>
        </div>
      </div>


      <!-- 播放器 -->
      <audio :src="currentSong.audioUrl"
        ref="audio"
        @canplay="canplay"
        @ended="ended"
        @timeupdate='timeupdate'>
      </audio>
    </div>
    <div
      v-else
      class="small"
      @click="changeScreen(true)">
      <!-- 专辑图片 -->
      <div class="icon">
        <div class="imgwrapper">
          <img :class="todist" :src="currentSong.albumUrl" alt="">
        </div>
      </div>
      <!-- 歌名和歌手名 -->
      <div class="text">
        <h2 class="songname">{{currentSong.songname}}</h2>
        <p class="singername">{{currentSong.singer[0].name}}</p>
      </div>
      <!-- 控制器 -->
      <div class="controler">
        <span class="iconfont" @click="togglePlay" ref="toggleplay">&#xe667;</span>
      </div>
      <div class="controler">
        <span class="iconfont" >&#xe636;</span>
      </div>

    </div>
  </div>
</template>
<script>
import Progress from 'components/Progress'
import Lyric from 'components/Lyric'
import {mapState, mapMutations,mapGetters} from 'vuex'
export default {
  components:{Progress,Lyric},
  data () {
    return {
      play:false,
      modes:["&#xe620;","&#xe620;","&#xe67b;","&#xe622;"],
      startTime: 0,
      endTime: 0,
      seekTime:0,
      collectState:false
    }
  },
  computed: {
    ...mapState(['songLists','fullScreen','mode']),
    ...mapGetters(['currentSong']),
    todist(){
      return this.play?'dist':'dist paused'
    }
  },
  methods: {
    ...mapMutations(['changeScreen','prevCurrentIndex','nextCurrentIndex','changeCurrentIndex','changeLoopMode','collectSong']),
    togglePlay(){
      this.play = !this.play
      let toggleplay = this.$refs.toggleplay
      this.play?toggleplay.innerHTML="&#xe667;":toggleplay.innerHTML="&#xe723;"
    },
    canplay(){  // audio标签自带的属性
      // 歌曲可以播放
      this.audio = this.$refs.audio
      console.log('可以播放了')
      this.audio.play()
      this.play = true
      // 打印查看this.audio原型下的数据
      // console.log(this.audio.__proto__)
      // duration为播放歌曲的总时长 s为单位
      // console.log(this.audio.duration)
      // 获取歌曲的总时长
      this.endTime = this.audio.duration
    },
    toggleMode(){
      this.changeLoopMode();
      console.log(this.mode)
      let imode = this.$refs.imode
      if(this.mode===1){
        imode.innerHTML = this.modes[1]
      }else if(this.mode===2){
        imode.innerHTML = this.modes[2]
      }else if(this.mode===3){
        imode.innerHTML = this.modes[3]
      }
    },
    ended(){
      console.log('播放完毕')
      this.play = false
      switch (this.mode) {
        case 1:
          // 单曲循环
          this.play = true
          this.audio.play()
          break;
        case 2:
          // 列表循环  相当于下一曲
          this.nextCurrentIndex()
          break;
        case 3:
          // 随机播放
          let count = this.songLists.length
          let index = parseInt(Math.random()*count)
          console.log('随机数：',index)
          this.changeCurrentIndex(index)
          break;
        default:
          break;
      }
    },
    prev(){
      this.prevCurrentIndex()
    },
    next(){
      this.nextCurrentIndex()
    },
    collect(){
      this.collectState = !this.collectState
      // console.log(this.collectState)
      let collecttion = this.$refs.collecttion
      this.collectState?collecttion.innerHTML="&#xe6bb;":collecttion.innerHTML="&#xe6c8;"

    },
    timeupdate(e){
      // 打印播放歌曲当前的时间
      let {currentTime} = e.target
      // console.log('播放歌曲的当前时间：',currentTime)
      // 随着歌曲的播放更新播放歌曲的当前时间
      this.startTime = e.target.currentTime
    },
    seek(s){
      // 父组件的方法
      if(!this.audio){return false}
      // 更改播放的时间
      this.audio.currentTime = s
      // 更改歌词的时间
      this.seekTime = s
    }
  },
  watch: {
    play(newValue,oldValue){
      if(!this.audio){return false}
      if(newValue){
        // 播放功能  play表示播放歌曲
        this.audio.play()
      }else{
        // 播放功能  pause表示暂停播放歌曲
        this.audio.pause()
      }
    },
    currentSong(newValue,oldValue){
      console.log('歌曲发生改变')
      // if(!this.audio){return false}
      // 歌曲发生改变 应该自动播放
      // 设定延时  为了解决ios 的自动播放bug问题
      setTimeout(()=>{
        console.log(this.$refs.audio)
        this.$refs.audio.play()
      },500)
    }
  }
}
/*
1.处理数据
2.显示数据渲染界面 name 歌手 专辑图片
3.专辑图片能转动
4.显示歌词
5.控制器  前一曲 后一曲 循环模式 播放 收藏
  循环模式
    单曲循环  播完之后再来一遍
    列表训话  播完之后播下一首
    随机循环  播完之后随机播放下一首
6.进度条
  a.随着时间动
  b.可以点击控制歌曲的播放
  c.可以拖动控制歌曲的播放
*/
</script>

<style lang="less" scoped>
@import '~style/index.less';
.player{
  color: #fff;
  .big{
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    background: #222;
    .top{
      padding-top: 4px;
      font-size: @fs-xl;
      text-align: center;
      .tosmall{
        font-size: 30px;
        position: fixed;
        left: 10px;
        top: -2px;
      }
    }
    .name{
      font-size: @fs-s;
      text-align: center;
      padding: 10px;
    }
    .bgimg{
      position: absolute;
      z-index: -9;
      top: 0px;
      width: 100%;
      height: 100%;
      filter: blur(12px);  // 模糊化
      img{
        width: 100%;
        height: 100%;
      }
    }
    .img{
      .w(375);
      padding: 20px;
      text-align: center;
      box-sizing: border-box;
      img{
        width: 85%;
        border-radius: 50%;
        border: 10px solid #ccc;
      }
      // 1.class="dist"  专辑图片转动
      // 2.class="dist paused"  专辑图片暂停转动
      & .dist{
        animation: rotate 10s linear infinite;
      }
      & .paused{
        animation-play-state: paused;
      }
    }
    .progressbox{
      .w(375);
      height: 30;
      display: flex;
      text-align: center;
      // background: pink;
      position: absolute;
      bottom: 102px;
      .pg{
        margin: 0 auto;
      }
    }
    .topcontroler{
      .w(375);
      height: 40px;
      display: flex;
      vertical-align: baseline;
      position: absolute;
      bottom: 68px;
      .con-left{
        width: 67px;
        height: 30px;
        text-align: right;
      }
      .con-center{
        width: 107px;
        height: 30px;
        font-size: 66px;
        line-height: 30px;
        text-align: center;
      }
      .con-right{
        width: 67px;
        height: 30px;
        text-align: left;
      }
      .iconfont{
        color: @fontcolors;
        font-size: 34px;
        line-height: 40px;
      }
    }
  }
  .small{
    .w(375);
    position: fixed;
    left: 0;
    bottom: 0px;
    height: 60px;
    background: #333;
    display: flex;
    align-items: center;
    vertical-align: baseline;
    .icon{
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0px 10px 0px 20px;
      .imgwrapper{
        width: 70px;
        height: 40px;
        // padding: 0px 10px 0px 20px;
        img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      }
    }
    .text{
      width: 205px;
      height: 42px;
      h2{
        width: 205px;
        height: 20px;
        color: #ffffff;
        font-size: 14px;
        margin: 0px 0px 2px;
      }
      p{
        width: 205px;
        height: 20px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
      }
    }
    .controler{
      width: 50px;
      height: 35px;
      padding: 0px 10px;
      display: flex;
      span{
        width: 32px;
        height: 32px;
        color: @fontcolors;
        font-size: 34px;
      }
    }
  }
  // 过渡+帧动画
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
