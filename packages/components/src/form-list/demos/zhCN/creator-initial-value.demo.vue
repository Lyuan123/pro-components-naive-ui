<markdown>
# 新建一行的默认值
</markdown>

<script lang="tsx">
import { createProForm } from 'pro-naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      form: createProForm({
        initialValues: {
          userInfo: [
            { name: 'zcf', age: 26 },
            { name: 'zzx', age: 0.5 },
            { name: 'cxh', age: 28 },
          ],
        },
      }),
    }
  },
})
</script>

<template>
  <pro-form :form="form">
    <pro-form-list
      title="用户信息"
      path="userInfo"
      only-show-first-item-label
      :creator-initial-value="() => ({ name: 'Name', age: 0 })"
    >
      <pro-input
        title="姓名"
        path="name"
      />
      <pro-digit
        title="年龄"
        path="age"
      />
    </pro-form-list>
  </pro-form>
</template>
