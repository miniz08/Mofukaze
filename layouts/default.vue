<template>
  <div id="wrapper">
    <div id="background"></div>
    <div id="content">
      <loading v-if="isLoading" />
      <div v-if="!isLoading" class="paper">
        <top />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000); // 1秒后隐藏loading
});

useSeoMeta({
  title: 'Mofukaze',
  ogTitle: '北风',
  description: '夹杂雪花的强风，来自北方的孤风。',
  ogDescription: '夹杂雪花的强风，来自北方的孤风。',
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#wrapper {
  position: relative;
  min-height: 80%;
}

#background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/img/Koishi in the sky.jpg') no-repeat center center fixed;
  background-size: cover;
  z-index: -1;
}

#content {
  position: relative;
  min-height: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  font-family: 喵字摄影体;
}

.paper {
  width: 80%;
  padding: 20px;
  background: 
    url('/img/0435.jpg') repeat,
    white; /* 淡淡纹理叠加白色背景 */
  background-size: 300px 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ddd;
}


.paper p {
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
}


</style>