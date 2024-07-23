import type { SwitchProps } from 'naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import type { MaybeExpression } from 'pro-components-hooks'
import { proFormItemProps } from '../../form-item'
import { proFieldProps } from '../../field'
import type { ExtendPublicProps } from '../../../types'

export const proSwitchProps = {
  /**
   * 继承属性
   */
  ...proFormItemProps,
  /**
   * 额外的字段属性
   */
  ...proFieldProps,
  fieldProps: {
    type: Object as PropType<MaybeExpression<ExtendPublicProps<Omit<
    SwitchProps,
    | 'value'
    | 'onUpdateValue'
    | 'onUpdate:value'
    | 'defaultValue'
    >>>>,
    default: () => ({}),
  },
} as const

export type ProSwitchProps = ExtractPublicPropTypes<typeof proSwitchProps>
