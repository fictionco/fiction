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
    | 'RUNTIME_COMMIT'
    | 'RUNTIME_VERSION'
    | 'SERVER_PORT'
    | 'SMTP_HOST'
    | 'SMTP_PASSWORD'
    | 'SMTP_USER'
    | 'TOKEN_SECRET'
    | 'UNSPLASH_ACCESS_KEY'
  endpoints:
    | 'CheckUsername'
    | 'CurrentUser'
    | 'FindOneOrganization'
    | 'GenerateApiSecret'
    | 'Login'
    | 'ManageMemberRelation'
    | 'ManageOnboard'
    | 'ManageOrganization'
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
  routes: 'renderTest'
  menus: ''
  [k: string]: unknown
}
