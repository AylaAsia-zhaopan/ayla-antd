import type { Key } from '../../_util/type';
import type { DataEntity } from '../../vc-tree/interface';
import { conductCheck } from '../../vc-tree/utils/conductUtil';
import type { LabeledValueType, RawValueType } from '../TreeSelect';
import type { Ref, ShallowRef } from 'vue';
import { toRaw, shallowRef, watchEffect } from 'vue';

export default (
  rawLabeledValues: Ref<LabeledValueType[]>,
  rawHalfCheckedValues: Ref<LabeledValueType[]>,
  treeConduction: Ref<boolean>,
  keyEntities: Ref<Record<Key, DataEntity>>,
  maxLevel: Ref<number>,
  levelEntities: ShallowRef<Map<number, Set<DataEntity>>>,
) => {
  const newRawCheckedValues = shallowRef<RawValueType[]>([]);
  const newRawHalfCheckedValues = shallowRef<RawValueType[]>([]);

  watchEffect(() => {
    let checkedKeys: RawValueType[] = toRaw(rawLabeledValues.value).map(({ value }) => value);
    let halfCheckedKeys: RawValueType[] = toRaw(rawHalfCheckedValues.value).map(
      ({ value }) => value,
    );

    const missingValues = checkedKeys.filter(key => !keyEntities.value[key]);

    if (treeConduction.value) {
      ({ checkedKeys, halfCheckedKeys } = conductCheck(
        checkedKeys,
        true,
        keyEntities.value,
        maxLevel.value,
        levelEntities.value,
      ));
    }
    newRawCheckedValues.value = Array.from(new Set([...missingValues, ...checkedKeys]));
    newRawHalfCheckedValues.value = halfCheckedKeys;
  });
  return [newRawCheckedValues, newRawHalfCheckedValues];
};
