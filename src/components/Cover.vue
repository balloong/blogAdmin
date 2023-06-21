<template>
<!-- 图片组件 -->
  <div class="cover">
    <!-- 当接口返回数据时用接口返回的图片 -->
    <img  :src="proxy.globalInfo.imageUrl+cover"
    v-if="cover">
    <!-- 否则用默认的图片 -->
    <img v-else
     src="../assets/default_img.png">
  </div>
</template>

<script setup>
import {getCurrentInstance} from 'vue'


const {proxy} = getCurrentInstance()

const props = defineProps({
    cover: {
        type:String
    }
})


</script>

<style lang="scss">
.cover {
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  overflow: hidden;
  img {
    width: 100%;
  }
}
</style>
