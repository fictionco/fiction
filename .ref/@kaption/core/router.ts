import type { AppRouteParams } from '@factor/api'
import { AppRoute } from '@factor/api'

type KaptionRouteParams<T extends string> = AppRouteParams<T> & {
  menus?: string[]
}

export class KaptionRoute<T extends string> extends AppRoute<T> {
  constructor(params: KaptionRouteParams<T>) {
    super(params)
  }
}
