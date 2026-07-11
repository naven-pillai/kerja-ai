'use client';

import { Dispatch, SetStateAction } from 'react';

export function useStepForm<T>(
  fullData: T,
  setFullData: Dispatch<SetStateAction<T>>
) {
  function getStepData<K extends keyof T>(fields: K[]): Pick<T, K> {
    const stepData = {} as Pick<T, K>;
    for (const key of fields) {
      stepData[key] = fullData[key];
    }
    return stepData;
  }

  function getStepHandler<K extends keyof T>() {
    return (field: K, value: T[K]) => {
      setFullData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  return { getStepData, getStepHandler };
}
