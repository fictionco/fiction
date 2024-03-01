import { vue } from '@factor/api'
import type { ActivityStatus, AimInstanceStatus } from './types'
import type { FictionInstance } from '.'

export function getServerUiState(fictionInstance: FictionInstance) {
  return vue.computed(() => {
    const st = fictionInstance.instanceState.value

    const status = st.status || 'off'
    return status
  })
}

export function getButtonColors(args: {
  status: ActivityStatus | AimInstanceStatus
  state: 'hover' | 'normal' | 'active'
}) {
  const { status, state } = args
  let out: {
    wrapper?: string
    icon?: string
    alt?: string
    wrapperActive?: string
    wrapperHover?: string
    wrapperNormal?: string
  } = {}
  if (status === 'starting') {
    out = {
      wrapper:
        'bg-primary-100 hover:bg-primary-100 text-primary-600 border-primary-300',
      icon: 'bg-primary-500',
      alt: '',
    }
  }
  else if (status === 'running') {
    out = {
      wrapper: ' text-green-600 border-green-300',
      wrapperNormal: 'bg-green-50 hover:bg-green-100',
      wrapperActive: 'bg-green-100',
      icon: 'bg-green-400',
      alt: '',
    }
  }
  else if (status === 'busy') {
    out = {
      wrapper:
        'bg-primary-100 hover:bg-primary-100 text-primary-700 border-primary-300',
      icon: 'bg-primary-400',
      alt: '',
    }
  }
  else if (status === 'idle') {
    out = {
      wrapper:
        'bg-yellow-100 hover:bg-yellow-100 text-yellow-600 border-yellow-300',
      icon: 'bg-yellow-400',
      alt: '',
    }
  }
  else if (status === 'error') {
    out = {
      wrapper: 'bg-rose-100 hover:bg-rose-100 text-rose-600 border-rose-300',
      icon: 'bg-rose-400',
      alt: '',
    }
  }
  else {
    out = {
      wrapper: 'bg-gradient-to-b  border-theme-300 text-theme-400',
      wrapperActive: 'from-theme-100 via-theme-100 to-theme-50',
      wrapperNormal: 'from-theme-0 via-theme-0 to-theme-50',
      icon: 'bg-primary-400',
      alt: '',
    }
  }

  if (state === 'active' && out.wrapperActive)
    out.wrapper = `${out.wrapper} ${out.wrapperActive}`
  else if (out.wrapperNormal)
    out.wrapper = `${out.wrapper} ${out.wrapperNormal}`

  return out
}
