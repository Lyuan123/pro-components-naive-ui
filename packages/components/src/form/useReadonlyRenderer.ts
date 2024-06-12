import type { ComputedRef } from 'vue'
import { inject } from 'vue'
import { proFormMergedConfigContextKey } from './context'

interface UseReadonlyRendererOptions {
  type: string
  value: ComputedRef<any>
  props: ComputedRef<Record<string, any>>
  slots: ComputedRef<Record<string, any>>
}
export function useReadonlyRenderer(options: UseReadonlyRendererOptions) {
  const config = inject(proFormMergedConfigContextKey)
  const { type, value, props, slots } = options

  function readonlyRender() {
    const { readonly: userReadonly } = slots.value
    return userReadonly
      ? userReadonly({ value: value.value })
      : config?.value.readonlyRender?.(value.value, {
        type,
        props: props.value,
        slots: slots.value,
      })
  }

  function readonlyEmptyRender() {
    const { empty: userEmpty } = slots.value
    return userEmpty
      ? userEmpty({ value: value.value })
      : config?.value.readonlyEmptyRender?.({
        type,
        props: props.value,
        slots: slots.value,
      })
  }

  return {
    readonlyRender,
    readonlyEmptyRender,
  }
}
