import type { FictionStripe } from './index'
import type { CustomerData } from './utils'
import { debounce, FictionObject, vue } from '@fiction/core'

type CustomerStateStatus = 'initializing' | 'ready' | 'error'

type CustomerStateData = {
  status: CustomerStateStatus
  error?: Error
  lastUpdated?: string
  data?: CustomerData
}

export type CustomerStateSettings = {
  fictionStripe: FictionStripe
  onStateChange?: (state: CustomerStateData) => void
  instanceId?: string
}

export class CustomerState extends FictionObject<CustomerStateSettings> {
  constructor(args: CustomerStateSettings) {
    super('CustomerState', args)
  }

  private state = vue.ref<CustomerStateData>({
    status: 'initializing',
  })

  private initPromise?: Promise<CustomerData>
  private orgWatcher?: vue.WatchStopHandle

  /**
   * Reactive computed property for easy access to customer data
   */
  readonly data = vue.computed<CustomerData | undefined>(() => this.state.value.data)

  /**
   * Reactive computed property for checking if customer data is ready
   */
  readonly isReady = vue.computed(() => this.state.value.status === 'ready')

  /**
   * Updates the internal state and triggers any listeners
   */
  private setState(newState: Partial<CustomerStateData>) {
    this.log.info('Customer state updated', { data: newState })

    this.state.value = {
      ...this.state.value,
      ...newState,
    }
    this.settings.onStateChange?.(this.state.value)
  }

  /**
   * Fetches fresh customer data from server
   */
  private async fetchCustomerData(): Promise<CustomerData> {
    try {
      const data = await this.settings.fictionStripe.requests.ManageCustomer.projectRequest({
        _action: 'retrieve',
      })

      if (data.status === 'error' || !data.data) {
        throw new Error(data.message || 'Failed to fetch customer data')
      }

      this.setState({ status: 'ready', data: data.data, lastUpdated: new Date().toISOString(), error: undefined })

      return data.data
    }
    catch (err) {
      const error = err as Error
      this.setState({ status: 'error', error })
      throw new Error('Failed to fetch customer data')
    }
  }

  /**
   * Initializes customer data with retries
   */
  async initialize(args: {
    caller: string
    retries?: number
  }): Promise<CustomerData | undefined> {
    const { caller = 'unknown', retries = 2 } = args

    // Skip if no window (server-side)
    if (typeof window === 'undefined') {
      this.log.warn('Customer initialization skipped: no window context', {
        data: { caller },
      })
      throw new Error('Cannot initialize customer in server context')
    }

    // Wait for user to be ready
    const user = await this.settings.fictionStripe.settings.fictionUser.userInitialized({ caller: 'stripe.customer' })

    if (!user) {
      this.log.warn('Customer initialization skipped: user not ready', { data: { caller } })
      return
    }

    // Return existing promise if initialization is in progress
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.initializeWithRetries({ retries, caller })

    try {
      const result = await this.initPromise
      this.setupAutoRefresh({ caller })
      return result
    }
    catch (error) {
      this.initPromise = undefined
      throw error
    }
    finally {
      this.initPromise = undefined
    }
  }

  /**
   * Initializes with retry logic
   */
  private async initializeWithRetries(args: {
    retries: number
    caller: string
  }): Promise<CustomerData> {
    const { retries, caller } = args

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.fetchCustomerData()
      }
      catch (error) {
        if (attempt === retries) {
          this.log.error('Customer initialization failed after retries', {
            error,
            data: { caller, attempts: attempt + 1 },
          })
          throw error
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
      }
    }
    throw new Error('Initialization failed')
  }

  /**
   * Sets up auto-refresh when org changes
   */
  private setupAutoRefresh(args: { caller: string }) {
    const { caller } = args
    this.cleanup()

    // Create debounced fetch function that maintains class context
    const debouncedFetch = debounce(async () => {
      try {
        await this.fetchCustomerData()
      }
      catch (error) {
        this.log.error('Failed to refresh customer data', { error })
      }
    }, 100)

    // Watch for org changes
    this.orgWatcher = vue.watch(
      () => this.settings.fictionStripe.settings.fictionUser.activeOrgId.value,
      (v, old) => {
        this.log.info(`ORG CHANGED, refreshing customer data`, {
          data: { caller, v, old },
        })
        debouncedFetch()
      },
    )
  }

  /**
   * Force refresh of customer data
   */
  async refresh(): Promise<CustomerData | undefined> {
    try {
      return await this.fetchCustomerData()
    }
    catch (error) {
      this.log.error('Manual refresh failed', { error })
      return undefined
    }
  }

  reset() {
    this.setState({
      status: 'initializing',
      error: undefined,
      data: undefined,
    })
    this.cleanup()
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.orgWatcher) {
      this.orgWatcher()
      this.orgWatcher = undefined
    }
  }
}
