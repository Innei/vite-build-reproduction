import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export const PlaceHolderView = defineComponent({
  setup({}, ctx) {
    const router = useRouter()

    return () => <span>{router.currentRoute.value.fullPath}</span>
  },
})

export default PlaceHolderView
