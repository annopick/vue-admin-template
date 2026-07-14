/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '*.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module 'mockjs' {
  const Mock: {
    mock: <T>(template: T | string) => T
    Random: {
      datetime: (format?: string) => string
      first: () => string
      title: (min?: number, max?: number) => string
      integer: (min?: number, max?: number) => number
      float: (min: number, max: number, dmin?: number, dmax?: number) => number
      cname: () => string
    }
  }
  export default Mock
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const locale: Language
  export default locale
}

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
