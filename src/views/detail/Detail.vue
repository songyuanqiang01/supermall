<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="navRef" />
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <!-- <ul>
        <li v-for="item in $store.state.cartList" :key="item.id">
          {{ item }}
        </li>
      </ul> -->

      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
        @imageLoadTheme="imageLoadTheme"
      />
      <detail-param-info :paramInfo="paramInfo" ref="paramRef" />
      <detail-comment-info :commentInfo="commentInfo" ref="commentRef" />
      <goods-list :goods="recommends" ref="recommendRef" />
    </scroll>

    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />

    <toast :show="show"  v-show="show" :message="message"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";

import GoodsList from "../../components/content/goods/GoodsList.vue";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/backTop.vue";
import Toast from '../../components/common/toast/Toast.vue';

import { itemListenerMixin } from "common/mixin";
import { debounce } from "common/utils";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Toast,
  },
  mixins: [itemListenerMixin], // 混入
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [0, 1000, 2000, 3000],
      getThemeTopYs: null,
      detailIndex: 0,
      isShowBackTop: false,
      message:'',
      show:false,
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      // 2.1.获取结果
      const data = res.result;
      // 2.2.获取顶部信息
      this.topImages = data.itemInfo.topImages;

      // 2.3.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 2.4.获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 2.5.获取商品信息
      this.detailInfo = data.detailInfo;

      // 2.6.保存参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 2.7.保存评论信息
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    // 4.给getThemeTopYs赋值
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.paramRef.$el.offsetTop);
      this.themeTopYs.push(this.$refs.commentRef.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommendRef.$el.offsetTop);
      this.themeTopYs.push(Infinity);

      // console.log(this.themeTopYs);
    });
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
    },
    imageLoadTheme() {
      this.getThemeTopYs();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index]);
    },
    contentScroll(position) {
      // 1.获取y值
      const positoinY = -position.y;
      // 2.positoinY和主题中的值进行对比 得到index
      for (let i = 0; i < this.themeTopYs.length - 1; i++) {
        // this.detailIndex !== i 防止赋值过于频繁
        if (
          this.detailIndex !== i &&
          positoinY >= this.themeTopYs[i] &&
          positoinY < this.themeTopYs[i + 1]
        ) {
          this.$refs.navRef.currentIndex = i;
          this.detailIndex = i;
        }
      }
      // 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.lowNowPrice = this.goods.lowNowPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里
      // this.$store.commit("addCart",product)
      this.$store.dispatch("addCart", product).then(res =>{
        // console.log(res);
        this.show=true;
        this.message=res;

        setTimeout(() =>{
          this.show=false;
          this.message=''
        },1300)
      });
    },
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 999;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>