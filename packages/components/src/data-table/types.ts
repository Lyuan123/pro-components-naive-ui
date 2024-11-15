import type { DataTableProps } from 'naive-ui'
import type { TableBaseColumn, TableColumnGroup, TableExpandColumn, TableSelectionColumn } from 'naive-ui/es/data-table/src/interface'
import type { ExtractObjectPath } from 'pro-components-hooks'
import type { VNodeChild } from 'vue'
import type { FieldValueType } from '../form'
import type { AnyFn } from '../types'

export interface ProDataTableBaseColumn<RowData = any> extends Omit<TableBaseColumn<RowData>, 'key'> {
  /**
   * naive-ui 需要的 key，这里只做了类型的处理
   */
  key?: ExtractObjectPath<RowData> | ({} & string)
  /**
   * 同 key，工程化统一
   */
  path?: ExtractObjectPath<RowData> | ({} & string)
  /**
   * 显示在列右边的提示
   */
  tooltip?: string | string[]
  /**
   * 组件映射，需要通过 `ProConfigProvider` 的 `valueTypeMap` 映射
   */
  valueType?: FieldValueType
  /**
   * 组件的 props，自定义渲染时无效
   */
  fieldProps?: Record<string, any> | ((rowData: RowData, rowIndex: number) => Record<string, any>)
  /**
   * 组件的 slots，自定义渲染时无效
   */
  fieldSlots?: Record<string, AnyFn>
}

export interface ProDataTableColumnGroup<RowData = any> extends Omit<TableColumnGroup<RowData>, 'key' | 'children'> {
  tooltip?: string | string[]
  key?: ExtractObjectPath<RowData> | ({} & string)
  path?: ExtractObjectPath<RowData> | ({} & string)
  children: (ProDataTableBaseColumn<RowData> & { children?: ProDataTableColumnGroup<RowData>['children'] })[]
}

export interface ProDataTableIndexColumn<RowData = any> extends Omit<ProDataTableBaseColumn<RowData>, 'path' | 'key' | 'render' | 'type' | 'valueType' | 'fieldProps' | 'fieldSlots'> {
  /**
   * 序号列
   */
  type: 'index'
  /**
   * 自定义序号内容
   * @param index 序号
   * @param rowData 行数据
   * @param rowIndex 行索引
   */
  render?: (index: number, rowData: RowData, rowIndex: number) => VNodeChild
}

export interface ProDataTableExpandColumn<RowData = any> extends TableExpandColumn<RowData> {
  tooltip?: string | string[]
}

export type ProDataTableColumn<RowData = any> =
  | TableSelectionColumn<RowData>
  | ProDataTableBaseColumn<RowData>
  | ProDataTableIndexColumn<RowData>
  | ProDataTableColumnGroup<RowData>
  | ProDataTableExpandColumn<RowData>

export type ProDataTableColumns<RowData = any> = ProDataTableColumn<RowData>[]

export interface ProDataTableFieldSetting {
  /**
   * 页码字段
   * @default 'page'
   */
  pageField?: string
  /**
   * 分页大小字段
   * @default 'pageSize'
   */
  sizeField?: string
  /**
   * 数据字段
   * @default 'list'
   */
  listField?: string
  /**
   * 总数字段
   * @default 'total'
   */
  totalField?: string
}

export interface ToolbarDensitySetting {
  renderIcon?: () => VNodeChild
  default?: (DataTableProps['size'] & {})
}

export interface ToolbarReloadSetting {
  renderIcon?: () => VNodeChild
}

export interface ToolbarColumnSetting {
  /**
   * 是否可以拖拽
   */
  draggable?: boolean
  /**
   * 是否显示 checkbox
   */
  checkable?: boolean
  /**
   * 是否显示重置按钮
   */
  resetButton?: boolean
  /**
   * 是否显示序号列
   */
  indexColummn?: boolean
  renderIcon?: () => VNodeChild
}

export interface ProDataTableToolbarSetting {
  reload?: false | ToolbarReloadSetting
  density?: false | ToolbarDensitySetting
  columnSetting?: false | ToolbarColumnSetting
}
