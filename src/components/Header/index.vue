<template>
  <div class="header">
    <!-- 如果图片路径在public目录，直接用跟路径 -->
    <img src="/favicon.ico" alt="">
    <span>vueMUSIC</span>
  </div>
</template>

<style lang="less" scoped>
@import '../../style/index.less';
.header{
  .w(375);
  height: 44px;
  color: @fontcolors;
  font-size: @fs-l;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 20px;
    height: 20px;
  }
}
</style>