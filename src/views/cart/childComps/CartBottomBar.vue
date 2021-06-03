<template>
  <div class="boottom-menu">
    <check-button class="select-all" 
    :is-checked="isSelectAll"
    @click.native="checkClick"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product">去计算({{checkLength}})</span>
  </div>
</template>

<script>
import CheckButton from './checkButton.vue'
import {mapGetters} from "vuex"

export default {
  name:"CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice(){
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((prevalue,item)=>{
        return prevalue + item.lowNowPrice * item.count
      }, 0).toFixed(2)
    },
    checkLength(){
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    ...mapGetters(["cartList"]),

    isSelectAll(){
      if(this.cartList.length === 0) return false
        return !this.cartList.some(item => item.checked === false)
      
    }
  },
  methods: {
    checkClick(){
      if(this.isSelectAll){ //全部选中
        this.cartList.forEach(item => item.checked = false )
      }else{ //部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
.boottom-menu{
  height: 44px;
  width: 100%;
  background-color:gainsboro;
  line-height: 44px;

  display:flex
}
.select-all{
  width: 20px;
  height: 20px;
  margin: auto 5px ;
  line-height:normal;
}
.total-price{
  flex-grow: 1;
  text-align: center;
}
.buy-product{
  /* flex-grow: 1; */
  width: 120px;
  text-align: center;
  background-color: orange;
}
</style>