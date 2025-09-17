// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' }]
    }
},
components: [
  {
    path: '~/components/',
    pathPrefix: false,
  },
],
experimental: {
  writeEarlyHints: false
  },
  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },
  modules: ['@element-plus/nuxt', "nuxt-tiptap-editor"],

})