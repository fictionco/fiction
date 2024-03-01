import type { EventParams } from '@kaption/core/plugin-event-stream'
import type { ClickHouseTableConfig } from '@kaption/core/plugin-clickhouse/types'
import type { KaptionClickHouse } from '@kaption/core/plugin-clickhouse'

const DB_NAME = 'darwin'

/**
 * Create DB and tables for general db
 * These are only created if they don't exist already
 */
export async function clickHouseSchema(params: {
  kaptionClickHouse: KaptionClickHouse
}): Promise<void> {
  const { kaptionClickHouse } = params
  // Create the base DB
  await kaptionClickHouse.clickHouseQuery({
    query: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
  })
  /**
   * Sessions use collapsingMergeTree
   *  - https://clickhouse.tech/docs/en/engines/table-engines/mergetree-family/collapsingmergetree
   * LowCardinality is for limited set "dictionary" fields and improves performance
   */

  const sharedFieldsTop = {
    sessionId: 'String',
    timestamp: 'DateTime',
    domain: 'String',
    clientId: 'String',
    anonymousId: 'String',
    projectId: 'String',
    organizationId: 'String',
    ip: 'IPv6',
    signature: 'String',
    countryCode: 'LowCardinality(String)',
    os: 'LowCardinality(String)',
    browser: 'LowCardinality(String)',
    deviceType: 'LowCardinality(String)',
    language: 'LowCardinality(String)',
    isRobot: 'UInt8',
    isNew: 'UInt8',
    isReturning: 'UInt8',
    ipBlockList: 'UInt8',
    engageDuration: 'UInt16',
    moveTotal: 'UInt16',
    scrollTotal: 'UInt16',
    keypressTotal: 'UInt16',
    clickTotal: 'UInt16',
    touchTotal: 'UInt16',
    scrollDepth: 'Float32',
    vitalCLS: 'Float32',
    vitalFID: 'Float32',
    vitalLCP: 'Float32',
    vitalTBT: 'Float32',
    experiments: `Nested(experimentId String, experimentName String, variantId String, variantName String)`,
  } as const

  const sharedFieldsBottom = {
    referrer: 'String',
    referralSource: 'String',
    referralCampaign: 'String',
    referralMedium: 'String',
    referralTerm: 'String',
    referralContent: 'String',
    referralTitle: 'String',
    referralDescription: 'String',
    referralImage: 'String',
    referralCanonicalUrl: 'String',
    city: 'String',
    regionCode: 'LowCardinality(String)',
    regionName: 'LowCardinality(String)',
    latitude: 'Float32',
    longitude: 'Float32',
    timezone: 'LowCardinality(String)',
    viewNo: 'UInt16',
    eventNo: 'UInt16',
    meta: 'String',
    trace: 'String',
    v: 'String',
    sign: 'Int8',
    entryPage: 'String',
    exitPage: 'String',
    startedAt: 'DateTime',
    endedAt: 'DateTime',
    duration: 'UInt32',
    isBounce: 'UInt8',
  } as const

  /**
   * Sorting keys for table
   * https://clickhouse.tech/docs/en/engines/table-engines/mergetree-family/mergetree/
   */
  const eventOrderBy: (keyof EventParams)[] = [
    'eventName',
    'projectId',
    'timestamp',
    'anonymousId',
    'pathname',
  ]

  const eventPartitionBy: keyof EventParams = 'timestamp'

  const eventTable: ClickHouseTableConfig = {
    tableName: 'event',

    fields: {
      eventId: 'FixedString(24)',
      eventName: 'String',
      eventType: 'LowCardinality(String)',
      pathname: 'String',
      category: 'String',
      context: 'String',
      action: 'String',
      label: 'String',
      value: 'Float32',
      selector: 'String',
      properties: 'String',
      traits: 'String',
      source: 'String',
      messageId: 'String',
      sentAt: 'DateTime',
      receivedAt: 'DateTime',
      ...sharedFieldsTop,
      ...sharedFieldsBottom,
    },
    orderBy: eventOrderBy.join(', '),
    engine: 'MergeTree()',
    partitionBy: `toYYYYMM(${eventPartitionBy})`,
  }

  const tables: ClickHouseTableConfig[] = [eventTable]

  const _promises = tables.map(async (table) => {
    const { fields, tableName, engine, partitionBy, orderBy } = table
    const fieldsInQuery = Object.entries(fields)
      .map(([key, value]) => `${key} ${value}`)
      .join(`,\n`)

    const query = `
      CREATE TABLE IF NOT EXISTS ${DB_NAME}.${tableName}
      ( ${fieldsInQuery} ) ENGINE = ${engine}
      PARTITION BY ${partitionBy}
      ORDER BY (${orderBy})
    `

    await kaptionClickHouse.clickHouseQuery({ query })

    /**
     * CHANGESET
     * Add and Modify tables
     */

    const changeset: {
      column: string
      dataType: string
      alterTable?: 'session' | 'event'
    }[] = [
      {
        column: 'projectId',
        dataType: `String`,
      },
    ]
    const _promises = changeset.map(
      async ({ column, dataType, alterTable }) => {
        if (!alterTable || tableName === alterTable) {
          const query = `ALTER TABLE ${DB_NAME}.${tableName} ADD COLUMN IF NOT EXISTS ${column} ${dataType}`

          await kaptionClickHouse.clickHouseQuery({ query })
        }
      },
    )
    await Promise.all(_promises)
  })

  await Promise.all(_promises)
}
