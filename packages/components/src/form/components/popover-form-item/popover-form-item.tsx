import type { SlotsType } from 'vue'
import type { ProPopoverFormItemSlots } from './slots'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { NEl, NPopover } from 'naive-ui'
import { computed, ref, useAttrs } from 'vue'
import { useValidationStatus } from '../field'
import { ProFormItem } from '../form-item'
import { proPopoverFormItemProps } from './props'

export default defineComponent({
  name: 'ProPopoverFormItem',
  inheritAttrs: false,
  props: proPopoverFormItemProps,
  slots: Object as SlotsType<ProPopoverFormItemSlots>,
  setup(props) {
    const attrs = useAttrs()
    const clickInside = ref(true)
    const formItemInstRef = ref()
    const { feedbacks, feedbackColor } = useValidationStatus()
    const formItemEl = computed(() => formItemInstRef.value?.$el as HTMLElement)

    const showPopover = computed(() => {
      const condition1 = !!clickInside.value
      const condition2 = !!feedbacks.value.length
      return condition1 && condition2
    })

    const proFormItemProps = computed(() => {
      const { popoverProps, ...rest } = props
      return {
        ...attrs,
        ...rest,
      }
    })

    useEventListener(formItemEl, 'click', () => {
      clickInside.value = true
    }, { capture: true })

    onClickOutside(formItemEl, () => {
      clickInside.value = false
    })

    return {
      feedbacks,
      showPopover,
      feedbackColor,
      formItemInstRef,
      proFormItemProps,
    }
  },
  render() {
    const popoverProps = this.$props.popoverProps ?? {}
    return (
      <NPopover
        placement="top-start"
        {...popoverProps}
        show={this.showPopover}
      >
        {{
          trigger: () => {
            return (
              <ProFormItem
                ref="formItemInstRef"
                {...this.proFormItemProps}
                v-slots={this.$slots}
              />
            )
          },
          default: () => {
            return this.feedbacks.map((f) => {
              return (
                <NEl
                  key={f.message}
                  style={{ color: this.feedbackColor }}
                >
                  { f.message }
                </NEl>
              )
            })
          },
        }}
      </NPopover>
    )
  },
})
