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
    | 'ManageForm'
    | 'ManageMedia'
    | 'ManageMemberRelation'
    | 'ManageOrganization'
    | 'ManagePage'
    | 'ManagePost'
    | 'ManagePostIndex'
    | 'ManageSend'
    | 'ManageSite'
    | 'ManageSites'
    | 'ManageSubmission'
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
    fiction_user:
      | 'userId'
      | 'email'
      | 'username'
      | 'googleId'
      | 'fullName'
      | 'role'
      | 'status'
      | 'hashedPassword'
      | 'emailVerified'
      | 'verify'
      | 'avatar'
      | 'invitedById'
      | 'lastOrgId'
      | 'lastSeenAt'
      | 'isSuperAdmin'
      | 'onboard'
      | 'pushSubscription'
      | 'ip'
      | 'geo'
      | 'phone'
      | 'address'
      | 'title'
      | 'headline'
      | 'websiteUrl'
      | 'accounts'
      | 'company'
      | 'birthday'
      | 'gender'
      | 'createdAt'
      | 'updatedAt'
    fiction_org:
      | 'orgId'
      | 'slug'
      | 'orgName'
      | 'orgEmail'
      | 'url'
      | 'address'
      | 'orgStatus'
      | 'ownerId'
      | 'avatar'
      | 'lastSeenAt'
      | 'apiSecret'
      | 'timezone'
      | 'config'
      | 'onboard'
      | 'extend'
      | 'customerId'
      | 'customer'
      | 'customerAuthorized'
      | 'customerIdTest'
      | 'customerTest'
      | 'orgPlan'
      | 'specialPlan'
      | 'publication'
      | 'legal'
      | 'createdAt'
      | 'updatedAt'
    fiction_org_user:
      | 'memberId'
      | 'orgId'
      | 'userId'
      | 'memberStatus'
      | 'memberAccess'
      | 'memberRole'
      | 'invitedById'
      | 'priority'
      | 'createdAt'
      | 'updatedAt'
    fiction_taxonomy:
      | 'taxonomyId'
      | 'userId'
      | 'orgId'
      | 'title'
      | 'slug'
      | 'type'
      | 'context'
      | 'description'
      | 'parentId'
      | 'priority'
      | 'createdAt'
      | 'updatedAt'
    fiction_media:
      | 'mediaId'
      | 'userId'
      | 'orgId'
      | 'caption'
      | 'hash'
      | 'url'
      | 'originUrl'
      | 'rasterUrl'
      | 'thumbUrl'
      | 'thumbOriginUrl'
      | 'thumbFilePath'
      | 'blurhash'
      | 'preview'
      | 'filePath'
      | 'mime'
      | 'width'
      | 'height'
      | 'orientation'
      | 'alt'
      | 'contentEncoding'
      | 'etag'
      | 'bucket'
      | 'size'
      | 'prompt'
      | 'sourceImageUrl'
      | 'createdAt'
      | 'updatedAt'
    fiction_site:
      | 'siteId'
      | 'userId'
      | 'orgId'
      | 'title'
      | 'themeId'
      | 'subDomain'
      | 'customDomains'
      | 'status'
      | 'userConfig'
      | 'userPrivate'
      | 'editor'
      | 'sections'
      | 'createdAt'
      | 'updatedAt'
    fiction_site_pages:
      | 'cardId'
      | 'siteId'
      | 'userId'
      | 'orgId'
      | 'regionId'
      | 'layoutId'
      | 'templateId'
      | 'slug'
      | 'title'
      | 'description'
      | 'cards'
      | 'effects'
      | 'userConfig'
      | 'isHome'
      | 'is404'
      | 'editor'
      | 'generation'
      | 'createdAt'
      | 'updatedAt'
    fiction_site_domains:
      | 'domainId'
      | 'siteId'
      | 'hostname'
      | 'isPrimary'
      | 'dnsValidationHostname'
      | 'dnsValidationTarget'
      | 'dnsValidationInstructions'
      | 'check'
      | 'configured'
      | 'certificateAuthority'
      | 'createdAt'
      | 'updatedAt'
    fiction_form:
      | 'formId'
      | 'orgId'
      | 'title'
      | 'description'
      | 'userConfig'
      | 'card'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
    fiction_form_submission:
      | 'submissionId'
      | 'orgId'
      | 'formId'
      | 'formTemplateId'
      | 'status'
      | 'title'
      | 'card'
      | 'userValues'
      | 'ip'
      | 'meta'
      | 'submittedAt'
      | 'completedAt'
      | 'createdAt'
      | 'updatedAt'
    fiction_subscribe:
      | 'subscriptionId'
      | 'userId'
      | 'email'
      | 'orgId'
      | 'level'
      | 'status'
      | 'previousStatus'
      | 'inlineTags'
      | 'inlineUser'
      | 'createdAt'
      | 'updatedAt'
    fiction_subscribe_taxonomy:
      | 'subscriptionTaxonomyId'
      | 'subscriptionId'
      | 'taxonomyId'
      | 'orgId'
      | 'priority'
      | 'createdAt'
      | 'updatedAt'
    fiction_post:
      | 'postId'
      | 'userId'
      | 'orgId'
      | 'slug'
      | 'type'
      | 'title'
      | 'subTitle'
      | 'excerpt'
      | 'content'
      | 'media'
      | 'status'
      | 'userConfig'
      | 'isSyndicated'
      | 'hasChanges'
      | 'publishAt'
      | 'dateAt'
      | 'draft'
      | 'draftHistory'
      | 'archiveAt'
      | 'createdAt'
      | 'updatedAt'
    fiction_post_taxonomy: 'postTaxonomyId' | 'postId' | 'taxonomyId' | 'orgId' | 'priority' | 'createdAt' | 'updatedAt'
    fiction_post_author: 'postAuthorId' | 'postId' | 'userId' | 'orgId' | 'priority' | 'createdAt' | 'updatedAt'
    fiction_post_site: 'postSiteId' | 'postId' | 'siteId' | 'orgId' | 'priority' | 'createdAt' | 'updatedAt'
    fiction_email_campaign:
      | 'campaignId'
      | 'userId'
      | 'orgId'
      | 'postId'
      | 'status'
      | 'title'
      | 'sentAt'
      | 'subject'
      | 'preview'
      | 'from'
      | 'avatar'
      | 'scheduleMode'
      | 'scheduledAt'
      | 'filters'
      | 'counts'
      | 'draft'
      | 'userConfig'
      | 'createdAt'
      | 'updatedAt'
    [k: string]: unknown
  }
  [k: string]: unknown
}
