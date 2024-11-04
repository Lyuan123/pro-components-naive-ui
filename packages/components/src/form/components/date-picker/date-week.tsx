import type { SlotsType } from 'vue'
import type { ProDatePickerSlots } from './slots'
import { useOverrideProps } from '../../../composables'
import { ProField, ValueTypeEnum } from '../field'
import DatePicker from './fields/date-picker'
import { useProDatePickerInst } from './inst'
import { proDatePickerProps } from './props'

const name = 'ProDateWeek'
export default defineComponent({
  name,
  props: proDatePickerProps,
  slots: Object as SlotsType<ProDatePickerSlots>,
  setup(props, { expose }) {
    const {
      exposed,
    } = useProDatePickerInst()

    const overridedProps = useOverrideProps(
      name,
      props,
    )

    expose(exposed)
    return {
      overridedProps,
    }
  },
  render() {
    return (
      <ProField
        ref="instRef"
        {...this.overridedProps}
        defaultValue={null}
        fieldProps={{
          ...(this.overridedProps.fieldProps ?? {}),
          type: 'week',
        }}
        valueType={ValueTypeEnum.DATE_WEEK}
      >
        {{
          ...this.$slots,
          input: (pureProps: any) => (
            <DatePicker
              {...pureProps}
              v-slots={this.$slots}
            />
          ),
        }}
      </ProField>
    )
  },
})
