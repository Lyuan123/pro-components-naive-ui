import type { VNodeChild } from 'vue'

export interface ProDataTableSlots {
  /**
   * 表格为空时的内容
   */
  empty: any
  /**
   * loading 时的内容
   */
  loading: any
  /**
   * 表格标题
   */
  title: any
  /**
   * 表格额外区域
   */
  extra: any
  /**
   * 表格工具栏
   */
  toolbar: any
  /**
   * 自定义表格，一般可以放置一些别的东西
   */
  table: {
    tableDom: VNodeChild
  }
}
