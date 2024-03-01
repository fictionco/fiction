// @unocss-include
import { Buffer } from 'node:buffer'
import type {
  EndpointResponse,
  EndpointServer,
  ErrorConfig,
  FactorApp,
  FactorAws,
  FactorDb,
  FactorPluginSettings,
  FactorServer,
  FactorUser,
  NodeSocketServer,
} from '@factor/api'
import {
  ClientSocket,
  FactorPlugin,
  camelKeys,
  createSocketServer,
  toLabel,
  vue,
} from '@factor/api'
import type {
  DescribeInstancesRequest,
  InstanceStateChange,
} from '@aws-sdk/client-ec2'
import {
  DescribeInstanceStatusCommand,
  DescribeInstancesCommand,
  EC2Client,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2'
import type { FactorCache } from '@factor/api/plugin-cache'
import { slackNotify } from '../monitor'
import type { FictionPayment } from '../plugin-payment'
import type { TableJobConfig } from '../tables'
import type { FictionJobs } from '../plugin-jobs'
import type { FictionPush } from '../plugin-push'
import type { FictionUsage } from '../plugin-usage'
import { QueryManageInstance } from './endpoint'
import type { AimInstanceStatus, CurrentInstanceDescription } from './types'

export type SocketEventMap = {
  state: {
    req: object
    res: Partial<CurrentInstanceDescription>
  }
  job: {
    req: object
    res: Partial<TableJobConfig>
  }
}

type SubscribeMap =
  | { topic: 'state', data: Partial<CurrentInstanceDescription> }
  | { topic: 'job', data: Partial<TableJobConfig> }
  | {
    topic: 'status'
    data: Partial<TableJobConfig>
  }

export type FictionInstanceSettings = {
  factorApp: FactorApp
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorAws: FactorAws
  factorCache: FactorCache
  fictionPayment: FictionPayment
  fictionJobs: FictionJobs
  fictionUsage: FictionUsage
  fictionPush: FictionPush
  socketPort: number
  socketUrlLive: string
  isTest?: boolean
} & FactorPluginSettings

export class FictionInstance extends FactorPlugin<FictionInstanceSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorAws = this.settings.factorAws
  factorCache = this.settings.factorCache
  fictionPush = this.settings.fictionPush
  fictionPayment = this.settings.fictionPayment
  fictionJobs = this.settings.fictionJobs
  fictionUsage = this.settings.fictionUsage
  region = 'us-west-2'
  aimPort = 9000
  root = this.utils.safeDirname(import.meta.url)
  isTest = this.settings.isTest
  isLive = this.factorEnv.isProd
  instanceExpireAfterSeconds = 60 * 25 // 25 minutes, change to plan dependent
  instanceTerminateAfterSeconds = 60 * 60 * 12 // 12 hours, change to plan dependent
  cache = () => this.factorCache.getCache()
  progressMode = vue.computed(() =>
    this.factorEnv.isProd.value ? 'live' : 'local',
  )

  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  clientOrgStates = vue.ref<
    Record<string, Partial<CurrentInstanceDescription>>
  >({},
  )

  organizationId = vue.computed(() => {
    return this.factorUser.activeOrganizationId.value || ''
  })

  instanceState = vue.computed(() => {
    return this.clientOrgStates.value[this.organizationId.value] || {}
  })

  instanceActiveJob = vue.computed(() => {
    return this.instanceState.value.activeJob
  })

  liveJob = vue.ref<Partial<TableJobConfig>>()
  activeJob = vue.computed(() => {
    let job = this.instanceActiveJob.value
    if (job?.jobId && this.liveJob.value?.jobId === job?.jobId)
      job = { ...job, ...this.liveJob.value }

    return job
  })

  activeServers = vue.ref<Record<string, boolean>>({})
  stateLoading = vue.ref(false)
  socketPort = this.settings.socketPort
  socketUrlLocal = vue.ref(`http://localhost:${this.socketPort}`)
  socketUrlLive = this.settings.socketUrlLive
  serverUrl = vue.computed(() => {
    const isLive = this.isLive.value || false
    return isLive && this.socketUrlLive
      ? this.socketUrlLive
      : this.socketUrlLocal.value
  })

  endpointServer?: EndpointServer
  serverSocket?: NodeSocketServer<SocketEventMap>
  clientSocket?: ClientSocket<SocketEventMap>
  mode = this.factorEnv.mode.value
  pubsubKey = vue.computed(
    () => `${this.progressMode.value}:pubsub:instance_state`,
  )

  notificationPubsubKey = vue.computed(
    () => `${this.progressMode.value}:pubsub:notification`,
  )

  instanceKey = (organizationId: string) => `instance:${organizationId}`
  instanceIdKey = (organizationId: string) => `instance_id:${organizationId}`
  activeJobKey = (organizationId: string) => `${organizationId}:active_job`
  showServerModal = vue.ref(false)
  constructor(settings: FictionInstanceSettings) {
    super('FictionInstance', settings)

    this.factorEnv?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])
  }

  async dev() {
    const isApp = this.factorEnv.isApp.value

    if (isApp)
      await this.initApp()
    else
      await this.initServer()
  }

  /**
   * @server
   * - runs a polling loop to look for expired instances
   * - creates a socket server
   * - subscribes to pubsub events
   */
  async initServer() {
    await this.serverPoll()
    await this.createSocketServer()

    await this.factorCache.subscribe<SubscribeMap>(
      this.pubsubKey.value,
      async (payload) => {
        const { organizationId, topic, sentFrom } = payload

        if (topic === 'job' || topic === 'state') {
          const data = payload.data
          const server = this.serverSocket

          if (!server)
            throw new Error('server socket not initialized')
          if (!organizationId) {
            this.log.error('organizationId required', { data: payload })
            return
          }
          const _sentFrom = `r-${sentFrom}-s-${this.factorEnv.mode.value}`
          const channels = [organizationId]

          server.send({ channels, event: topic, data, sentFrom: _sentFrom })
        }
        else if (topic === 'status') {
          const data = payload.data as Partial<TableJobConfig>
          const {
            status = '',
            userId,
            notifyMode,
            url,
            jobType,
            completedAt,
          } = data
          this.log.warn('STATUS DATA', { data })
          if (notifyMode && ['ready', 'error'].includes(status)) {
            await slackNotify({
              message: `usage: ${jobType} by ${userId} completed with status ${status}`,
              factorEnv: this.factorEnv,
            })
            if (userId) {
              await this.fictionPush.queries.ManagePushNotify.serve(
                {
                  _action: 'send',
                  notification: {
                    title: `${toLabel(jobType)} completed with status ${toLabel(
                      status,
                    )}`,
                    body: `At ${this.utils.standardTime(completedAt)}`,
                    url,
                  },
                  userId,
                  notifyMode,
                },
                { server: true },
              )
            }
            else {
              this.log.warn('no userId in status', { data })
            }

            if (status === 'error') {
              const data = payload.data as {
                error: ErrorConfig
                organizationId: string
              }

              this.log.error('instance error via pub', {
                error: data.error,
                data: { organizationId: data.organizationId },
              })
            }
          }
        }
      },
    )
  }

  async initApp() {
    await this.createClientSocket()
    await this.clientStateLoop()
  }

  /**
   * @client
   * - connects client to socket server
   * - creates a polling loop to keep state in sync with server
   * - listens for messages from server
   */
  setClientOrganizationState(
    organizationId?: string,
    state?: Partial<CurrentInstanceDescription>,
  ) {
    if (!organizationId || !state)
      return
    this.clientOrgStates.value = {
      ...this.clientOrgStates.value,
      [organizationId]: this.utils.camelKeys(state),
    }
  }

  setStateLoading(durationSeconds: number = 15) {
    this.stateLoading.value = true
    setTimeout(() => {
      this.stateLoading.value = false
    }, durationSeconds * 1000)
  }

  /**
   * @client
   * polls the server for instance state, makes sure it doesn't get out of sync
   */
  async clientStateLoop() {
    await this.clientValidateState()
    // update socket connection or create new if disconnected
    await this.clientSocket?.getSocket()
    // polling loop
    setTimeout(() => {
      this.clientStateLoop().catch(console.error)
    }, 3000)
  }

  /**
   * @client
   * get instance state in client
   */
  async clientValidateState() {
    const user = await this.factorUser.userInitialized()
    if (!user)
      return

    let result = await this.instanceRequest('retrieve')

    const percentUsage = this.fictionUsage.activeUsage.value?.percentUsed || 0
    if (result?.data?.isRunning && percentUsage > 105)
      result = await this.instanceRequest('stop', { reason: 'overage' })

    const instanceDetails = result?.data
    const organizationId = instanceDetails?.organizationId
    this.setClientOrganizationState(organizationId, instanceDetails)
  }

  /**
   * @server
   * polls for expired instances
   */
  async serverPoll() {
    await this.checkForExpiredInstances()
    await this.runQueuedJobs()
    // polling loop
    setTimeout(() => {
      this.serverPoll().catch(console.error)
    }, 30_000)
  }

  async pingActive(organizationId: string) {
    const cache = this.cache()
    if (!cache)
      throw new Error('cache not initialized')
    await cache.zadd(`instance:expire`, this.pyTime(), organizationId)
    await cache.zadd(`instance:terminate`, this.pyTime(), organizationId)
  }

  async saveJob(jobConfig: Partial<TableJobConfig>) {
    return await this.fictionJobs.queries.ManageJobs.serve(
      {
        _action: 'update',
        jobConfig,
      },
      { server: true },
    )
  }

  async reportProgress(
    organizationId: string,
    jobConfig: Partial<TableJobConfig>,
    options: { saveToDb?: boolean } = {},
  ) {
    const { jobId } = jobConfig

    if (!organizationId)
      throw this.stop('organizationId required')

    if (!jobId) {
      this.log.error('couldnt report progress, no jobId', { data: jobConfig })
      return
    }

    this.log.info(`publish at ${this.pubsubKey.value}`)

    this.factorCache.publish<Record<string, unknown> | undefined>({
      key: this.pubsubKey.value,
      organizationId,
      topic: 'job',
      data: jobConfig,
      sentFrom: 'reportProgress',
    })

    if (options.saveToDb)
      await this.saveJob(jobConfig)
  }

  async serverIsReady(organizationId: string) {
    const details = await this.ec2DescribeInstance({ organizationId })

    return details?.isRunning || false
  }

  /**
   * @server
   * Starts the server. Must be very careful to not start multiple servers
   * Checks the state with AWS
   */
  async startServer(args: {
    organizationName?: string
    organizationId: string
    userId?: string
    idleTimeoutMinutes?: number
  }): Promise<EndpointResponse<CurrentInstanceDescription>> {
    const { organizationId, organizationName, userId, idleTimeoutMinutes }
      = args

    const now = this.pyTime()

    const details = await this.ec2DescribeInstance({ organizationId })

    this.log.info('CHECK START SERVER', {
      data: { organizationId, details },
    })

    let instanceId = details?.instanceId
    let message = ''

    if (this.isTest) {
      return { status: 'success', data: details, message: 'test mode' }
    }
    else if (details?.isStopping) {
      message = 'server is stopping'
      return { status: 'success', data: details, message }
    }
    else if (details && (details.isStarting || details.isRunning)) {
      this.log.info('SERVER UP. NO SERVER NEEDED', { data: { details } })
      message = details.isStarting ? 'server is starting' : 'server is running'
      return { status: 'success', data: details, message }
    }
    else if (details && details.isStopping) {
      this.log.info('SERVER STOPPING HAVE TO WAIT', { data: { details } })
      return { status: 'error', data: details, message: 'server is stopping' }
    }
    else if (details && details.isStopped && instanceId) {
      this.log.info('RESTART SERVER')
      const client = this.getEc2Client()
      const command = new StartInstancesCommand({
        InstanceIds: [instanceId],
      })
      const r = await client.send(command)

      this.log.info('RESTART RESULT', { data: r })
    }
    else {
      this.log.info('RUNNING SERVER')

      this.activeServers.value[organizationId] = true

      instanceId = await this.ec2StartInstance([
        { Key: 'organization_id', Value: organizationId },
        { Key: 'user_id', Value: userId || 'not_set' },
        { Key: 'started_at', Value: this.utils.displayDateTime(now) },
        {
          Key: 'deploy_mode',
          Value: this.factorEnv.mode.value || 'development',
        },
        {
          Key: 'progress_mode',
          Value: this.progressMode.value || 'live',
        },
        {
          Key: 'Name',
          Value: `${organizationName || 'No Name'} (${organizationId})`,
        },
        { Key: 'organization_name', Value: organizationName || 'not_set' },
        {
          Key: 'idle_timeout_minutes',
          Value: idleTimeoutMinutes ? String(idleTimeoutMinutes) : '20',
        },
      ])
    }
    const nowIso = this.utils.dayjs().toISOString()
    const jobConfig: Partial<TableJobConfig> = {
      userId,
      organizationId,
      progressId: 'start',
      jobType: 'start',
      instanceId,
      requestedAt: nowIso,
      startedAt: nowIso,
      status: 'processing',
      percent: 0,
      title: 'Start AI Server',
      message: 'initializing server',
      inputs: {},
      processor: 'server',
      notifyMode: 'contextual',
    } as const

    const job = await this.manageActiveJob({
      organizationId,
      jobConfig,
      _action: 'create',
    })

    const currentInstanceDescription = await this.ec2DescribeInstance({
      organizationId,
    })

    return {
      status: 'success',
      data: currentInstanceDescription,
      message: 'server is starting',
      job,
    }
  }

  async manageActiveJob(args: {
    organizationId: string
    _action: 'update' | 'retrieve' | 'complete' | 'create'
    jobConfig?: Partial<TableJobConfig>
  }): Promise<undefined | Partial<TableJobConfig>> {
    if (!this.factorCache)
      throw new Error('no factorCache')

    const { organizationId, jobConfig, _action } = args

    const key = this.activeJobKey(organizationId)

    if ((_action === 'complete' || _action === 'update') && !jobConfig)
      throw new Error(`jobConfig is required for _action: ${_action}`)

    if (_action === 'create' && jobConfig) {
      const result = await this.fictionJobs.queries.ManageJobs.serve(
        { _action: 'create', jobConfig },
        { server: true },
      )

      const dbJobConfig = result.data

      if (dbJobConfig)
        await this.factorCache.setVal(key, dbJobConfig)

      return dbJobConfig
    }
    else {
      const existingValue = (await this.factorCache.getVal(key)) || undefined

      if (_action === 'update' && jobConfig) {
        await this.reportProgress(organizationId, jobConfig)
        await this.pingActive(organizationId)
        await this.factorCache.setVal(key, jobConfig)
        return jobConfig
      }
      else if (_action === 'complete' && jobConfig) {
        await this.reportProgress(organizationId, jobConfig, { saveToDb: true })
        const cache = this.factorCache.getCache()
        await cache?.del(key)
        return undefined
      }
      else if (_action === 'retrieve') {
        return existingValue
      }
    }
  }

  async runQueuedJobs(): Promise<TableJobConfig[][]> {
    this.log.info('RUN QUEUED JOBS', {
      data: { activeServers: this.activeServers.value },
    })
    const promises = Object.keys(this.activeServers.value).map(
      async (organizationId) => {
        const d = await this.ec2DescribeInstance({
          organizationId,
        })

        if (!d?.isRunning && !d?.isStarting) {
          this.log.warn('removing activeServers server', {
            data: { organizationId, d },
          })
          delete this.activeServers.value[organizationId]
          return []
        }

        // get requested jobs
        const jobList = await this.fictionJobs.queries.ListJobs.serve(
          {
            _action: 'list',
            organizationId,
            filters: [
              { field: 'status', value: 'requested', operator: '=' },
              { field: 'isQueued', value: true, operator: '=' },
            ],
          },
          { server: true },
        )

        const jobCount = jobList.data?.length || 0
        const jobs = jobList.data || []
        const nextJob = jobs[0]

        if (jobCount > 0) {
          this.log.info('FOUND QUEUED JOBS', { data: { jobList } })

          if (nextJob && d?.isRunning && !d?.activeJob)
            await this.instanceJobRequest({ jobConfig: nextJob })
        }

        return jobs
      },
    )

    return await Promise.all(promises)
  }

  async handleandReportServers(args: {
    organizationId: string
  }): Promise<CurrentInstanceDescription | undefined> {
    const { organizationId } = args

    const d = await this.ec2DescribeInstance({
      organizationId,
    })

    let job: Partial<TableJobConfig> | undefined
    if (d?.isStarting) {
      const est = 240
      const secondsSinceLaunch = d?.secondsSinceLaunch || 0
      const percent = Math.min(
        Math.round((secondsSinceLaunch / est) * 100),
        100,
      )
      job = {
        ...d.activeJob,
        progressId: 'start',
        status: 'processing',
        percent,
        message: 'starting AI server',
      }
      this.log.info('reporting server status', { data: { d } })

      d.activeJob = await this.manageActiveJob({
        _action: 'update',
        organizationId,
        jobConfig: job,
      })
    }
    else if (d?.isRunning && d.activeJob?.progressId === 'start') {
      d.activeJob = await this.manageActiveJob({
        _action: 'complete',
        organizationId,
        jobConfig: {
          ...d.activeJob,
          status: 'ready',
          percent: 100,
          message: 'server is up',
        },
      })

      await this.runQueuedJobs()
    }

    return d
  }

  async verifyServerActive(args: { withModal?: boolean } = {}) {
    const { withModal } = args
    const state = this.instanceState.value

    const active = state.isRunning

    if (!active && withModal)
      this.showServerModal.value = true

    return active
  }

  /**
   * @server
   * gets redis expired keys based on a range
   */
  getExpiredKeys = async (key: string, range: number): Promise<string[]> => {
    const cache = this.cache()
    if (!cache)
      throw new Error('no cache')
    const redisQuery = cache
      .multi()
      .zrangebyscore(key, 0, range)
      .zremrangebyscore(key, 0, range)

    const r = (await redisQuery.exec()) ?? []

    const results = r.map(val => val[1])

    const [expired] = results as [string[], number]

    return expired
  }

  /**
   * @server
   * checks for expired instance keys (haven't been updated in 15 minutes)
   */
  checkForExpiredInstances = async (): Promise<void> => {
    const cache = this.cache()
    if (!cache)
      throw new Error('no cache')

    const expInstanceTime = this.pyTime() - this.instanceExpireAfterSeconds
    const expiredInstances = await this.getExpiredKeys(
      `instance:expire`,
      expInstanceTime,
    )

    this.log.info(`checking expired instances (${expiredInstances.length})`, {
      data: { expiredInstances },
    })

    if (expiredInstances.length > 0) {
      expiredInstances.forEach(async (organizationId) => {
        const min = Math.round(this.instanceExpireAfterSeconds / 60)
        await this.ec2ExpireInstance({
          _action: 'stop',
          organizationId,
          message: `stopped after idle for ${min} minutes`,
          reason: `idle for ${min}`,
        })
      })
    }

    const termInstanceTime = this.pyTime() - this.instanceTerminateAfterSeconds
    const termTimeHours = Math.round(
      this.instanceTerminateAfterSeconds / 60 / 60,
    )
    const terminateInstances = await this.getExpiredKeys(
      `instance:terminate`,
      termInstanceTime,
    )

    if (terminateInstances.length > 0) {
      this.log.info('found expired instances', { data: { terminateInstances } })
      terminateInstances.forEach(async (organizationId) => {
        await this.ec2ExpireInstance({
          _action: 'terminate',
          organizationId,
          message: `removed after idle for ${termTimeHours} hours`,
          reason: `idle for ${termTimeHours}`,
        })
      })
    }
  }

  /**
   * @client
   * connects the client to the socket server
   */
  async createClientSocket() {
    if (typeof window === 'undefined')
      return

    if (!this.socketPort)
      throw new Error('no port set')

    await this.factorUser?.userInitialized()

    vue.watch(
      () => this.factorUser.activeUser.value,
      (v) => {
        if (!v || this.clientSocket?.socketUserId === v.userId)
          return

        const channels = v.organizations?.map(org => org.organizationId)

        this.clientSocket = new ClientSocket<SocketEventMap>({
          host: this.getSocketUrl('ws').value,
          factorUser: this.factorUser,
          channels,
          context: 'instanceSocket',
        })

        this.clientSocket.getSocket().catch(console.error)

        this.clientSocket?.on('state', (message) => {
          const { organizationId, instanceState = {} } = message || {}

          this.setClientOrganizationState(organizationId, instanceState)
        })

        this.clientSocket?.on('job', (message, meta) => {
          const jobConfig = message || {}
          // const { jobId } = jobConfig

          console.warn('JOB DATA RECEIVED', jobConfig, meta)

          this.liveJob.value = jobConfig

          // if (!jobId) throw new Error("jobId required")
          // this.fictionJobs.liveJobs.value = {
          //   ...this.fictionJobs.liveJobs.value,
          //   [jobId]: jobConfig,
          // }
        })
      },
      { immediate: true },
    )
  }

  /**
   * @server
   */
  async createSocketServer() {
    if (this.factorEnv.isApp.value)
      return

    if (!this.socketPort)
      throw new Error('no port set')

    const s = await createSocketServer<SocketEventMap>({
      serverName: 'instanceStateServer',
      port: this.socketPort,
      factorUser: this.factorUser,
      url: this.getSocketUrl('ws').value,
    })

    this.serverSocket = s.socketServer
    this.endpointServer = s.endpointServer

    return this.serverSocket
  }

  /**
   * @server
   */
  getEc2Client() {
    if (!this.factorAws.awsAccessKey || !this.factorAws.awsAccessKeySecret)
      throw new Error('AWS credentials not set')

    return new EC2Client({
      region: this.region,
      credentials: {
        accessKeyId: this.factorAws.awsAccessKey,
        secretAccessKey: this.factorAws.awsAccessKeySecret,
      },
    })
  }

  /**
   * @server
   */
  async ec2StartInstance(tags: { Key: string, Value: string }[] = []) {
    const client = this.getEc2Client()

    const userDataShell = `#!/bin/bash
      echo "AIM NODEJS >>>>>>>> hello ec2StartInstance"
      cd /home/ubuntu/aim
      sudo git config --system --add safe.directory '*'
      git pull
      pip install -r requirements.txt
      cd /home/ubuntu/aim/webui
      git reset --hard
      git pull
      sudo chown -R ubuntu /home/ubuntu
      sudo chmod -R 744 /home/ubuntu
      sudo systemctl start aim
      sudo systemctl status aim
      sudo systemctl start webui
      sudo systemctl status webui
      sudo systemctl start filebrowser
      sudo systemctl status filebrowser
    `
    const command = new RunInstancesCommand({
      LaunchTemplate: { LaunchTemplateName: 'aim' },
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: tags,
        },
      ],
      UserData: Buffer.from(userDataShell).toString('base64'),
    })
    const r = await client.send(command)

    const instance = r.Instances?.[0]
    const instanceId = instance?.InstanceId

    if (!instance || !instanceId)
      throw new Error('instance not created')

    return instanceId
  }

  /**
   * @server
   * terminates an instance by organization ID
   */
  async ec2ExpireInstance(args: {
    _action: 'terminate' | 'stop'
    organizationId: string
    message: string
    reason: string
  }): Promise<Partial<CurrentInstanceDescription> | undefined> {
    const { organizationId, _action, message, reason } = args
    const cache = this.cache()
    if (!cache)
      throw new Error('no cache')

    const details = await this.ec2DescribeInstance({ organizationId })

    const { instanceId } = details || {}

    const nowIso = this.utils.dayjs().toISOString()

    await this.fictionJobs.queries.ManageJobs.serve(
      {
        _action: 'create',
        jobConfig: {
          organizationId,
          progressId: _action,
          jobType: _action,
          instanceId: details?.instanceId,
          requestedAt: nowIso,
          startedAt: nowIso,
          completedAt: nowIso,
          status: 'ready',
          title: `expire server (${_action})`,
          message,
          processor: 'server',
        },
      },
      { server: true },
    )

    this.log.warn(`EXPIRING INSTANCE (${_action})`, {
      data: { organizationId, details, reason },
    })

    if (!instanceId) {
      this.log.error(
        `no instanceId found expired server: org ${organizationId}`,
        { data: { details } },
      )
      return
    }

    let awsTerm: InstanceStateChange | undefined
    try {
      const client = this.getEc2Client()
      if (_action === 'stop') {
        const command = new StopInstancesCommand({
          InstanceIds: [instanceId],
        })
        const awsResponse = await client.send(command)

        awsTerm = awsResponse.StoppingInstances?.[0]
      }
      else if (_action === 'terminate') {
        const command = new TerminateInstancesCommand({
          InstanceIds: [instanceId],
        })
        const awsResponse = await client.send(command)

        awsTerm = awsResponse.TerminatingInstances?.[0]
      }
    }
    catch (error) {
      this.log.error('error expiring instance', { data: { e: error, args } })
    }

    this.log.error(`expire: ${_action}`, { data: { awsTerm } })

    await this.utils.waitFor(1000)

    return await this.ec2DescribeInstance({ organizationId })
  }

  /**
   * @server
   * gets details about ec2 instance and its state
   */
  async ec2DescribeInstance(args: {
    instanceId?: string
    organizationId?: string
    additional?: Record<string, any>
  }): Promise<CurrentInstanceDescription | undefined> {
    const { organizationId, additional = {} } = args

    if (this.isTest)
      return

    const client = this.getEc2Client()

    const cmd: DescribeInstancesRequest = args.instanceId
      ? { InstanceIds: [args.instanceId] as string[] }
      : {
          Filters: [
            {
              Name: 'tag:organization_id',
              Values: [args.organizationId as string],
            },
          ],
        }

    const describeCommand = new DescribeInstancesCommand(cmd)

    const describeResult = await client.send(describeCommand)
    const reservations = describeResult.Reservations || []

    const targetReservation = reservations.find((inst) => {
      const launchTime = inst.Instances?.[0].LaunchTime
      return (
        launchTime
        && !reservations.some((i) => {
          const launchTime2 = i.Instances?.[0].LaunchTime
          return launchTime2 && launchTime2 > launchTime
        })
      )
    })

    const instanceDetails = targetReservation?.Instances?.[0]

    if (!instanceDetails)
      return

    const instanceId = instanceDetails.InstanceId

    const statusCommand = new DescribeInstanceStatusCommand({
      InstanceIds: [instanceId] as string[],
    })

    const statusCommandResult = await client.send(statusCommand)

    const instanceStatus = statusCommandResult.InstanceStatuses?.[0]
    const { InstanceStatus, SystemStatus } = instanceStatus || {}

    // checks are either "initializing" or "ok"
    const check1 = InstanceStatus?.Status === 'initializing'
    const check2 = SystemStatus?.Status === 'initializing'
    const startedAt = instanceDetails.LaunchTime

    const currentTime = new Date()
    const timeDiff = startedAt ? currentTime.getTime() - startedAt.getTime() : 0
    const secondsSinceLaunch = Math.floor(timeDiff / 1000)

    const isStarting = !!(check1 || check2)

    const publicIp = instanceDetails.PublicIpAddress
    const publicDns = instanceDetails.PublicDnsName
    const instanceState = instanceDetails.State?.Name as
      | 'pending'
      | 'running'
      | 'shutting-down'
      | 'terminated'
      | 'stopping'
      | 'stopped'
    const instanceType = instanceDetails.InstanceType
    const ami = instanceDetails.ImageId

    const st = {
      isStarting,
      isTerminated: ['shutting-down', 'terminated'].includes(instanceState),
      isStopped: ['stopped'].includes(instanceState),
      isStopping: ['stopping'].includes(instanceState),
      isRunning: ['running'].includes(instanceState) && !isStarting,
    }

    let status: AimInstanceStatus
    if (isStarting)
      status = 'starting'
    else if (instanceState === 'running')
      status = 'running'
    else if (instanceState === 'stopped')
      status = 'paused'
    else if (instanceState === 'stopping')
      status = 'stopping'
    else if (instanceState === 'shutting-down')
      status = 'removing'
    else
      status = 'off'

    // hack do this with redis later
    if (organizationId) {
      if (st.isStarting || st.isRunning)
        this.activeServers.value[organizationId] = true
      else
        delete this.activeServers.value[organizationId]
    }

    const activeJob = organizationId
      ? await this.manageActiveJob({ organizationId, _action: 'retrieve' })
      : undefined

    const out = {
      ...st,
      status,
      organizationId,
      instanceId,
      publicIp,
      publicDns,
      instanceState,
      instanceType,
      ami,
      secondsSinceLaunch,
      startedAt,
      additional,
      activeJob,
    }

    return out
  }

  async instanceJobRequest(args: {
    jobConfig: TableJobConfig
  }): Promise<TableJobConfig> {
    const { jobConfig } = args

    if (!jobConfig)
      throw new Error('no job data')

    const { organizationId } = jobConfig

    const instanceResult = await this.instanceServerRequest<TableJobConfig>({
      organizationId,
      endpoint: '/job',
      data: jobConfig,
    })

    this.log.info('INSTANCE RESULT', { data: instanceResult })
    if (
      instanceResult.status === 'error'
      && (instanceResult.code !== 'SERVER_OFF' || !jobConfig.isQueued)
    ) {
      const message = instanceResult.message || 'there was an error'

      await this.fictionJobs.queries.ManageJobs.serve(
        {
          _action: 'update',
          jobConfig: {
            organizationId,
            jobId: jobConfig.jobId,
            status: 'error',
            statusDetails: { message },
          },
        },
        { server: true },
      )
      this.log.error('renderRequestError', {
        data: { instanceResult, job: jobConfig },
      })
      throw this.stop(message)
    }

    const jobEntry = instanceResult.data || jobConfig

    return jobEntry
  }

  async instanceServerRequest<T>(args: {
    organizationId: string
    endpoint: '/job' | '/health' | '/cancel'
    data: Record<string, unknown>
  }): Promise<EndpointResponse<T>> {
    const { endpoint, data, organizationId } = args

    const state = await this.ec2DescribeInstance({
      organizationId,
    })

    if (!state)
      throw new Error(`no state for organization "${organizationId}"`)

    if (state.status === 'off' || state.status === 'starting') {
      // code used to handle silence when queueing of jobs
      return {
        status: 'error',
        message: 'ai server not ready',
        code: 'SERVER_OFF',
      }
    }

    const public_dns = state?.publicDns

    if (!public_dns)
      return { status: 'error', message: 'could not contact ai server' }

    const endpointUrl = `http://${public_dns}:${this.aimPort}${endpoint}`

    try {
      const result = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.utils.snakeCaseKeys(data)),
      })

      const r = await result.json()

      return camelKeys(r) as EndpointResponse<T>
    }
    catch (error: unknown) {
      this.log.error('FETCH ERROR in instanceServerRequest', {
        error,
        data: { endpointUrl },
      })
      return { status: 'error', message: 'couldn\'t connect to server' }
    }
  }

  /**
   * Get time since epoch in seconds, to match python time.time()
   */
  pyTime() {
    return Math.floor(Date.now() / 1000)
  }

  getSocketUrl(protocol: 'http' | 'ws' = 'ws'): vue.Ref<string> {
    return vue.computed(() => {
      let url = this.serverUrl.value
      if (protocol === 'ws' && url)
        url = url?.replace('http', 'ws')

      return url
    })
  }

  async instanceRequest(
    _action: 'create' | 'retrieve' | 'delete' | 'stop' | 'cancel',
    args: { reason?: string } = {},
  ) {
    const organizationId = this.factorUser.activeOrganizationId.value
    if (!organizationId)
      return

    const r = await this.requests.ManageInstance.projectRequest({
      _action,
      ...args,
    })

    return r
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorAws: this.factorAws,
      fictionInstance: this,
    }
    return {
      ManageInstance: new QueryManageInstance(deps),
    } as const
  }
}
