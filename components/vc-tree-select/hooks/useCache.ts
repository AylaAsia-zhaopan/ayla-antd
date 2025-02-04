import type { Ref } from 'vue';
import { toRaw, computed, shallowRef } from 'vue';
import type { LabeledValueType, RawValueType } from '../TreeSelect';

/**
 * This function will try to call requestIdleCallback if available to save performance.
 * No need `getLabel` here since already fetch on `rawLabeledValue`.
 */
export default (values: Ref<LabeledValueType[]>): [Ref<LabeledValueType[]>] => {
  const cacheRef = shallowRef({
    valueLabels: new Map<RawValueType, any>(),
  });

  const newFilledValues = computed(() => {
    const { valueLabels } = cacheRef.value;
    const valueLabelsCache = new Map<RawValueType, any>();

    const filledValues = toRaw(values.value).map(item => {
      const { value } = item;
      const mergedLabel = item.label ?? valueLabels.get(value);

      // Save in cache
      valueLabelsCache.set(value, mergedLabel);

      return {
        ...item,
        label: mergedLabel,
      };
    });

    cacheRef.value.valueLabels = valueLabelsCache;

    return filledValues;
  });
  return [newFilledValues];
};
