<markdown>
# 多表单联动

如果只是布局看起来像多个表单，可以将 `ProForm` 放在最外层，这里只是为了演示
</markdown>

<script lang="tsx">
import { useMounted } from '@vueuse/core'
import { useProFormInst } from 'pro-components-naive-ui'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const isMounted = useMounted()
    const [aInstRef, { getScope: getAFormScope }] = useProFormInst()
    const [bInstRef, { getScope: getBFormScope }] = useProFormInst()

    const scope = {
      $aForm: computed(() => getAFormScope()),
      $bForm: computed(() => getBFormScope()),
    }

    return {
      scope,
      aInstRef,
      bInstRef,
      isMounted,
    }
  },
})
</script>

<template>
  <n-card :bordered="false" title="A表单">
    <pro-form ref="aInstRef" label-placement="left" label-width="auto" :scope="scope">
      <pro-input
        v-if="isMounted"
        title="控制B表单input颜色"
        path="color"
        :field-props="{
          style: {
            background: '{{ $bForm.$vals.color }}',
          },
        }"
      />
    </pro-form>
  </n-card>
  <n-card :bordered="false" title="B表单">
    <pro-form ref="bInstRef" label-placement="left" label-width="auto" :scope="scope">
      <pro-input
        v-if="isMounted"
        title="控制A表单input颜色"
        path="color"
        :field-props="{
          style: {
            background: '{{ $aForm.$vals.color }}',
          },
        }"
      />
    </pro-form>
  </n-card>
</template>
