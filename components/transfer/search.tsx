import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import Input from '../input';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import type { ChangeEvent } from '../_util/EventInterface';

export const transferSearchProps = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleClear: PropTypes.func,
  disabled: PropTypes.looseBool,
  onChange: PropTypes.func,
};

export type TransferSearchProps = Partial<ExtractPropTypes<typeof transferSearchProps>>;

export default defineComponent({
  name: 'Search',
  inheritAttrs: false,
  props: initDefaultProps(transferSearchProps, {
    placeholder: '',
  }),
  emits: ['change'],
  setup(props, { emit }) {
    const handleChange = (e: ChangeEvent) => {
      emit('change', e);
      if (e.target.value === '') {
        props.handleClear?.();
      }
    };

    return () => {
      const { placeholder, value, prefixCls, disabled } = props;
      return (
        <Input
          placeholder={placeholder}
          class={prefixCls}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          allowClear
          v-slots={{ prefix: () => <SearchOutlined /> }}
        />
      );
    };
  },
});
