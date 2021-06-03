<template>
  <div class="toast">
    <div v-show="show">{{message}}</div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  props: {
    message:{
      type:String,
      default:''
    },
    show:{
      type:Boolean,
      default:false
    }
  }
};
</script>

<style scoped>
.toast{
  position: fixed;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);

  font-size: 20px;
  color:white;
  background-color: rgba(0, 0, 0, .8);
  border-radius: 5%;
  padding:5px 5px;
}
</style>