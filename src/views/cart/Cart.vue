<template>
  <div id="cart">
    <nav-bar class="nav-bar"><div slot="center">购物车({{ cartLength }})</div></nav-bar>
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="item in cartList" :key="item.id" :item-info="item"></cart-list-item>
    </scroll>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import CartListItem from "./childComps/CartListItem.vue";
import CartBottomBar from './childComps/CartBottomBar.vue';
// mapGetters 辅助函数
import { mapGetters } from "vuex";


export default {
  name:"Cart",
  components: {
    NavBar,
    Scroll,
    CartListItem,
    CartBottomBar,
  },
  computed: {
    // mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
    ...mapGetters(["cartLength","cartList"]),
  },
  activated () {
    this.$refs.scroll.refresh()
  }
};
</script>

<style scoped>
#cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
.content {
  height: calc(100% - 44px - 49px - 44px);
  overflow: hidden;
}
</style>