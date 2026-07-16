import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

import '@/styles/index.scss'
import '@/permission'

// 生产环境 mock：仅在 GitHub Pages 演示构建时启用（VITE_USE_MOCK=true）。
// 用动态 import 让 mock 代码只在需要时打包；setupProdMockServer 是 async
// 但不需要 await（mockjs 拦截在 import 完成后就生效）。
if (import.meta.env.VITE_USE_MOCK === 'true') {
  import('./mockProdServer').then(({ setupProdMockServer }) => {
    setupProdMockServer()
  })
}

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// Register all Element Plus icons globally so router meta.icon can reference
// them by component name, e.g. meta.icon: 'HomeFilled' → <component :is="...">.
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
