/* tslint:disable */
/**
 * Automatically generated file, do not modify by hand.
 */

export interface CompiledServiceConfig {
  commands: 'app' | 'build' | 'dev' | 'r-dev' | 'render' | 'server'
  vars:
    | 'APP_PORT'
    | 'AWS_ACCESS_KEY'
    | 'AWS_ACCESS_KEY_SECRET'
    | 'COMMAND'
    | 'COMMAND_OPTS'
    | 'GOOGLE_CLIENT_ID'
    | 'GOOGLE_CLIENT_SECRET'
    | 'IS_TEST'
    | 'NGROK_AUTH_TOKEN'
    | 'NODE_ENV'
    | 'POSTGRES_URL'
    | 'RUNTIME_VERSION'
    | 'SERVER_PORT'
    | 'SLACK_WEBHOOK_URL'
    | 'SMTP_HOST'
    | 'SMTP_PASSWORD'
    | 'SMTP_USER'
    | 'TOKEN_SECRET'
  routes: 'about' | 'blog' | 'blogIndex' | 'blogSingle' | 'contact' | 'home' | 'pricing'
  ui: 'logoDark' | 'logoLight'
  menus: ''
  endpoints:
    | 'CurrentUser'
    | 'FindOneOrganization'
    | 'GenerateApiSecret'
    | 'Login'
    | 'ManageMemberRelation'
    | 'ManageOnboard'
    | 'ManageOrganization'
    | 'ManageSubmission'
    | 'ManageUser'
    | 'NewVerificationCode'
    | 'OrganizationsByUserId'
    | 'ResetPassword'
    | 'SendOneTimeCode'
    | 'SetPassword'
    | 'StartNewUser'
    | 'UpdateCurrentUser'
    | 'UpdateOrganizationMemberStatus'
    | 'UserGoogleAuth'
    | 'VerifyAccountEmail'
  tables: {
    factor_user:
      | 'userId'
      | 'email'
      | 'username'
      | 'googleId'
      | 'fullName'
      | 'firstName'
      | 'lastName'
      | 'role'
      | 'status'
      | 'site'
      | 'github'
      | 'githubFollowers'
      | 'twitter'
      | 'twitterFollowers'
      | 'facebook'
      | 'linkedin'
      | 'workSeniority'
      | 'workRole'
      | 'bio'
      | 'location'
      | 'hashedPassword'
      | 'emailVerified'
      | 'verificationCode'
      | 'codeExpiresAt'
      | 'avatarUrl'
      | 'about'
      | 'gender'
      | 'birthday'
      | 'phoneNumber'
      | 'address'
      | 'meta'
      | 'invitedById'
      | 'lastOrgId'
      | 'lastSeenAt'
      | 'isSuperAdmin'
      | 'onboard'
      | 'pushSubscription'
      | 'createdAt'
      | 'updatedAt'
    factor_org:
      | 'orgId'
      | 'username'
      | 'orgName'
      | 'orgEmail'
      | 'orgStatus'
      | 'orgPlan'
      | 'ownerId'
      | 'avatarUrl'
      | 'customerId'
      | 'customer'
      | 'customerAuthorized'
      | 'customerIdTest'
      | 'customerTest'
      | 'lastSeenAt'
      | 'specialPlan'
      | 'apiSecret'
      | 'timezone'
      | 'dashboards'
      | 'config'
      | 'meta'
      | 'onboard'
      | 'createdAt'
      | 'updatedAt'
    factor_org_user:
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
    fiction_deleted:
      | 'deletedId'
      | 'orgId'
      | 'userId'
      | 'deletedType'
      | 'modelId'
      | 'renderId'
      | 'imageId'
      | 'collectionId'
      | 'meta'
      | 'createdAt'
      | 'updatedAt'
    factor_submission:
      | 'submissionId'
      | 'userId'
      | 'notificationEmail'
      | 'appName'
      | 'appUrl'
      | 'name'
      | 'email'
      | 'orgName'
      | 'orgUrl'
      | 'orgTitle'
      | 'message'
      | 'phone'
      | 'twitter'
      | 'github'
      | 'linkedIn'
      | 'createdAt'
      | 'updatedAt'
    [k: string]: unknown
  }
  [k: string]: unknown
}
