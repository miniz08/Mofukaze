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
import type { FormData } from 'undici-types';
import { isConstructorDeclaration } from 'typescript';
  
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
  
  function generateRandomTitle(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}


  async function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.jpg, .jpeg, .png'; // 限制只允许 jpg, jpeg, png 格式
  input.click();

  input.onchange = async (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event: { target: { result: any; }; }) => {
        const imageSrc = event.target.result;
        
        // 在编辑器中显示图片预览
        editor.value.chain().focus().setImage({ src: imageSrc }).run();

        try {
          // 上传图片并获取服务器返回的路径
          const title =generateRandomTitle();; // 生成一个标题（根据需求修改）
          const uploadResponse = await uploadImage(imageSrc, title);
          console.log(uploadResponse);
          
          if (uploadResponse) {
            // 用上传后的图片路径更新编辑器中的图片
            editor.value.chain().focus().setImage({ src: uploadResponse }).run();
          }
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      };
      reader.readAsDataURL(file); // 读取文件为 Data URL，用于预览
    }
  };
}

async function uploadImage(image: any, title: string) {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image, title }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', errorText);
      throw new Error('图片上传失败: ' + errorText);
    }

    const result = await response.json();
    if (result.status === 'success' && result.filePath) {
      return result.filePath;  // 返回文件的路径
    } else {
      throw new Error('图片上传失败');
    }
  } catch (error) {
    console.error('上传过程中发生错误:', error);
    throw error;
  }
}


// 提交文章内容
async function submitContent() {
  let content = editor.value.getHTML();

  // 将连续的空格替换为 &nbsp;
  content = content.replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));

  try {
    const response = await fetch('/api/article/editArticle', {
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

  
  const router = useRouter();
  const route = useRoute();

  const fontSize = ref(16); // 定义初始字体大小

function increaseFontSize() {
  fontSize.value += 2; // 增大字体大小
  updateFontSize();
}

function decreaseFontSize() {
  fontSize.value = Math.max(fontSize.value - 2, 10); // 限制最小字体大小为 10
  updateFontSize();
}

function updateFontSize() {
  editor.value.chain().focus().setNode('textStyle', { fontSize: `${fontSize.value}px` }).run();
}

  
  onMounted(async() => {
    id.value = route.query.id || null; // 从路由参数中获取文章 id
  if (id.value) {
    try {
      const response =  await $fetch(`/api/article/findArticleByID?id=${id.value}`, {
      method: 'GET',
    });
    const data = response as any[];
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
function handleKeyDown(event: { key: string; preventDefault: () => void; ctrlKey: any; }) {
  if (event.key === 'Tab') {
    event.preventDefault(); // 防止默认 Tab 行为
    if (editor.value.isActive('listItem')) {
      // 如果是列表项，增加缩进
      editor.value.chain().focus().sinkListItem('listItem').run();
    } else {
      // 否则插入指定数量的空格
      editor.value.chain().focus().insertContent('    ').run(); // 插入 4 个空格
    }
  } else if (event.key === 'Shift' && event.key === 'Tab') {
    event.preventDefault(); // 防止默认行为
    if (editor.value.isActive('listItem')) {
      // 如果是列表项，减少缩进
      editor.value.chain().focus().liftListItem('listItem').run();
    }
  }

  // 其他快捷键逻辑
  if (event.ctrlKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault();
        editor.chain().focus().toggleBold().run();
        break;
      case 'i':
        event.preventDefault();
        editor.chain().focus().toggleItalic().run();
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
      case 'o':
        event.preventDefault();
        editor.value.chain().focus().toggleOrderedList().run();
        break;
    }
  }
}

// 添加事件监听
window.addEventListener('keydown', handleKeyDown);


  

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
    bottom: 25px;
    position: fixed;
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
  