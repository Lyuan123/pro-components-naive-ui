<markdown>
# 不使用 v-model:show

可以通过实例方法来打开弹窗
</markdown>

<script lang="tsx">
import { useProModalInst } from 'pro-components-naive-ui'

export default defineComponent({
  setup() {
    const [instRef, { open }] = useProModalInst()
    return {
      instRef,
      open,
    }
  },
})
</script>

<template>
  <n-flex>
    <n-button @click="open">
      打开看看
    </n-button>
  </n-flex>
  <pro-modal
    ref="instRef"
    title="弹窗"
    preset="card"
    class="w-600px"
  >
    <div>
      <div>一些无用的内容</div>
      <div>一些无用的内容</div>
      <div>一些无用的内容</div>
      <div>一些无用的内容</div>
    </div>
  </pro-modal>
</template>
