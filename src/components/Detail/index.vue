<template>
  <div class="detail">
    <!-- 头部导航 -->
    <div class="top">
      <span @click="back" class="back">＜</span>
      <span>{{name}}</span>
    </div>
    <!-- 头像 -->
    <div class="avator"
      :style="{'background-image':`url(${avator})`}"
      ref="img">
      <div class="mask"></div>

    </div>
    <!-- 歌曲列表 -->
    <div class="songlist" ref="wrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in list"
            :key="index"
            @click="openPlayer(index)">
            <h2>{{item.songname}}</h2>
            <p>{{name}}·{{item.albumname}}</p>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
import BS from 'better-scroll'
import {getSongByMid,getSongUrlByMid} from 'api/api.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  data(){
    return{
      list:[],  // 处理过后的list:{albummid,albumname,singer,songmid,songname}
      name:"暂无数据",
      avator:''
    }
  },
  methods: {
    ...mapMutations(['addSongList','changeCurrentIndex','changeScreen']),
    back(){
      this.$router.go(-1)
    },
    openPlayer(index){
      // 点击歌的li 显示播放器
      this.addSongList(this.list)
      // 确定点击的是哪首歌
      this.changeCurrentIndex(index)
      // 点击后屏幕切换到大屏
      this.changeScreen(true)
    },
    initBs(){
      // 获取图片的元素和高度
      let img = this.$refs.img
      let imgH = img.clientHeight

      let wrapper = this.$refs.wrapper
      this.bs = new BS(wrapper,{probeType:3,click:true})
      this.bs.on('scroll',({y})=>{
        // console.log('移动',y)
        if(y>=0){
          // 滚动向下拉动
          // 缩放比例
          let percent = 1 + (y/(imgH))
          img.style.transform = `scale(${percent})`
          // img.style.zIndex = 1
        }else{
          // 滚动向上拉动
          // 1.没有到达顶部 滚动层的层级高
          // 2.到达顶部的时候 图片的层级高
          if(Math.abs(y)>=imgH-70){
            // console.log('到达顶部了')
            img.style.zIndex = 1
            img.style.paddingTop = '0%'
            img.style.height = '40px'
          }else{
            img.style.zIndex = -1
            img.style.paddingTop = '70%'
            img.style.height = 0
          }
        }
      })
    },
    handleList(list){
      let result = [];
      let mids = [];
      result = list.map((item,index)=>{
        let {albummid,albumname,singer,songmid,songname} = item.musicData
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
        mids.push(songmid)
        return {albummid,albumname,singer,songmid,songname,albumUrl}
      })
      return {result,mids}
    }
  },
  async created () {  // 用async修饰create生命周期函数，就可以在里面使用await同步函数
    console.log('路由数据：',this.$route);
    let {singermid} = this.$route.params
    // 根据歌手mid发起请求获取数据
    let data = await getSongByMid(singermid)
    let {result,mids} = this.handleList(data.data.list)
    // 获取url数据 通过mids 歌曲的媒体id 换成音乐地址 之后将数据进行合并
    let {urls} = await getSongUrlByMid(mids)
    let finalData = []
    for (let index = 0; index < result.length; index++) {
      // 将urls的地址拼接到result中去
      result[index].audioUrl = urls[index]
      if(urls[index]){
        // 将不能播放的歌曲去除,筛选出可以播放的歌曲
        finalData.push(result[index])
      }
    }
    // console.log(result,urls)
    console.log('添加了audioUrl的最终能播放的数据：',finalData)
    this.list = finalData
    this.name = data.data.singer_name
    this.avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg?max_age=2592000`
    this.$nextTick(() => {
      this.initBs();
    })

    // getSongByMid(singermid)
    // .then((data)=>{
    //   // console.log('data.data.list的数据：',data.data.list)
    //   let {result,mids} = this.handleList(data.data.list)
    //   console.log('result:',result)
    //   console.log('mids:',mids)
    //   getSongUrlByMid(mids).then((data)=>{
    //     console.log(data)
    //   })
    //   this.list = result
    //   console.log('处理后的歌曲list:',this.list)
    //   this.name = data.data.singer_name;
    //   this.avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg?max_age=2592000`
    //   this.$nextTick(() => {
    //     this.initBs();
    //   })
    // })
  },
  // 直接修改动态路由导航时不会引起组件的重新创建,因为组件是复用的。如果需要做进一步处理，需要做组件内的守卫处理
  // 动态路由  组件内的守卫  如果没有组件内的守卫的需求,这一步可以不做处理
  /* async beforeRouteUpdate(to,from,next) {
    console.log('组件复用更新的时候执行')
    console.log(to)
    let {singermid} = to.params
    // 根据歌手mid发起请求获取数据
    let data = await getSongByMid(singermid)
    let {result,mids} = this.handleList(data.data.list)
    // 获取url数据 通过mids 歌曲的媒体id 换成音乐地址 之后将数据进行合并
    let {urls} = await getSongUrlByMid(mids)
    let finalData = []
    for (let index = 0; index < result.length; index++) {
      // 将urls的地址拼接到result中去
      result[index].audioUrl = urls[index]
      if(urls[index]){
        // 将不能播放的歌曲去除,筛选出可以播放的歌曲
        finalData.push(result[index])
      }
    }
    // console.log(result,urls)
    console.log('添加了audioUrl的最终能播放的数据：',finalData)
    this.list = finalData
    this.name = data.data.singer_name
    this.avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg?max_age=2592000`
    this.$nextTick(() => {
      this.initBs();
    })
    next();
  }*/
}
/*
1.显示歌手名
2.显示歌手图片
3.显示歌单
4.返回
5.下拉头像放大
6.上拉遮住头像
7.随机播放
8.点击跳转到播放器页面
*/
</script>
<style lang="less" scoped>
@import '../../style/index.less';
.top{
  .w(375);
}
.detail{
  position: fixed;
  top: 0px;
  bottom: 0px;
  background: red;
  left: 0px;
  right: 0px;
  background: #222222;
  // 头部
  .top{
    height: 40px;
    color: #ffffff;
    position: absolute;
    top: 0;
    z-index: 3;
    text-align: center;
    .back{
      position: fixed;
      left: 0px;
    }
    // span{
    //   // padding-left: 100px;
    //   text-align: center;
    // }
  }
  // 头像
  .avator{
    .w(375);
    padding-top:70%;
    background-size: cover;   // 平铺
    position: absolute;
    top: 0px;
    z-index: -1;
    .mask{
      background: rgba(7, 17, 27, 0.3);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0
    }
  }
  // 歌曲列表
  .songlist{
    position: fixed;
    background: #222222;
    top: 240px;
    bottom: 0px;
    left: 0;
    right: 0;
    .content{
      padding: 20px 30px;
      background: #222222;
      li{
        font-size: @fs-s;
        color: #fff;
        height: 61px;
        h2{
          height: 20px;;
        }
        p{
          margin: 10px 0 0;
          height: 20px;
          color: rgba(225,225,225,0.3);
        }
      }
    }
  }
}
</style>
