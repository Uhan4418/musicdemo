<template>
  <div class="banner">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" 
            v-for="(item,index) in bannerUrls" 
            :key="index">
          <!-- Bug:这里使用图片懒加载的话，轮播图从第二轮开始，第一张图片会渲染失败 -->
          <a :href="item.linkUrl">
            <img :src="item.picUrl" />
          </a>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import { getBannerData } from "../../api/api";
import {getCookie, setCookie} from '../../utils/utils'
export default {
  data() {
    return {
      bannerUrls: { type: Array, default: [] }
    };
  },
  methods: {
    initBanner() {
      new Swiper(".swiper-container", {
        loop: true, // 循环模式选项
        autoplay: {
          // 自动播放录播图
          delay: 3000, // 延时3s
          stopOnLastSlide: false,
          disableOnInteraction: false
        },

        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        }
      });
    }
  },
  watch: {
    bannerUrls() {
      this.$nextTick(() => {
        this.initBanner();
      });
    }
  },
  mounted() {
    getBannerData().then((res)=>{
      console.log("banner的URL:", res.data.slider)
      this.bannerUrls = res.data.slider;
    })
    setCookie('_csrf','HR0cpcxljdmsb8LMpVpdaWm-')
  }
};
</script>

<style lang="less" scoped>
@import "../../style/index.less";
@import "~swiper/css/swiper.min.css";
.banner {
  .w(375);
  .h(150);
  background: greenyellow;
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>