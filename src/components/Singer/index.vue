<template>
  <div class="singers">
    <!-- 滚动的列表 -->
    <div class="wrapper" ref="singerWrapperL">
      <div class="content">
        <ul>
          <li v-for="(item,index) in singers" :key="index" :ref="item.Findex">
            <!-- 每一组的首字母 -->
            <h3>{{item.Findex}}</h3>
            <!-- 首字母下的歌手信息 -->
            <ol>
              <li v-for="(singerItem,singerIndex) in item.list" :key="singerIndex" @click="goDetail(singerItem.Fsinger_mid)">
                <img v-lazy="singerItem.avator" alt />
                <span>{{singerItem.Fsinger_name}}</span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    </div>
    <!-- 快速列表 -->
    <div class="quicklist">
      <ul @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <li v-for="(item,index) in quickData" :key="index" @click="quickJump(item.Findex)" :class="selFindex === item.text ? 'sel' : '' ">{{item.text}}</li>
      </ul>
    </div>
    <!-- 嵌套路由 -->
    <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  /*
  思路：
  1.请求数据
  2.对请求的数据进行整理
  3.根据数据渲染界面
    [
      {Findex:A,list:[{a1},{a2},{a3}]}
      {Findex:b,list:[{b1},{b2},{b3}]}
    ]

  4.渲染歌手列表
  5.歌手列表能滚动
  6.渲染快速入口 的数据 是和歌手列表数据进行关联 计算属性
  7.歌手列表滚动可以控制快速入口 item切换
    滚动的时候 获取滚动区域内的首字母
    1. 首字母数字 quickdata
    2. 距离数组  每一组歌手块的高度
    3. 判断向上移动的距离在距离数组里的下标
    4. 根据下标在首字母数组里获取首字母
  8.快速入口点击  可以控制歌手   滚动
    1.点击快速入口
    2.点完了需要能滚
  9.快速入口滑动 控制歌手滚动
    a.获取按下点的坐标
    b.移动的过程中 计算 移动过的距离
    c.用移动过的距离除以每一个快的尺寸 计算出滚动了多少格格
    4.起始点的下标 +滚动的格格数  求出滚动的字母位置
    5. scrollElement 左边滚动到某一个元素

  10.点击歌手进入到歌手详情页
  */
  import {
    getSingersData
  } from "api/api.js";
  import {
    normalData
  } from "./index.js";
  import BS from "better-scroll";
  export default {
    name: "singer",
    data() {
      return {
        singers: [],
        selFindex: "热" // 选中的下标
      };
    },
    methods: {
      goDetail(Fsinger_mid) {
        this.$router.push(`/singer/${Fsinger_mid}`)
      },
      touchStart(e) {
        // 设定距离屏幕顶部的位置是140
        let y = e.touches[0].pageY;
        // 获取按下的格子下标
        let startCount = parseInt((y - 140) / 18);
        this.touch.y = y;
        this.touch.startCount = startCount;
        console.log("按下", y, startCount);
      },
      touchMove(e) {
        let moveY = e.touches[0].pageY;
        let moveDis = moveY - this.touch.y; // 计算出移动过的距离
        let count = parseInt(moveDis / 18); // 计算出移动了的格子数
        // console.log('移动过的距离和格子数：',moveDis,count)
        let moveIndex = this.touch.startCount + count; // 获取下标 = 开始的格子数+移动了的格子数
        // 防止超出边界
        if (moveIndex < 0 || moveIndex > this.quickData.length - 1) {
          return false;
        }

        // 上午做过调整。热门时， text = 热  Findex 才是 热门
        // 这里取 text 时，后面调用 quickJump 时就获取不到对应的dom元素就包错
        let moveFindex = this.quickData[moveIndex].Findex; // 获取移动到的首字母

        console.log("移动过的距离和格子数：", moveDis, count);
        this.quickJump(moveFindex);
      },
      touchEnd() {
        console.log("抬起");
      },
      quickJump(item) {
        // console.log(item)
        // 右侧的是 热。左侧是 热门。
        // 根据 热 去找 热门的  ref 找不到
        // 通过其他字段来控制 新增个text字段

        // 点击每一项之后 触发事件需要知道点击到哪一个首字母
        // 根据字母获取到固定的元素
        let dom = this.$refs[item][0];
        // console.log('点到了 ',item,dom);
        // scrollToElement(el)的作用是滚动到指定的目标元素el的位置  bs内部的方法
        this.BsL.scrollToElement(dom);
      },
      initBsSingerL() {
        let wrapperL = this.$refs.singerWrapperL;
        // let wrapperR = this.$refs.singerWrapperR;
        this.BsL = new BS(wrapperL, {
          probeType: 3,
          click: true,
          // 开启下拉刷新
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          },
          // 开启上拉加载
          pullUpLoad: {
            threshold: 50
          },
        });
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
        // 监听下拉刷新
        this.BsL.on('pullingDown', () => {
          console.log('下拉刷新')
          getSingersData().then(res => {
            // console.log('res',res);
            // 处理数据
            let data = normalData(res.data.list);
            console.log("处理完毕后的数据", data);
            this.singers = data;
            // 请求到数据，并更新页面之后再初始化
            this.$nextTick(() => {
              this.initBsSingerL();
              // this.initBsSingerR()
            });
            // 告知better-scroll本次下拉刷新数据加载完毕
            this.BsL.finishPullDown()
          });
        })
        // 监听上拉加载
        this.BsL.on('pullingUp', () => {
          console.log('上拉加载')
          // 告知better-scroll本次上拉加载数据完毕
          this.BsL.finishPullUp()
        })
        
        console.log("this.$refs", this.$refs);
        // 获取距离数组
        let distance = [];
        for (const key in this.$refs) {
          if (key !== "singerWrapperL") {
            // 当前数据下的第0项下的offsetTop键的值push到distance中
            distance.push(this.$refs[key][0].offsetTop);
          }
        }
        //监听滚动
        this.BsL.on("scroll", pos => {
          let y = Math.abs(pos.y);
          console.log("滚动了", y);
          // 判断每一次滚动的距离在什么范围内
          let scrollIndex = 0; // 滚动所在区域的下标
          for (let index = 0; index < distance.length; index++) {
            if (y >= distance[index] && y < distance[index + 1]) {
              scrollIndex = index; // 将滚动元素所在区域的下标作为滚动区域的下标
            } else if (y >= distance[distance.length - 1]) {
              // 最后的边界判断
              scrollIndex = distance.length - 1;
            }
          }
          console.log("滚动区域的下标:", scrollIndex);
          // 根据下标换字符
          let scrollFindex = this.quickData[scrollIndex];
          console.log(
            "滚动区域的下标对应的快速入口的首字母：",
            scrollFindex.text
          );
          this.selFindex = scrollFindex.text; // 将首字母作为快速入口当前选中的首字母
        });
        // console.log(distance)
      }
    },
    // 通过computed配置项将两组数据关联起来
    computed: {
      quickData() {
        // 快速入口数据和歌手数据做关联  singers是已经处理完毕的数据
        let result = this.singers.map(item => {
          // 遍历singers，返回每个singer的首字母 然后将取出的所有歌手的的首字母保存到result中
          return {
            Findex: item.Findex,
            text: item.Findex === "热门" ? "热" : item.Findex
          };
        });
        // 对首字母'热门'进行处理 换成'热'
        // if(result[0] === '热门')result[0]='热';
        console.log("快速启动数据", result);
        // return result  // 返回result
        return result;
      }
    },
    created() {
      // 初始化数据，把移动距离挂到this对象下
      this.touch = {
        y: 0
      };
      getSingersData().then(res => {
        // console.log('res',res);
        // 处理数据
        let data = normalData(res.data.list);
        console.log("处理完毕后的数据", data);
        this.singers = data;
        // 请求到数据，并更新页面之后再初始化
        this.$nextTick(() => {
          this.initBsSingerL();
          // this.initBsSingerR()
        });
      });
    }
  };
</script>

<style lang="less" scoped>
  @import "~style/index.less";

  .singers {
    position: fixed;
    top: 88px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    .quicklist {
      width: 20px;
      background: rgba(0, 0, 0, 0.3);
      font-size: @fs-xs;
      padding: 20px 0 20px;
      color: rgba(255, 255, 255, 0.5);
      position: absolute;
      right: 10px;
      top: 40px;
      border-radius: 10px;
      text-align: center;

      ul {
        li {
          width: 20px;
          height: 18px;
        }

        .sel {
          color: @fontcolors;
        }
      }
    }

    .wrapper {
      height: 100%;
      overflow: hidden;
      padding: 0px, 0px, 30px;

      .content {
        .w(375);

        ul {
          li {
            padding: 0px 0px 30px;

            h3 {
              height: 30px;
              line-height: 30px;
              font-size: @fs-xs;
              color: rgba(255, 255, 255, 0.5);
              background: #333333;
              padding-left: 20px;
            }

            ol {
              li {
                .w(375);
                height: 70px;
                box-sizing: border-box;
                padding: 20px 0px 0px 30px;
                display: flex;
                align-items: center;

                img {
                  width: 50px;
                  height: 50px;
                  border-radius: 25px;
                }

                span {
                  display: inline-block;
                  height: 50px;
                  line-height: 50px;
                  font-size: @fs-s;
                  color: rgba(225, 225, 225, 0.5);
                  margin: 0px, 0px, 0px, 20px;
                  padding-left: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
