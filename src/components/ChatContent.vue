<script>
import { renderEmoji } from '@/utils'

export default {
  props: ['msg'],
  setup(props) {
    // 返回渲染函数(这样处理 emoji 容易些)
    return () => renderEmoji(props.msg)
  },
}
</script>
