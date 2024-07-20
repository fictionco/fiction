/* tslint:disable */
/**
 * Automatically generated file, do not modify by hand.
 */

export interface CompiledServiceConfig {
  commands: 'app' | 'beacon' | 'build' | 'dev' | 'dev-r' | 'generate' | 'render' | 'server' | 'sites'
  vars:
    | 'APOLLO_API_KEY'
    | 'APP_PORT'
    | 'AWS_ACCESS_KEY'
    | 'AWS_ACCESS_KEY_SECRET'
    | 'AWS_BUCKET_MEDIA'
    | 'AWS_REGION'
    | 'BEACON_PORT'
    | 'CLICKHOUSE_URL'
    | 'COMMAND'
    | 'COMMAND_OPTS'
    | 'FICTION_ORG_ID'
    | 'FICTION_SITE_ID'
    | 'FLY_API_TOKEN'
    | 'GOOGLE_CLIENT_ID'
    | 'GOOGLE_CLIENT_SECRET'
    | 'IS_TEST'
    | 'NODE_ENV'
    | 'OPENAI_API_KEY'
    | 'PINECONE_API_KEY'
    | 'PINECONE_ENVIRONMENT'
    | 'PINECONE_INDEX'
    | 'POSTGRES_URL'
    | 'REDIS_URL'
    | 'RUNTIME_COMMIT'
    | 'RUNTIME_VERSION'
    | 'SENTRY_PUBLIC_DSN'
    | 'SERVER_PORT'
    | 'SITES_PORT'
    | 'SLACK_WEBHOOK_URL'
    | 'SMTP_HOST'
    | 'SMTP_PASSWORD'
    | 'SMTP_USER'
    | 'STRIPE_PUBLIC_KEY_PROD'
    | 'STRIPE_PUBLIC_KEY_TEST'
    | 'STRIPE_SECRET_KEY_PROD'
    | 'STRIPE_SECRET_KEY_TEST'
    | 'TOKEN_SECRET'
    | 'UNSPLASH_ACCESS_KEY'
  routes: 'engine' | 'renderTest'
  menus: ''
  endpoints:
    | 'AiCompletion'
    | 'AiImage'
    | 'CardQuery'
    | 'CheckUsername'
    | 'EmailAction'
    | 'GetClientSessions'
    | 'GetCustomerData'
    | 'GetDimensionList'
    | 'GetTotalSessions'
    | 'ListSubscriptions'
    | 'ManageCampaign'
    | 'ManageCert'
    | 'ManageCustomer'
    | 'ManageIndex'
    | 'ManageMedia'
    | 'ManageMemberRelation'
    | 'ManageOrganization'
    | 'ManagePage'
    | 'ManagePost'
    | 'ManagePostIndex'
    | 'ManageSend'
    | 'ManageSite'
    | 'ManageSubscription'
    | 'ManageTaxonomy'
    | 'ManageUser'
    | 'ManageVectors'
    | 'MediaIndex'
    | 'OrgMembers'
    | 'OrganizationsByUserId'
    | 'SaveMedia'
    | 'SeekInviteFromUser'
    | 'SubscriptionAnalytics'
    | 'TeamInvite'
    | 'oAuthEndpoint'
    | 'posts'
  tables: {
    fiction_user: 'createdAt' | 'updatedAt'
    fiction_org: 'createdAt' | 'updatedAt'
    fiction_org_user: 'createdAt' | 'updatedAt'
    fiction_taxonomy: 'createdAt' | 'updatedAt'
    fiction_media: 'createdAt' | 'updatedAt'
    fiction_site: 'createdAt' | 'updatedAt'
    fiction_site_pages: 'createdAt' | 'updatedAt'
    fiction_site_domains: 'createdAt' | 'updatedAt'
    fiction_subscribe: 'createdAt' | 'updatedAt'
    fiction_subscribe_taxonomy: 'createdAt' | 'updatedAt'
    fiction_post: 'createdAt' | 'updatedAt'
    fiction_post_taxonomy: 'createdAt' | 'updatedAt'
    fiction_post_author: 'createdAt' | 'updatedAt'
    fiction_post_site: 'createdAt' | 'updatedAt'
    fiction_email_campaign: 'createdAt' | 'updatedAt'
    [k: string]: unknown
  }
  [k: string]: unknown
}
