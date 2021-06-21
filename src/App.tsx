import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
const App = defineComponent({
  setup({}) {
    return () => <RouterView />
  },
})

export default App
