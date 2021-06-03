// mixin混入 
import {debounce} from 'common/utils'

export const itemListenerMixin={
  data () {
    return {
      itemImgListener:null
    }
  },
  mounted () {
     // 这个地方img标签确实被挂载，但是其中的图片还没有占据高度

    // this.$refs.scroll.refresh 对这个函数进行防抖操作 
    const newRefresh = debounce(this.$refs.scroll.refresh, 50)
    // 对监听的事件进行保存
    this.itemImgListener=() => {// 接收事件总线
    newRefresh();
    }
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
}

