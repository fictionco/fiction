import { EndpointParameters } from "@factor/endpoint"
export type EmailTransactionalConfig = {
  emailId?: string;
  to?: string;
  from?: string;
  subject?: string;
  title?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;
  textFooter?: string;
  html?: string;
} & EndpointParameters
