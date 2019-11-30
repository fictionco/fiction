import { PopulatedPosts, FactorPost } from "@factor/post/types"

enum Gender {
  Male = "male",
  Female = "female"
}

export enum UserRoles {
  Admin = "admin",
  Moderator = "moderator",
  Author = "author",
  Member = "member",
  Anonymous = "anonymous"
}

export const userRolesMap: Record<string, number> = {
  admin: 500,
  moderator: 400,
  author: 100,
  member: 1,
  anonymous: 0
}

export interface AuthenticationParameters {
  newAccount: boolean;
  email: string;
  password: string;
  displayName?: string;
}

export interface FactorUserCredential extends FactorUser {
  password: undefined;
  token: string;
}

export interface FactorUserAuthentication extends FactorUser {
  password?: string;
}

export interface FactorUser extends FactorPost {
  signedInAt?: string;
  username?: string;
  displayName?: string;
  email?: string;
  _id?: string;
  emailVerified?: boolean;
  accessLevel?: number;
  role?: string;
  phoneNumber?: string;
  covers?: PopulatedPosts;
  birthday?: Date | string;
  gender?: Gender;
  about?: string;
}
