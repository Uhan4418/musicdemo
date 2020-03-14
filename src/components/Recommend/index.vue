<template>
  <div class="recommend">
    <!-- 列表滚动区 -->
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <banner></banner>
        <div class="tip">热门歌单推荐</div>
        <ul class="list">
          <li v-for="(item,index) in recommendDate" :key="index">
            <div class="left">
              <!-- <img :src="item.imgurl" alt=""> -->
              <!-- 图片懒加载 -->
              <img v-lazy="item.imgurl" alt="">

            </div>
            <div class="right">
              <p class="songname">{{item.creator.name}}</p>
              <p class="album">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import Banner from '../Banner'
  import {
    getRecommendData
  } from '../../api/api'
  import BS from 'better-scroll'
  import {Indicator} from 'mint-ui';
  export default {
    name: "recommend", // 用于缓存
    components: {
      Banner
    },
    data() {
      return {
        recommendDate: [],
      }
    },
    methods: {
      initBs() {
        let wrapper = this.$refs.wrapper // 建议使用绑定的dom元素，避免类名重名
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
        })
        // 监听下拉刷新
        this.bs.on('pullingDown', () => {
          console.log('下拉刷新')
          Indicator.open({
            spinnerType: 'fading-circle'
          })
          getRecommendData().then((res) => {
            this.recommendDate = res.data.list
            // 告知better-scroll本次下拉刷新数据加载完毕
            this.bs.finishPullDown()
            Indicator.close()
          })
        })
        // 监听上拉加载
        this.bs.on('pullingUp', () => {
          console.log('上拉加载')
          getRecommendData().then((res) => {
            this.recommendDate = res.data.list
            // 告知better-scroll本次上拉加载数据完毕
            this.bs.finishPullUp()
          })
        })
      }
    },
    mounted() {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      getRecommendData().then((res) => {
        this.recommendDate = res.data.list
        Indicator.close();
      })
      this.initBs()
    },
    activated() {
      console.log('推荐组件缓存激活')
    },
    deactivated() {
      console.log('推荐组件缓存失活')
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/index.less';

  .recommend {
    .wrapper {
      position: fixed;
      top: 88px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;

      .content {
        .w(375);

        .tip {
          .w(375);
          height: 65px;
          text-align: center;
          line-height: 65px;
          color: @fontcolors;
          font-size: @fs-s;
        }

        .list {
          li {
            .w(375);
            height: 82px;
            box-sizing: border-box;
            padding: 0px 20px 20px 20px;
            display: flex;

            .left {
              width: 82px;
              height: 62px;
              padding: 0px 20px 0px 0px;

              img {
                width: 60px;
                height: 60px;
              }
            }

            .right {
              width: 255px;
              height: 50px;

              .songname {
                width: 255px;
                height: 20px;
                color: #fff;
                font-size: @fs-s;
                margin: 0px 0px 10px;
              }

              .album {
                width: 255px;
                height: 20px;
                color: rgba(255, 255, 255, 0.3);
                font-size: @fs-s;
              }
            }
          }
        }
      }
    }
  }
</style>
