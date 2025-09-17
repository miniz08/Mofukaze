<template>
  <div v-if="isVisible" class="overlay">
    <div class="gif-container">
      <img :src="randomGif" alt="Loading..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const isVisible = ref(false);
const gifList = ['/Koishi/1.gif', '/Koishi/2.gif', '/Koishi/3.gif','/Koishi/5.gif']; // Ensure these GIF files are in the public folder
const randomGif = ref('');

const showOverlay = () => {
  randomGif.value = gifList[Math.floor(Math.random() * gifList.length)];
  isVisible.value = true;
};

const hideOverlay = () => {
  isVisible.value = false;
};

const router = useRouter();

watchEffect(() => {
  router.beforeEach((to, from, next) => {
    showOverlay();
    next();
  });

  router.afterEach(() => {
    setTimeout(hideOverlay, 1000); // Hide the overlay after 1 second
  });
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
