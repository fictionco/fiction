import { DataProcessor } from "@factor/types"

export const runProcessors = async <
  T = unknown,
  U extends Record<string, any> = Record<string, any>,
>(
  processors: DataProcessor<T, U>[],
  initial: T,
  meta: U,
): Promise<T> => {
  const callbacks = processors.map((_) => _.handler)

  let result = initial
  if (callbacks.length > 0) {
    for (const cb of callbacks) {
      result = await cb(result, meta)
    }
  }

  return result
}
