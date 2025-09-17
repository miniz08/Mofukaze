<template>
  <div>
    <div class="editor-container">
      <div class="input-group">
        <label for="title">标题:</label>
        <input id="title" v-model="title" type="text" placeholder="请输入文章标题" />
      </div>
      
      <div class="input-group">
          <label for="tag">标签:</label>
          <input  v-model="tag" type="text" placeholder="文章类型" disabled="disabled"/>
      </div>

      

      <div class="content-and-toolbar">
        <div class="editor-content-wrapper">
          <EditorContent class="editor-content" :editor="editor" :style="{ fontSize: `${fontSize}px` }" />
        </div>
  
        <div v-if="editor" class="editor-toolbar">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            加粗
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            斜体
          </button>
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            删除线
          </button>
          <button
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"
          >
            代码
          </button>
          <button @click="editor.chain().focus().unsetAllMarks().run()">
            清除格式
          </button>
          <button @click="editor.chain().focus().clearNodes().run()">
            清除节点
          </button>
          <button
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
          >
            段落
          </button>
          <button @click="increaseFontSize">增大字体</button>
          <button @click="decreaseFontSize">减小字体</button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            标题1
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            标题2
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            标题3
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          >
            标题4
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          >
            标题5
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          >
            标题6
          </button>
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            无序列表
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            有序列表
          </button>
          <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
          >
            代码块
          </button>
          <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
          >
            引用
          </button>
          <button @click="editor.chain().focus().setHorizontalRule().run()">
            水平线
          </button>
          <button @click="editor.chain().focus().setHardBreak().run()">
            换行
          </button>
          <button
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
          >
            撤销
          </button>
          <button
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
          >
            重做
          </button>
          <button @click="addImage">
            添加图片
          </button>
        </div>
      </div>
      
      <div class="submit-container">
        <button @click="submitContent" class="submit-button">保存</button>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useRouter, useRoute } from 'vue-router';

const editor = ref(useEditor({
  extensions: [StarterKit, Image],
  content: "<p>God Knows</p>",
}));

const title = ref('');
const tag = ref('');
const id = ref(null); // Add id ref to store the article ID

onBeforeUnmount(() => {
  editor.value.destroy();
});

function addImage() {
  const url = window.prompt('请输入图片URL');
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run();
  }
}

const router = useRouter();
const route = useRoute();

onMounted(async() => {
    id.value = route.query.id || null; // 从路由参数中获取文章 id
  if (id.value) {
    try {
      const response =  await $fetch(`/api/collection/findCollectionByID?id=${id.value}`, {
      method: 'GET',
    });
    const data = response as any[];
    console.log(data)
      if (data) {
        title.value = data[0].title;
        tag.value = data[0].tag;
        editor.value.commands.setContent(data[0].content);
      }
    } catch (error) {
      console.error('Failed to fetch article', error);
    }
  }
// 添加键盘事件监听
window.addEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event) {
if (event.ctrlKey) {
  switch (event.key) {
    case 'b':
      event.preventDefault();
      editor.value.chain().focus().toggleBold().run();
      break;
    case 'i':
      event.preventDefault();
      editor.value.chain().focus().toggleItalic().run();
      break;
    case 'z':
      event.preventDefault();
      editor.chain().focus().undo().run();
      break;
    case '1':
      event.preventDefault();
      editor.value.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case '2':
      event.preventDefault();
      editor.value.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case '3':
      event.preventDefault();
      editor.value.chain().focus().toggleHeading({ level: 3 }).run();
      break;
  }
}
}


async function submitContent() {
  const content = editor.value.getHTML();
  try {
    const response = await fetch('/api/collection/editCollection', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id.value, title: title.value, content, tag: tag.value }),
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert('保存成功');
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error('保存失败', error);
  }
}

const fontSize = ref(16); // 定义初始字体大小

function increaseFontSize() {
  fontSize.value += 2; // 增大字体大小
  updateFontSize();
}

function decreaseFontSize() {
  fontSize.value = Math.max(fontSize.value - 2, 10); // 限制最小字体大小为 10
  updateFontSize();
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 4px;
  font-weight: bold;
}

.input-group input,
.input-group select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.content-and-toolbar {
  display: flex;
  justify-content: space-between;
}

.editor-content-wrapper {
  flex: 1;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  min-height: 200px;
  background-color: #fff;
  margin-right: 16px;
}

.editor-toolbar {
  position: fixed; /* 改为 fixed，确保按钮组悬浮 */
  top: 16px; /* 根据需要调整顶部位置 */
  right: 60px; /* 固定在页面右侧 */
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: transparent;
  padding: 8px;
  z-index: 1000; /* 确保按钮组在页面其他元素之上 */
}

.editor-toolbar button {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 喵字摄影体;
}

.editor-toolbar button.is-active {
  background-color: #007bff;
  color: #fff;
}

.editor-toolbar button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.editor-toolbar button:not(:disabled):hover {
  background-color: #e0e0e0;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.fixed-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000; /* 确保按钮在页面上方 */
  font-size: 16px;
}

</style>
