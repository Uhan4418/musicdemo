<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <!-- keep-alive 缓存页面  include="recommend"表示保存recommend组件的缓存-->
    <keep-alive include="recommend,singer">
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器页面 -->
    <Player></Player>
  </div>
</template>
<script>
import Header from './components/Header'
import Tab from './components/Tap/'
import Player from 'components/Player'
// import Banner from './components/Banner'
export default {
  components: {Header,Tab,Player}
}
</script>

<style lang="less" scoped>
@import '~style/index.less';
#app{
  background: @bgcolors;
  .w(375);
  height: 100vh;  // vh为视高
}
</style>
