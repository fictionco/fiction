export interface EmailTransactionalConfig {
  _id?: string;
  to: string;
  from?: string;
  subject?: string;
  title?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;
  textFooter?: string;
  html?: string;
}
