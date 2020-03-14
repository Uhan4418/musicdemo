<template>
  <div class="lyric">
    {{lyrictxt}}
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getLyricByMid} from 'api/api.js'
import {Base64} from 'js-base64'
import Lyric from 'lyric-parser'
export default {
  data(){
    return {
      lyrictxt:'歌词加载中...'
    }
  },
  props:['play','seekTime'],
  computed:{
    ...mapGetters(['currentSong'])
  },
  methods:{
    getLyric(songmid,from){
      getLyricByMid(songmid).then((res)=>{
        // 解析歌词
        let lyricdecode = Base64.decode(res.lyric)
        // 如果之前有播放对象 需要将播放停掉
        if(this.lyricObj){
          this.lyricObj.stop()
        }
        // console.log(lyricdecode)
        // let txt = data.txt
        this.lyricObj = new Lyric(lyricdecode,({txt})=>{
          console.log(txt)
          this.lyrictxt = txt
        })
        // 解析完毕直接播放
        console.log(from)
        this.lyricObj.play()
      })
    }
  },
  watch:{
    currentSong(newSong,oldSong){
      let {songmid} = newSong
      this.getLyric(songmid,1)
    },
    play(newPlay,oldPlay){
      if(!this.lyricObj){return false}
      console.log('歌词播放状态',newPlay)
      this.lyricObj.togglePlay()
    },
    seekTime(newTime,oldTime){
      // 发生改变说明 歌曲快进,歌词也要快进
      if(!this.lyricObj) return false
      this.lyricObj.seek(newTime*1000)
    }
  },
  mounted() {
    // 歌词组件挂载 第一次播放歌曲
    let {songmid} = this.currentSong
    this.getLyric(songmid,0)
  }
}
/*
1. 通过网络请求获取歌词 base64 lyric
2. 播放  play
    a.第一次进入播放器组件
    b.切歌
    c.手动停止后又开启
3. 停止  stop  togglePlay
4. 跳转  seek
*/
</script>

<style lang="less" scoped>
@import '~style/index.less';
.lyric{
  .w(375);
  height: 20px;
  font-size: @fs-s;
  text-align: center;
}
</style>
