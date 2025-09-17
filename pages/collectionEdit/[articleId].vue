<template>
    <div>
      <button @click="top" class="fixed-button" id="back-to-top">回到顶部</button>
      <button @click="bottom" class="fixed-button" id="back-to-bottom">回到底部</button>
    </div>
    <div>
      <loading v-if="isLoading" />
      <collectionEditor />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isLoading = ref(true);
  
  // 模拟异步操作或页面加载
  setTimeout(() => {
    isLoading.value = false;
  }, 1000); // 1秒后隐藏loading
  
  function top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function bottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  </script>
  
  <style>
  .fixed-button {
    position: fixed; /* 使用fixed确保按钮相对于窗口固定 */
    left: -10px; /* 固定在页面左边 */
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000; /* 确保按钮在页面上方 */
    font-size: 16px;
  }
  
  /* 设置回到顶部按钮的位置 */
  #back-to-top {
    top: 50%; /* 垂直居中 */
    transform: translateY(-120px); /* 向上偏移 */
  }
  
  /* 设置回到底部按钮的位置 */
  #back-to-bottom {
    top: 50%; /* 垂直居中 */
    transform: translateY(40px); /* 向下偏移 */
  }
  </style>
  