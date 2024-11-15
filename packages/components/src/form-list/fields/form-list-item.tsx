import type { PropType, SlotsType } from 'vue'
import type { ProButtonProps } from '../../button'
import type { ActionGuard } from '../props'
import type { ProFormListSlots } from '../slots'
import { CopyOutlined, DeleteOutlined } from '@vicons/antd'
import { useToggle } from '@vueuse/core'
import { omit } from 'lodash-es'
import { NEl, NFlex, NIcon, useThemeVars } from 'naive-ui'
import { useInjectListFieldContext } from 'pro-components-hooks'
import { computed, defineComponent, Fragment, inject, provide, toRef } from 'vue'
import { resolveSlotWithProps } from '../../_utils/resolve-slot'
import { ProButton } from '../../button'
import { useReadonlyHelpers } from '../../form/components'
import { useInjectProFormContext, useInjectProFormInst } from '../../form/context'
import { useLocale } from '../../locales'
import { AUTO_CREATE_ID, proFormListContextKey, useInjectProFormListInst } from '../context'
import { useProvidePath } from './composables/useProvidePath'

const Action = defineComponent({
  name: 'Action',
  props: {
    min: Number,
    max: Number,
    index: {
      type: Number,
      required: true,
    },
    copyButtonProps: {
      type: [Object, Boolean] as PropType<ProButtonProps | false>,
      default: undefined,
    },
    removeButtonProps: {
      type: [Object, Boolean] as PropType<ProButtonProps | false>,
      default: undefined,
    },
    path: Array as PropType<Array<string | number>>,
    actionGuard: Object as PropType<Partial<ActionGuard>>,
  },
  setup(props) {
    const form = useInjectProFormInst()!

    const {
      getMessage,
    } = useLocale('ProFormList')

    const {
      readonly,
    } = useReadonlyHelpers()

    const [
      removeLoading,
      setRemoveLoading,
    ] = useToggle()

    const [
      copyLoading,
      setCopyLoading,
    ] = useToggle()

    const {
      insert,
      remove: _remove,
      value: list,
    } = useInjectListFieldContext()!

    const showCopyButton = computed(() => {
      const { max, copyButtonProps } = props
      return !readonly.value
        && copyButtonProps !== false
        && list.value.length < (max ?? Number.POSITIVE_INFINITY)
    })

    const showRemoveButton = computed(() => {
      const { min, removeButtonProps } = props
      return !readonly.value
        && removeButtonProps !== false
        && list.value.length > (min ?? Number.NEGATIVE_INFINITY)
    })

    const getCopyButtonProps = computed<ProButtonProps>(() => {
      return {
        text: true,
        loading: copyLoading.value,
        tooltip: getMessage('copyThisLine'),
        renderIcon: () => {
          return (
            <NIcon>
              <CopyOutlined />
            </NIcon>
          )
        },
        ...(props.copyButtonProps ?? {}),
      }
    })

    const getRemoveButtonProps = computed<ProButtonProps>(() => {
      return {
        text: true,
        loading: removeLoading.value,
        tooltip: getMessage('removeThisLine'),
        renderIcon: () => {
          return (
            <NIcon>
              <DeleteOutlined />
            </NIcon>
          )
        },
        ...(props.removeButtonProps ?? {}),
      }
    })

    async function copy() {
      const { path, index, actionGuard } = props
      const { beforeAddRow, afterAddRow } = actionGuard ?? {}

      const insertIndex = index + 1
      const row = form.getFieldValue(path!) ?? {}

      if (beforeAddRow) {
        setCopyLoading(true)
        const success = await beforeAddRow({ index, insertIndex, total: list.value.length })
        if (success) {
          insert(insertIndex, omit(row, AUTO_CREATE_ID))
          if (afterAddRow) {
            afterAddRow({ index, insertIndex, total: list.value.length })
          }
        }
        setCopyLoading(false)
      }
      else {
        insert(insertIndex, omit(row, AUTO_CREATE_ID))
        if (afterAddRow) {
          afterAddRow({ index, insertIndex, total: list.value.length })
        }
      }
    }

    async function remove() {
      const { index, actionGuard } = props
      const { beforeRemoveRow, afterRemoveRow } = actionGuard ?? {}

      if (beforeRemoveRow) {
        setRemoveLoading(true)
        const success = await beforeRemoveRow({ index, total: list.value.length })
        if (success) {
          _remove(index)
          if (afterRemoveRow) {
            afterRemoveRow({ index, total: list.value.length })
          }
        }
        setRemoveLoading(false)
      }
      else {
        _remove(index)
        if (afterRemoveRow) {
          afterRemoveRow({ index, total: list.value.length })
        }
      }
    }
    return {
      copy,
      remove,
      showCopyButton,
      showRemoveButton,
      copyButtonProps: getCopyButtonProps,
      removeButtonProps: getRemoveButtonProps,
    }
  },
  render() {
    const copyButtonDom = this.showCopyButton
      ? (
          <ProButton
            {...this.copyButtonProps}
            onClick={this.copy}
          />
        )
      : null

    const removeButtonDom = this.showRemoveButton
      ? (
          <ProButton
            {...this.removeButtonProps}
            onClick={this.remove}
          />
        )
      : null

    return (
      <Fragment>
        {copyButtonDom}
        {removeButtonDom}
      </Fragment>
    )
  },
})

export default defineComponent({
  name: 'FormListItem',
  props: {
    min: Number,
    max: Number,
    actionGuard: Object as PropType<Partial<ActionGuard>>,
    index: {
      type: Number,
      required: true,
    },
    onlyShowFirstItemLabel: {
      type: Boolean,
      default: undefined,
    },
    copyButtonProps: {
      type: [Object, Boolean] as PropType<ProButtonProps | false>,
      default: undefined,
    },
    removeButtonProps: {
      type: [Object, Boolean] as PropType<ProButtonProps | false>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<ProFormListSlots>,
  setup(props) {
    const themeVars = useThemeVars()
    const action = useInjectProFormListInst()
    const nFormItem = inject<any>('n-form-item')

    const {
      path,
    } = useProvidePath(toRef(props, 'index'))

    const {
      validateBehavior,
    } = useInjectProFormContext()

    const {
      value: list,
    } = useInjectListFieldContext()!

    const total = computed(() => {
      return list.value.length
    })

    const showItemLabel = computed(() => {
      const { index, onlyShowFirstItemLabel } = props
      return onlyShowFirstItemLabel && index === 0
    })

    const actionHeight = computed<string>(() => {
      const {
        heightSmall,
        heightMedium,
        heightLarge,
      } = themeVars.value

      const sizeToHeightMap = {
        small: heightSmall,
        medium: heightMedium,
        large: heightLarge,
      } as any

      const size = nFormItem?.mergedSize?.value ?? 'medium'
      return sizeToHeightMap[size]
    })

    provide(proFormListContextKey, {
      showLabel: showItemLabel,
    })

    return {
      path,
      total,
      action,
      actionHeight,
      validateBehavior,
    }
  },
  render() {
    const {
      min,
      max,
      path,
      total,
      $props,
      $slots,
      action,
      actionHeight,
      validateBehavior,
    } = this

    const {
      index,
      actionGuard,
      copyButtonProps,
      removeButtonProps,
    } = $props

    const actionDom = (
      <Action
        min={min}
        max={max}
        path={path}
        index={index}
        actionGuard={actionGuard}
        copyButtonProps={copyButtonProps}
        removeButtonProps={removeButtonProps}
      />
    )

    const resolvedActionDom = resolveSlotWithProps($slots.action, {
      total,
      index,
      action,
      actionDom,
    }, () => (
      <NFlex
        style={{
          height: actionHeight,
          linHeight: actionHeight,
          marginBlockEnd: $slots.item || validateBehavior === 'popover'
            ? 0
            : 'var(--n-feedback-height)',
        }}
      >
        {actionDom}
      </NFlex>
    ))

    const itemDom = (
      <Fragment>
        {$slots.default?.({
          total,
          index,
          action,
        })}
      </Fragment>
    )

    return resolveSlotWithProps($slots.item, {
      total,
      index,
      action,
      itemDom,
      actionDom: resolvedActionDom,
    }, () => (
      <NEl
        style={{
          display: 'flex',
          gap: '0 16px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        {itemDom}
        {resolvedActionDom}
      </NEl>
    ))
  },
})
