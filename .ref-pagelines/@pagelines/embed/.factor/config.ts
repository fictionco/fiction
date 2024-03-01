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
    | 'OPENAI_API_KEY'
    | 'PINECONE_API_KEY'
    | 'PINECONE_ENVIRONMENT'
    | 'PINECONE_INDEX'
    | 'POSTGRES_URL'
    | 'REDIS_URL'
    | 'RUNTIME_VERSION'
    | 'SERVER_PORT'
    | 'SMTP_HOST'
    | 'SMTP_PASSWORD'
    | 'SMTP_USER'
    | 'TOKEN_SECRET'
  endpoints:
    | 'ManageAgent'
    | 'ManageDataSource'
    | 'ManageIndex'
    | 'ManageMessage'
    | 'ManageVectors'
    | 'MediaAction'
    | 'MediaIndex'
    | 'PublicAgent'
    | 'SaveMedia'
    | 'Unsplash'
    | 'VectorSearch'
  routes: 'agent' | 'chat' | 'chatIndex' | 'embedAgent' | 'embedForm' | 'home' | 'notFound404'
  ui: ''
  menus: ''
  [k: string]: unknown
}
