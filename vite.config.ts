import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  esbuild: {
    jsxFactory: 'h',
    jsxInject: 'import {h,Fragment} from "vue"',
    jsxFragment: 'Fragment',
  },
})
