<template>
  <div class="progress">
    <span>{{startTime|handleTime}}</span>
    <div class="wrapper" @click="clickProgress" ref="wrapper">
      <div class="content" ref="content"></div>
      <div class="dotwrapper"
        ref="dotwrapper"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        >
        <div class="dot">
        </div>
      </div>
    </div>
    <span>{{endTime|handleTime}}</span>
  </div>
</template>
<script>
export default{
  methods:{
    jump(percent){
      // time得出的是一个百分比数,需要在结果后面/100
      let time = percent*this.endTime/100
      // console.log('快进时间：',time+'s')
      // 调用父组件的方法
      this.$emit("seek",time)
    },
    // 点击进度条事件
    clickProgress(e){
       // x为点击的所在点的x轴方向到浏览器最左边的距离
       let x = e.pageX
       // 获取元素wrapper到浏览器左边的距离
       let left = this.$refs.wrapper.getBoundingClientRect().left
       // distance为去除left后点击所在点到wrapper元素的左端的距离
       let distance = x - left
       // console.log('点击进度条的x坐标：',distance)
       this.offsetMove(distance)
    },
    offsetMove(distance){
      // 进度条移动的距离
      // 计算出移动的距离占元素总长度的百分比
      let percent = (distance/this.$refs.wrapper.clientWidth)*100
      // 控制进度条的长度(width)的变化
      this.$refs.content.style.width = percent + "%"
      // 小圆点的移动
      this.$refs.dotwrapper.style.transform = `translateX(${distance}px)`
      // 控制歌曲时间
      // 如果是按下状态,进度条不受歌曲播放控制
      if(this.touch){return false}
      this.jump(percent)
    },
    // 移动进度条事件
    touchStart(e){
      // console.log('按下')
      this.touch = true
      this.distance = 0
    },
    touchMove(e){
      // console.log('移动',e.touches[0])
      // 解构出e.touches[0]的pageX的距离
      let {pageX} = e.touches[0]
      // console.log('pageX:',pageX)
      // 获取元素wrapper到浏览器左边的距离
      let left = this.$refs.wrapper.getBoundingClientRect().left
      let width = this.$refs.wrapper.clientWidth
      this.distance = pageX - left
      // console.log('移动的距离为：',this.distance)
      // 边界判断
      if(this.distance>=0 && this.distance<=width){
        this.offsetMove(this.distance)
        // 随着进度条的拖动startTime的时间显示也跟着变化
        let percent = (this.distance/this.$refs.wrapper.clientWidth)*100
        let time = percent*this.endTime/100
        console.log('time:',time)
        this.startTime = time
      }
    },
    touchEnd(e){
      // console.log('抬起')
      this.touch = false
      this.offsetMove(this.distance)
    }
  },
  props:{
    startTime:{type:Number,default:0},  // eslint中 default:()=>{return 0}
    endTime:{type:Number,default:0}
  },
  filters:{
    handleTime(data){
      let time = parseInt(data)
      let min = parseInt(time/60)
      let s = time%60
      // 保证秒数为两位数
      s = s<=9?`0${s}`:s
      return min+":"+s
    }
  },
  watch:{
    startTime(newValue,oldValue){
      // 如果是按下状态,进度条不受歌曲播放控制
      if(this.touch){return false}
      // 当前播放时间所在歌曲总时长的百分比
      let percent = (this.startTime/this.endTime)*100
      // console.log(percent)
      // 控制进度条的长度(width)的变化
      this.$refs.content.style.width = percent + "%"
      // 控制小圆点
      // width为歌曲当前时间对应的长度
      let width = this.$refs.wrapper.clientWidth*percent/100
      this.$refs.dotwrapper.style.transform = `translateX(${width}px)`
    }
  }
}
/*
1. 显示开始/结束时间
2. 时间随着歌曲的播放改变
3. 进度条改变
4. 进度条可以点击控制歌曲
  a.能点
  b.圆点移动到点击位置
  c.进度条移动到点击位置
  d.歌曲跳到规定时间
5. dot可以拖动控制歌曲
  a.拖动
    按下事件 记录按下的位置
    移动事件
    抬起事件
  b.圆点跟随手指移动
  c.进度条跟随手指移动
  d.歌曲跳到规定时间 手指抬起的时候快进
*/
</script>
<style lang="less" scoped>
@import '~style/index.less';
.progress{
  .w(270);
  height: 30px;
  display: flex;
  font-size: @fs-xs;
  align-items: center;
  justify-content: center;
  span{
    display: inline-block;
    width: 30px;
    // color: @fontcolors;
  }
  .wrapper{
    .w(270);
    height: 4px;
    margin: 0px 10px;
    background: rgba(0,0,0,0.3);
    position: relative;
    .content{
      height: 4px;
      width: 2%;
      background: @fontcolors;
    }
    .dotwrapper{
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #F0F0F0;
      position: absolute;
      top: -6px;
      left: -1px;
      // transform: translateX(-16px);
      .dot{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: @fontcolors;
        position: absolute;
        top: 2px;
        left: 2px;
      }
    }
  }
}
</style>
