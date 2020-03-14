<template>
  <div class="my">
    这里是我的界面
  </div>
</template>
<script>
export default{
  // 组件内守卫
  beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      console.log('我的组件离开时触发')
      next()
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index.less';
.my{
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
