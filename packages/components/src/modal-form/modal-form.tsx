import type { SlotsType } from 'vue'
import type { ProFormProps } from '../form'
import type { ProModalProps } from '../modal/props'
import type { ProModalFormProps } from './props'
import type { ProModalFormSlots } from './slots'
import { NFlex } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useNaiveClsPrefix } from '../_internal/useClsPrefix'
import { useMountStyle } from '../_internal/useMountStyle'
import { keep } from '../_utils/keep'
import { keysOf } from '../_utils/keysOf'
import { resolveSlotWithProps, resolveWrappedSlotWithProps } from '../_utils/resolveSlot'
import { useOverrideProps } from '../composables'
import { ProForm } from '../form'
import { proFormPropKeys } from '../form/props'
import { ProModal } from '../modal'
import { proModalProps as _proModalProps } from '../modal/props'
import Footer from './components/footer'
import { createProModalForm } from './composables/createProModalForm'
import { proModalFormProps } from './props'
import style from './styles/index.cssr'

const name = 'ProModalForm'
export default defineComponent({
  name,
  props: proModalFormProps,
  slots: Object as SlotsType<ProModalFormSlots>,
  setup(props) {
    // 手动标注类型,防止因为类型复杂导致构建类型声明文件失败,先用 any 解决
    let form = props.form as any
    if (!form && __DEV__) {
      form = createProModalForm()
    }

    const overridedProps = useOverrideProps<ProModalFormProps>(
      name,
      props,
    )

    const mergedClsPrefix = useNaiveClsPrefix()

    const proFormProps = computed<ProFormProps>(() => {
      return keep(overridedProps.value, proFormPropKeys)
    })

    const proModalProps = computed<ProModalProps>(() => {
      const {
        // #region 冲突的属性
        size,
        theme,
        themeOverrides,
        builtinThemeOverrides,
        // #endregion
        preset,
        proModalProps,
        ...restProps
      } = overridedProps.value

      return {
        ...(proModalProps ?? {}),
        ...keep(restProps, keysOf(_proModalProps)),
        'footer': undefined,
        'show': form.show.value,
        'onUpdateShow': undefined,
        'onAfterLeave': onAfterLeave,
        'onUpdate:show': doUpdateShow,
        'preset': preset ? 'card' : undefined,
      }
    })

    function onAfterLeave() {
      const {
        onAfterLeave,
        restoreValuesOnClosed,
      } = overridedProps.value

      if (restoreValuesOnClosed) {
        form.restoreFieldsValue()
      }

      onAfterLeave && onAfterLeave()
    }

    function doUpdateShow(val: boolean) {
      if (val) {
        form.open()
        return
      }
      if (
        form.submiting.value
        && !overridedProps.value.closeOnSubmiting
      ) {
        return
      }
      form.close()
    }

    useMountStyle(
      name,
      'pro-modal-form',
      style,
      mergedClsPrefix,
    )

    return {
      form,
      proFormProps,
      proModalProps,
      mergedClsPrefix,
      footer: computed(() => overridedProps.value.footer),
      resetButtonProps: computed(() => overridedProps.value.resetButtonProps),
      submitButtonProps: computed(() => overridedProps.value.submitButtonProps),
    }
  },
  render() {
    return (
      <ProModal
        class={[
          `${this.mergedClsPrefix}-pro-modal-form`,
        ]}
        style={{
          width: this.width ?? '520px',
          maxHeight: this.maxHeight ?? '80%',
        }}
        {...this.proModalProps}
      >
        {{
          ...this.$slots,
          default: (options: { draggableClass: string }) => {
            return resolveWrappedSlotWithProps(this.$slots.default, { options }, (children) => {
              return (
                <ProForm {...this.proFormProps}>
                  {children}
                </ProForm>
              )
            })
          },
          footer: () => {
            if (this.footer === false) {
              return null
            }

            const footerDom = (
              <Footer
                form={this.form}
                resetButtonProps={this.resetButtonProps}
                submitButtonProps={this.submitButtonProps}
              />
            )

            return resolveSlotWithProps(this.$slots.footer, {
              footerDom,
            }, () => {
              return this.footer
                ? this.footer({ footerDom })
                : <NFlex justify="flex-end" size="small">{footerDom}</NFlex>
            })
          },
        }}

      </ProModal>
    )
  },
})
