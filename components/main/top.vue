<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1" @click="redirectToMain">主页</el-menu-item>
      <el-menu-item index="2" @click="redirectToArticle">写文章</el-menu-item>
      <el-menu-item index="5" @click="redirectToEssay">随笔</el-menu-item>
      <el-menu-item index="6" @click="redirectToNovel">小说</el-menu-item>
      <el-menu-item index="7" @click="redirectToNote">记录</el-menu-item>
      <!-- <el-menu-item index="3" @click="redirectToArticleList">文章列表</el-menu-item> -->
      <el-menu-item index="4" @click="redirectToPicture">我的收藏</el-menu-item>
      
    </el-menu>
    <div class="content">
      <router-view />
      
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeIndex = ref('1');

const handleSelect = (key: string, keyPath: string[]) => {

}

const redirectToMain = () => {
  router.push('/')
};

const redirectToArticle = () => {
  router.push('/editor')
};

const redirectToArticleList = () => {
  router.push('/articleList')
};

const redirectToPicture = () => {
  router.push('/collection')
};
const redirectToEssay = () => {
  router.push('/List/essayList')
};
const redirectToNovel = () => {
  router.push('/List/novelList')
};
const redirectToNote = () => {
  router.push('/List/noteList')
};

// Watch the route to update the activeIndex when the route changes
watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case '/':
        activeIndex.value = '1';
        break;
      case '/editor':
        activeIndex.value = '2';
        break;
      case '/articleList':
        activeIndex.value = '3';
        break;
      case '/collection':
        activeIndex.value = '4';
        break;
        case '/List/essayList':
        activeIndex.value = '5';
        break;
        case '/List/novelList':
        activeIndex.value = '6';
        break;
        case '/List/noteList':
        activeIndex.value = '7';
        break;
      default:
        activeIndex.value = '1';
    }
  },
  { immediate: true } // Ensure it runs on initial load
);

</script>

<style>

.el-menu {
  position: fixed;
  top: 0;
  width: 80%;
  height: 130px;
  opacity: 0; /* 初始状态下隐藏 */
  background-color: transparent;
  z-index: 9999; /* 保证菜单显示在前 */
  background-image: url('/img/top.jpg'); /* 添加背景图片 */
  background-size: cover; /* 背景图片覆盖整个菜单 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  border: 3px solid transparent;
  border-radius: 10px; /* 添加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
  transition: opacity 0.5s ease, visibility 0.5s ease; /* 添加渐变效果 */
}

.el-menu:hover {
  opacity: 1; /* 鼠标移入时显示 */
}

.el-menu-item {
  left: 40%;
  font-family: 喵字摄影体;
  font-size: large;
}

.content {
  padding-top: 130px; /* 根据菜单高度调整 */
}

</style>
