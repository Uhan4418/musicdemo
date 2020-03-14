<template>
  <div class="rank">
    <!-- 列表滚动区 -->
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="box">
          <ul>
            <li class="lItem" v-for="(item,index) in toprankData" :key="index">
              <div class="left">
                <!-- 图片懒加载 -->
                <img width="100" height="100" v-lazy="item.picUrl" alt="">
              </div>
              <ul class="right">
                <li v-for="(sItem,sIndex) in item.songList" :key="sIndex">
                  <span>{{sIndex+1}}</span>
                  <span>{{`${sItem.songname}-${sItem.singername}`}}</span>
                </li>
              </ul>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTopRank } from "../../api/api";
import BS from "better-scroll";
import {Indicator} from 'mint-ui';
export default {
  name: "rank", // 用于缓存
  data() {
    return {
      toprankData: []
    };
  },
  methods: {
    initBs() {
      let wrapper = this.$refs.wrapper; // 建议使用绑定的dom元素，避免类名重名
      this.bs = new BS(wrapper, {
        // 开启下拉刷新
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        // 开启上拉加载
        pullUpLoad: {
          threshold: 50
        }
      });
      // 监听下拉刷新
      this.bs.on("pullingDown", () => {
        console.log("下拉刷新");
        Indicator.open({
          spinnerType: "fading-circle"
        });
        getTopRank().then(res => {
          this.toprankData = res.data.topList;
          // 告知better-scroll本次下拉刷新数据加载完毕
          this.bs.finishPullDown();
          Indicator.close();
        });
      });
      // 监听上拉加载
      this.bs.on("pullingUp", () => {
        console.log("上拉加载");
        getTopRank().then(res => {
          this.toprankData = res.data.topList;
          // 告知better-scroll本次上拉加载数据完毕
          this.bs.finishPullUp();
        });
      });
    }
  },
  mounted() {
    getTopRank().then(res => {
      console.log("topRankData:", res.data.topList);
      this.toprankData = res.data.topList;
    });
    this.initBs();
  }
};
</script>

<style lang="less" scoped>
@import "../../style/index.less";
.wrapper {
  position: fixed;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  margin: 0 20px;
  padding-top: 20px;
  padding: 20px 0px 0px;
  .constant {
    .w(375);
  }
}

.lItem{
  width: 325px;
  height: 100px;
  margin: 0px 20px;
  padding-top: 20px;
  display: flex;
  .left{
    width: 100px;
    height: 100px;
  }
  .right{
    flex: 1;
    width: 235px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: @fs-xs;
    padding: 0px 20px;
    color: hsla(0,0%,100%,0.3);
    pointer-events: auto;
    // vertical-align: baseline;
    li{
      line-height: 26px;
      overflow: hidden;
      white-space: nowrap;
      span{
       line-height: 26px;
      }
    }
  }
}

</style>