<template>
  <div class="container">
    <loading v-if="isLoading" />

    <div v-for="(tag, index) in tags" :key="index" class="drawer">
      <div class="drawer-header" @click="toggleDrawer(index)">
        {{ tag.label }}
      </div>
      <transition name="drawer-transition">
        <div v-if="activeDrawer === index" class="drawer-content">
          <ul>
            <li
              v-for="(article, i) in getArticlesByTag(tag.value)"
              :key="i"
              @click="redirectToArticle(article.id)"
            >
              {{ article.title }} 发布于{{ article.time }}
              <button @click.stop="confirmDeleteArticle(i)" class="delete-button">
                删除
              </button>
              <button @click.stop="editArticle(article)" class="edit-button">
                编辑
              </button>
            </li>
            <li v-if="getArticlesByTag(tag.value).length === 10">
              <span class="ellipsis" @click="redirectToTagPage(tag.value)">...</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const titles = ref<{ id: number, title: string, time: string, tag: string }[]>([]);
const activeDrawer = ref<number | null>(null);

const tags = [
  { label: '随笔', value: '随笔' },
  { label: '小说', value: '小说' },
  { label: '记录', value: '记录' },
];

const router = useRouter();

// 模拟异步操作或页面加载
setTimeout(() => {
  isLoading.value = false;
}, 1000); // 1秒后隐藏loading

onMounted(async () => {
  const response = await $fetch(`/api/article/getArticleInfo`, {
    method: 'GET',
  });
  const result: any[] = response as unknown as any[];

  // 加载文章数据
  titles.value = result.map(item => ({
    id: item.id,
    title: item.title,
    time: item.posttime,
    tag: item.tag,
    content:item.content,
  }));
});


// 获取特定标签的文章，最多显示10篇
const getArticlesByTag = (tag: string) => {
  return titles.value.filter(article => article.tag === tag);
};

// 切换抽屉的展开/收起状态
const toggleDrawer = (index: number) => {
  activeDrawer.value = activeDrawer.value === index ? null : index;
};

// 跳转到文章页面
const redirectToArticle = (id: number) => {
  router.push(`/article/${id}`);
};

// 确认删除
const confirmDeleteArticle = (index: number) => {
  if (confirm('你确定要删除这篇文章吗？这将不可撤销。')) {
    deleteArticle(index);
  }
};

// 删除文章
const deleteArticle = async (index: number) => {
  const articleId = titles.value[index].id;
  const response = await $fetch(`/api/article/deleteArticle`, {
    method: 'DELETE',
    body: { id: articleId },
  });
  if (response) {
    // 删除成功后，更新列表
    titles.value.splice(index, 1);
  } else {
    alert('删除失败');
  }
};

const editArticle = (article: { id: number, title: string, content: string, tag: string }) => {
  router.push({
    path: `/edit/${article.id}`, // 使用 article.id
    query: {
      title: article.title,
      tag: article.tag,
      content: article.content,
      id: article.id,
    },
  });
};

// 跳转到标签页
const redirectToTagPage = (tag: string) => {
  if (tag === '随笔') {
    router.push('/List/essayList');
  } else if (tag === '小说') {
    router.push('/List/novelList');
  } else if (tag === '记录') {
    router.push('/noteList');
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: 喵字摄影体;
}

.drawer {
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  font-family: 喵字摄影体;
}

.drawer-header {
  padding: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.drawer-content {
  padding: 10px;
  background-color: #fff;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-family: 喵字摄影体;
}

li {
  padding: 5px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

li:hover {
  color: #1890ff;
  background-color: cornsilk;
  transition: color 0.3s ease;
  transition: background-color 0.3s ease;
}

.ellipsis {
  text-align: center;
  cursor: pointer;
  color: #999;
}


.delete-button {
  right: 10px;
  top: 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #ff7875;
}

.delete-button:active {
  background-color: #d9363e;
}
.edit-button {
  right: 10px;
  top: 10px;
  background-color: #288aec;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #ff7875;
}

.edit-button:active {
  background-color: #288aec;
}

.drawer-transition-enter-from,
.drawer-transition-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.drawer-transition-enter-to,
.drawer-transition-leave-from {
  max-height: 500px; /* 根据内容最大高度调节 */
  opacity: 1;
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-transition-enter-active,
.drawer-transition-leave-active {
  transition: all 0.3s ease;
}


li {
  font-family: 喵字摄影体;
}
</style>
