import type { ComputedRef } from 'vue'
import { computed, ref, watch } from 'vue'
import type { TreeOption } from 'naive-ui'
import type { ProTreeProps } from './props'

export interface UseExpandKeysOptions {
  /**
   * key 对应树节点的映射表
   */
  keyToTreeNodeMap: ComputedRef<Map<string | number, TreeOption>>
}
export function useExpandKeys(props: ProTreeProps, options: UseExpandKeysOptions) {
  const { keyToTreeNodeMap } = options
  const expandedKeys = ref<Array<string | number>>([])

  watch(
    computed(() => props.expandedKeys),
    (keys) => { expandedKeys.value = keys ?? [] },
    { immediate: true },
  )

  function doUpdateExpandedKeys(keys: Array<string | number>, ...args: any[]) {
    const {
      onUpdateExpandedKeys,
      'onUpdate:expandedKeys': _onUpdateExpandedKeys,
    } = props

    expandedKeys.value = keys
    onUpdateExpandedKeys && (onUpdateExpandedKeys as any)(keys, ...args)
    _onUpdateExpandedKeys && (_onUpdateExpandedKeys as any)(keys, ...args)
  }

  function expandKeys(keys?: Array<string | number>) {
    const map = keyToTreeNodeMap.value
    if (keys) {
      keys = keys.filter(k => map.get(k))
    }
    expandedKeys.value = keys ?? [...map.keys()]
  }

  return {
    expandedKeys,
    expandKeys,
    doUpdateExpandedKeys,
  }
}
