/* tslint:disable */
/**
 * Automatically generated file, do not modify by hand.
 */

export interface CompiledServiceConfig {
  commands: "app" | "dev" | "r-dev" | "render" | "server";
  vars:
    | "APP_PORT"
    | "APP_URL"
    | "AWS_ACCESS_KEY"
    | "AWS_ACCESS_KEY_SECRET"
    | "COMMAND"
    | "COMMAND_OPTS"
    | "GOOGLE_CLIENT_ID"
    | "GOOGLE_CLIENT_SECRET"
    | "IS_TEST"
    | "NODE_ENV"
    | "POSTGRES_URL"
    | "SERVER_PORT"
    | "SERVER_URL"
    | "SMTP_HOST"
    | "SMTP_PASSWORD"
    | "SMTP_USER"
    | "TOKEN_SECRET";
  endpoints:
    | "CurrentUser"
    | "Login"
    | "ManageUser"
    | "NewVerificationCode"
    | "ResetPassword"
    | "SendOneTimeCode"
    | "SetPassword"
    | "StartNewUser"
    | "UpdateCurrentUser"
    | "UserGoogleAuth"
    | "VerifyAccountEmail";
  routes: "";
  ui: "";
  menus: "";
  [k: string]: unknown;
}
