export enum UserRoles {
  Owner = "owner",
  Admin = "admin",
  Editor = "editor",
  Author = "author",
  Subscriber = "subscriber",
  Anonymous = "anonymous",
}

export enum Ability {
  // Reading
  Read = "read",
  ReadPrivate = "readPrivate",

  // Creation
  CreateContent = "createContent",

  // Moderation
  ManageContent = "manageContent",

  // Images / Files
  ManageFiles = "manageFiles",
  UploadFiles = "uploadFiles",

  // User Management
  ManageUsers = "manageUsers",

  // Design / Admin
  ManageAdmin = "manageAdmin",
}

export const anonymousRole = {
  name: "anonymous",
  accessLevel: 0,
  capability: [],
}

export const subscriberRole = {
  name: "author",
  accessLevel: 25,
  capability: [Ability.Read],
}

export const authorRole = {
  name: "author",
  accessLevel: 100,
  capability: [...subscriberRole.capability, Ability.CreateContent],
}

export const editorRole = {
  name: "editor",
  accessLevel: 200,
  capability: [
    ...authorRole.capability,
    Ability.ReadPrivate,
    Ability.ManageContent,
  ],
}

export const adminRole = {
  name: "admin",
  accessLevel: 500,
  capability: [...editorRole.capability, Ability.ManageUsers],
}

export const ownerRole = {
  name: "owner",
  accessLevel: 1000,
  capability: [...adminRole.capability],
}

export const accessLevelMap: { [index in UserRoles]: number } = {
  owner: ownerRole.accessLevel,
  admin: adminRole.accessLevel,
  editor: editorRole.accessLevel,
  author: authorRole.accessLevel,
  subscriber: subscriberRole.accessLevel,
  anonymous: anonymousRole.accessLevel,
}

export const capabilityMap: { [index in UserRoles]: Ability[] } = {
  owner: ownerRole.capability,
  admin: adminRole.capability,
  editor: editorRole.capability,
  author: authorRole.capability,
  subscriber: subscriberRole.capability,
  anonymous: [],
}
