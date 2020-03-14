// 全局变量文件
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // show:true,  //组件显示/隐藏
    songLists:[],   // 要播放的歌曲列表
    fullScreen:true,  // 大屏/小屏
    currentIndex:-1,  // 表示当前正在播放哪首歌  因为数组从0开始，-1才代表没有
    mode:1,  // 循环模式 0-不循环 1-单曲 2-顺序 3-随机
    collectState:false  // 收藏状态 默认为false
  },
  mutations:{
    // 控制大/小屏的切换
    changeScreen(state,screenState){
      state.fullScreen = screenState
    },
    // 添加播放列表
    addSongList(state,params){
      // params 要播放的歌曲列表
      state.songLists = params
    },
    // 修改当前正在播放哪首歌
    changeCurrentIndex(state,index){
      state.currentIndex = index
    },
    prevCurrentIndex(state){
      let count = state.songLists.length
      if(state.currentIndex > 0){
        // 下标大于0的时候 --为上一曲
        state.currentIndex--
      }else{
        // 当下标减到小于0的时候 下标返回至歌单中最后一首歌曲的下标
        state.currentIndex = count-1
      }
    },
    nextCurrentIndex(state){
      let count = state.songLists.length
      if(state.currentIndex < count-1){
        // 小于长度下标的时候 ++为下一曲
        state.currentIndex++
      }else{
        // 最后一首的下一首重新回到第一首
        state.currentIndex = 0
      }
    },
    changeLoopMode(state){
      // 修改循环模式
      if(state.mode == 3){
        state.mode = 1
      }else{
        ++state.mode
      }
    },
    collectSong(state){
      state.collectState = !state.collectState
    }
  },
  getters:{
    // 当前正在播放的哪首歌
    currentSong(state){
      return state.songLists[state.currentIndex] || null
    }
  }
})
export default store
