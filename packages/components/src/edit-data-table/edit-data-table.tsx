import type { SlotsType } from 'vue'
import type { ProEditDataTableProps } from './props'
import type { ProEditDataTableSlots } from './slots'
import { computed, defineComponent } from 'vue'
import { useNaiveClsPrefix } from '../_internal/useClsPrefix'
import { useMountStyle } from '../_internal/useMountStyle'
import { keep } from '../_utils/keep'
import { useOverrideProps } from '../composables'
import { pickProListFieldSharedProps, ProField } from '../form'
import EditDataTable from './components/edit-data-table'
import { provideEditDataTableInstStore } from './inst'
import { internalEditDataTablePropKeys, proEditDataTableProps } from './props'
import style from './styles/index.cssr'

const name = 'ProEditDataTable'
export default defineComponent({
  name,
  props: proEditDataTableProps,
  slots: Object as SlotsType<ProEditDataTableSlots>,
  setup(props, { expose }) {
    const {
      exposed,
    } = provideEditDataTableInstStore()

    const overridedProps = useOverrideProps<ProEditDataTableProps>(
      name,
      props,
    )

    const mergedClsPrefix = useNaiveClsPrefix()

    const proFieldProps = computed(() => {
      return pickProListFieldSharedProps(overridedProps.value)
    })

    const internalEditDataTableProps = computed(() => {
      const {
        // #region 冲突的属性
        size,
        theme,
        title,
        tooltip,
        themeOverrides,
        builtinThemeOverrides,
        // #endregion
        ...restProps
      } = overridedProps.value

      return keep(
        restProps,
        internalEditDataTablePropKeys,
      )
    })

    useMountStyle(
      name,
      'pro-edit-data-table',
      style,
      mergedClsPrefix,
    )

    expose(exposed)
    return {
      proFieldProps,
      mergedClsPrefix,
      internalEditDataTableProps,
    }
  },
  render() {
    const {
      $props,
      mergedClsPrefix,
    } = this

    return (
      <ProField
        class={[
          `${mergedClsPrefix}-pro-edit-data-table-wrapper`,
          {
            [`${mergedClsPrefix}-pro-edit-data-table-wrapper--flex-height`]: $props.flexHeight,
          },
        ]}
        {...this.proFieldProps}
        isList={true}
        valueModelName=""
        fieldProps={this.internalEditDataTableProps}
      >
        {{
          input: (pureProps: any) => {
            return (
              <EditDataTable
                class={[`${mergedClsPrefix}-pro-edit-data-table`]}
                {...pureProps}
                extraProFieldConfig={{
                  validateBehavior: this.proFieldProps.validateBehavior,
                  validateBehaviorProps: this.proFieldProps.validateBehaviorProps,
                }}
                v-slots={this.$slots}
              />
            )
          },
        }}
      </ProField>
    )
  },
})
