<template>
  <div>
    <div>
      <button @click="top" class="fixed-button" id="back-to-top">回到顶部</button>
      <button @click="bottom" class="fixed-button" id="back-to-bottom">回到底部</button>
    </div>

    <loading v-if="isLoading" />
    <h1>{{ title }}</h1>
    <img ref="imageRef" :src="imageSrc" alt="后端图片" width="300" height="300" />
    <div v-html="content"></div>
    
    <!-- Edit and Delete Buttons -->
    <button @click="editCollection" class="edit-button">编辑</button>
    <button @click="deleteCollection" class="delete-button">删除</button>
  </div>
  <div id="commentAera"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const content = ref<string>('');
const title = ref<string>('');
const imageSrc = ref<string>('');
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);

const fetchCollectionContent = async (id: number) => {
  try {
    const response = await $fetch(`/api/collection/findCollectionByID?id=${id}`, {
      method: 'GET',
    });
    const result = response as any[];
    if (result) {
      title.value = result[0].title;
      content.value = result[0].content;
      imageSrc.value = `/img/cover/${result[0].title}.jpeg`;
    }
  } finally {
    isLoading.value = false;
  }
};

const articleId = ref<number>(0);
onMounted(() => {
  articleId.value = Number(route.params.id);
  fetchCollectionContent(articleId.value);
});

// Delete Collection
const deleteCollection = async () => {
  try {
    await $fetch('/api/collection/deleteCollection', {
      method: 'POST',
      body: { id: articleId.value },
    });
    router.push('/'); // Navigate to the homepage or another page after deletion
  } catch (error) {
    console.error('删除收藏失败', error);
  }
};

// Edit Collection
const editCollection = () => {
  router.push({
    path: `/collectionEdit/${articleId.value}`,
    query: {
      id: articleId.value,
    },
  });
};

// Scroll functions
function top() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Simulate loading
setTimeout(() => {
  isLoading.value = false;
}, 1000);
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

  .delete-button, .edit-button {
    margin-left: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .delete-button {
    background-color: #ff4d4f;
    color: white;
  }
  
  .edit-button {
    background-color: #288aec;
    color: white;
  }
  </style>
  