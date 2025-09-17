<template>
  <div class="container">
    <button @click="toggleQuickReadMode" class="quick-read-toggle">
      {{ isQuickReadMode ? '退出快速阅读模式' : '进入快速阅读模式' }}
    </button>

    <div v-if="isQuickReadMode" class="quick-read-container">
      <!-- 左侧文章列表 -->
      <div class="quick-read-sidebar">
        <div v-for="(articles, subtag) in groupedArticlesBySubtag" :key="subtag" class="subtag-section">
          <h2>
            {{ subtag }}
          </h2>
          <ul>
            <li
              v-for="article in articles"
              :key="article.id"
              @click="loadArticleContent(article.id)"
              :class="{ active: article.id === currentArticleId }"
            >
              {{ article.title }} 发布于 {{ article.time }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧显示屏 -->
      <div class="quick-read-display">
        <div v-html="currentArticleContent" class="article-content"></div>
      </div>
    </div>

    <div v-else>
      <!-- 原文章列表结构 -->
      <div v-for="(articles, subtag) in groupedArticlesBySubtag" :key="subtag" class="subtag-section">
        <h2 @click="toggleSubtag(subtag)">
  {{ subtag }} <span>{{ isSubtagCollapsed[subtag] ? '▼' : '▲' }}</span>
</h2>
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
>
  <ul v-if="isSubtagCollapsed[subtag]" class="drawer-list">
    <li
      v-for="article in articles"
      :key="article.id"
      @click="redirectToArticle(article.id)"
    >
      {{ article.title }} 发布于{{ article.time }}
      <button @click.stop="confirmDeleteArticle(article.id)" class="delete-button">
        删除
      </button>
      <button @click.stop="editArticle(article)" class="edit-button">
        编辑
      </button>
    </li>
  </ul>
</transition>


      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const titles = ref<{ id: number, title: string, time: string, tag: string, subtag: string }[]>([]);
const groupedArticlesBySubtag = ref<{ [key: string]: { id: number, title: string, time: string, tag: string, subtag: string }[] }>({});
const isSubtagCollapsed = ref<{ [key: string]: boolean }>({});

const router = useRouter();
const isQuickReadMode = ref(false);
const currentArticleId = ref<number | null>(null);
const currentArticleContent = ref<string>('');
const hasGrouped = ref(false); // 用于标记是否已经分组过文章

// 切换快速阅读模式
const toggleQuickReadMode = () => {
  isQuickReadMode.value = !isQuickReadMode.value;
  if (isQuickReadMode.value && !hasGrouped.value) {
    groupArticlesBySubtag(); // 只有在首次进入快速阅读模式时分组
  }
};

const beforeEnter = (el: Element) => {
  (el as any).style.height = '0';
  (el as any).style.opacity = '0';
};

const enter = (el: Element) => {
  const e = el as any;
  e.style.transition = 'all 0.3s ease';
  e.style.height = e.scrollHeight + 'px';
  e.style.opacity = '1';
};

const afterEnter = (el: Element) => {
  (el as any).style.height = 'auto';
  (el as any).style.transition = '';
};

const beforeLeave = (el: Element) => {
  const e = el as any;
  e.style.height = e.scrollHeight + 'px';
  e.style.opacity = '1';
};

const leave = (el: Element) => {
  const e = el as any;
  e.style.transition = 'all 0.3s ease';
  e.style.height = '0';
  e.style.opacity = '0';
};

const afterLeave = (el: Element) => {
  (el as any).style.transition = '';
};



// 加载文章内容
const loadArticleContent = async (id: number) => {
  if (currentArticleId.value === id) return; // 防止重复加载
  currentArticleId.value = id;
  const response = await $fetch(`/api/article/findArticleByID`, {
    method: 'GET',
    query: { id },
  });
  const result = response as any[];

  currentArticleContent.value = result[0].content || '<p>加载失败</p>';
};

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
  titles.value = result
    .filter(item => item.tag === '记录')
    .map(item => ({
      id: item.id,
      title: item.title,
      time: item.posttime,
      tag: item.tag,
      subtag: item.subTag,
      content: item.content,
    }));

  // 按子标签进行分组并设置默认折叠状态
  groupArticlesBySubtag();
});

const groupArticlesBySubtag = () => {
  titles.value.forEach(article => {
    const subtag = article.subtag || '未分类';
    if (!groupedArticlesBySubtag.value[subtag]) {
      groupedArticlesBySubtag.value[subtag] = [];
      isSubtagCollapsed.value[subtag] = false; // 设置默认折叠状态为 false
      console.log(`初始化折叠状态：subtag = ${subtag}, folded = false`); // 打印折叠状态
    }
    groupedArticlesBySubtag.value[subtag].push(article);
  });

  // 对每个子标签组内的文章进行排序
  Object.keys(groupedArticlesBySubtag.value).forEach(subtag => {
    groupedArticlesBySubtag.value[subtag].sort((a, b) => {
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      return collator.compare(a.title, b.title);
    });
    console.log(`Subtag: ${subtag}, Articles:`, groupedArticlesBySubtag.value[subtag]);
  });

  // 标记为已分组
  hasGrouped.value = true;

  // 打印折叠状态
  console.log('当前折叠状态：', isSubtagCollapsed.value);
};

// 切换子标签的折叠状态
const toggleSubtag = (subtag: string) => {
  isSubtagCollapsed.value[subtag] = !isSubtagCollapsed.value[subtag];
};

// 跳转到文章页面
const redirectToArticle = (id: number) => {
  router.push(`/article/${id}`);
};

// 确认删除
const confirmDeleteArticle = (id: number) => {
  console.log(id);
  if (confirm('你确定要删除这篇文章吗？这将不可撤销。')) {
    deleteArticle(id);
  }
};

// 删除文章
const deleteArticle = async (id: number) => {
  const index = titles.value.findIndex(article => article.id === id);
  if (index === -1) {
    alert('未找到要删除的文章');
    return;
  }
  const response = await $fetch(`/api/article/deleteArticle`, {
    method: 'DELETE',
    body: { id },
  });
  if (response) {
    // 删除成功后，更新列表
    titles.value.splice(index, 1);
    groupArticlesBySubtag(); // 重新分组
  } else {
    alert('删除失败');
  }
};

// 编辑文章
const editArticle = (article: { id: number, title: string, content: string, tag: string, subtag: string }) => {
  router.push({
    path: `/edit/${article.id}`, // 使用 article.id
    query: {
      id: article.id,
    },
  });
};
</script>


<style scoped>
.container {
  padding: 20px;
  font-family: 喵字摄影体;
}

.subtag-section {
  margin-bottom: 20px;
}

h2 {
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

li:hover {
  color: #1890ff;
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
.quick-read-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.quick-read-container {
  display: flex;
  height: calc(100vh - 40px);
  padding: 20px;
}

.quick-read-sidebar {
  flex: 1;
  max-width: 300px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  padding-right: 10px;
}

.quick-read-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.quick-read-sidebar li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-read-sidebar li:hover, .quick-read-sidebar li.active {
  background-color: #f0f0f0;
}

.quick-read-display {
  flex: 3;
  padding: 20px;
  overflow-y: auto;
}

.article-content {
  font-size: 16px;
  line-height: 1.6;
}

.drawer-list {
  overflow: hidden;
}
.drawer-list li {
  opacity: 1;
  transition: opacity 0.3s ease;
}


</style>
