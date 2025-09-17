<template>
  <div class="container">
    <loading v-if="isLoading" />
    <ol class="article-list">
      <li 
        v-for="(article, index) in displayedArticles" 
        :key="index" 
        class="article-item"
        @mouseover="setRandomBackground(index)"
      >
        <div class="background-image" :style="{ backgroundImage: article.backgroundImage ? `url(${article.backgroundImage})` : 'none' }"></div>
        <div class="content" @click="redirectToArticle(index)">
          <div id="title">{{ article.title }}</div>
          <div v-html="article.content.slice(0,200) + '...'"></div><pre></pre>发布于{{ article.time }}
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const qrVerified = ref(false); // 状态：是否验证通过



const titles = ref<{ id: number, title: string, time: string, content: string, backgroundImage?: string }[]>([]);
const displayedArticles = ref<{ id: number, title: string, time: string, content: string, backgroundImage?: string }[]>([]);
const router = useRouter();
const isLoading = ref(true);

// 模拟异步操作或页面加载
setTimeout(() => {
  isLoading.value = false;
}, 1000); // 1秒后隐藏loading

onMounted(async () => {
  const response = await $fetch('/api/article/getArticleInfo', {
    method: 'GET',
  });
  const result: any[] = response as unknown as any[];

  // 提取 id, title, time, content，并反转顺序
  titles.value = result.map(item => ({
    id: item.id,
    title: item.title,
    time: item.posttime,
    content: item.content
  })).reverse();

  // 仅显示最多十篇文章
  displayedArticles.value = titles.value.slice(0, 10);
});

const images = [
  '/img/background/00.png',
 '/img/background/01.png',
 '/img/background/02.jpg',
 '/img/background/03.png',
 '/img/background/04.jpg',
 '/img/background/05.jpg',
 '/img/background/06.jpg',
 '/img/background/07.png',
 '/img/background/08.png',
 '/img/background/09.jpg',
 '/img/background/10.png',
 '/img/background/11.png',
 '/img/background/12.jpg',
 '/img/background/13.png',
 '/img/background/14.jpg',
 '/img/background/15.jpg',
 '/img/background/17.png',
  // 添加更多图片路径...
];

const setRandomBackground = (index: number) => {
  // 如果该文章已经有背景图片，不再生成新的背景图片
  if (!displayedArticles.value[index].backgroundImage) {
    const randomIndex = Math.floor(Math.random() * images.length);
    displayedArticles.value[index].backgroundImage = images[randomIndex];
  }
};

const redirectToArticle = (index: number) => {
  const articleId = displayedArticles.value[index].id;
  router.push(`/article/${articleId}`);
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.article-list {
  list-style-type: none;
  padding: 0;
}

.article-item {
  position: relative;
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 5px;
  transition: transform 0.2s ease;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.background-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 0) 100%);
  transition: all 0.2s ease-in-out;
  opacity: 1;
  z-index: 2;
}

.article-item:hover .background-image::before {
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0.8;
  transition: all 0.8s ease-in-out;
}

.content {
  position: relative;
  z-index: 3; /* 确保内容位于背景图片和遮罩的上方 */
}

.article-item:hover {
  transform: scale(1.02);
}

.article-item:active {
  transform: scale(0.98);
}

.article-item + .article-item {
  margin-top: 10px;
}

#title {
  font-size: larger;
  font-weight: bold;
}


</style>