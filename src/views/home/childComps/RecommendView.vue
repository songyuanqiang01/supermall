<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item" :key="item.id">
      <a :href="item.link">
        <img :src="item.image" />
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name:"RecommendView",
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.recommend {
  display: flex;
  width: 100%;
  text-align: center;
  /* 设置主轴上空白的分布 */
  justify-content: space-around;
  font-size: 12px;
  padding: 10px 0 20px;
  border-bottom: 10px solid #eee;
}
.recommend-item {
  width: 18%;
}
.recommend-item img {
  width: 100%;
  margin-bottom: 10px;
}
</style>