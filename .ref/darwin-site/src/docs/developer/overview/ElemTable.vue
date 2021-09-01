<template>
  <div class="flex flex-col my-12">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden border border-bluegray-100 sm:rounded-lg">
          <table class="min-w-full divide-y divide-bluegray-100 rounded-md">
            <thead class="bg-bluegray-50 text-bluegray-500">
              <tr>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    uppercase
                    tracking-wider
                  "
                >
                  Field
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    uppercase
                    tracking-wider
                  "
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    uppercase
                    tracking-wider
                  "
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(field, i) in fieldsList"
                :key="i"
                :class="i % 2 == 0 ? 'bg-white' : 'bg-bluegray-50'"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {{ field.property }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-xs w-32">
                  {{ field.type }}
                </td>
                <td class="px-6 py-4 text-xs">
                  {{ field.description }}
                  <span v-if="field.mandate" class="italic text-bluegray-500"
                    >({{ field.mandate }})</span
                  >
                  <div v-if="field.keys" class="flex mt-2">
                    <span class="font-semibold mr-2">Fields:</span>
                    <div class="">
                      <code
                        v-for="(k, ii) in field.keys"
                        :key="ii"
                        class="text-xs mr-1 mb-1 text-bluegray-700"
                        >{{ k }}</code
                      >
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue"

interface ApiField {
  property: string
  mandate?: string
  type: string
  description: string
  keys?: string[]
}
export default {
  props: {
    fields: {
      type: String as PropType<
        | "basic"
        | "context"
        | "identify"
        | "traits"
        | "properties"
        | "groups"
        | "groupTraits"
      >,
      default: "basic",
    },
  },
  setup(props) {
    let fieldsList: ApiField[] = [
      {
        property: "anonymousId",
        mandate: "set implicitly",
        type: "string",
        description:
          "A pseudo-unique substitute for a User ID. Will be set automatically if no userId outside of server analytics.",
      },

      {
        property: "userId",
        mandate: "optional",
        type: "string",
        description: "The unique identifier for the user in your database.",
      },
      {
        property: "context",
        mandate: "optional",
        type: "object",
        description: "Provide standard context information to your request.",
      },
    ]

    if (props.fields == "context") {
      fieldsList = [
        {
          property: "active",
          mandate: "optional",
          type: "boolean",
          description:
            "Whether an update was created by an active user. Set to false to prevent 'lastSeen' from being updated.",
        },

        {
          property: "app",
          mandate: "optional",
          type: "object",
          description:
            "Object describing the current app. Collected automatically when possible. ",
        },

        {
          property: "locale",
          mandate: "set implicitly",
          type: "string",
          description: "Locale language string for the device making the call.",
        },
        {
          property: "timezone",
          mandate: "set implicitly",
          type: "string",
          description: "The user's time zone",
        },
        {
          property: "groupId",
          mandate: "optional",
          type: "string",
          description:
            "The ID of any group or organization that the user should be associated with.",
        },
        {
          property: "traits",
          mandate: "optional",
          type: "object",
          description:
            "An object of user traits to associate with the user making the request.",
        },
        {
          property: "userAgent",
          mandate: "set implicitly",
          type: "string",
          description: "The user agent of the device making a request",
        },
        {
          property: "campaign",
          mandate: "optional",
          type: "object",
          description:
            "Object describing the referring campaign that created a call.",
          keys: ["name", "version", "build"],
        },
        {
          property: "campaign",
          mandate: "optional",
          type: "object",
          description:
            "Object describing the referring campaign that created a call.",
          keys: ["name", "source", "medium", "term", "content"],
        },
        {
          property: "device",
          mandate: "implicit",
          type: "object",
          description: "Object describing the device making the call.",
          keys: [
            "id",
            "advertisingId",
            "manufacturer",
            "model",
            "name",
            "type",
            "version",
          ],
        },
        {
          property: "location",
          mandate: "optional",
          type: "object",
          description: "Object describing the user's location.",
          keys: ["city", "country", "latitude", "longitude", "region", "speed"],
        },
        {
          property: "network",
          mandate: "optional",
          type: "object",
          description: "Object describing the user's network.",
          keys: ["bluetooth", "carrier", "cellular", "wifi"],
        },
        {
          property: "os",
          mandate: "optional",
          type: "object",
          description: "Object describing the user's OS.",
          keys: ["name", "version"],
        },
        {
          property: "page",
          mandate: "set implicitly",
          type: "object",
          description: "Object describing the user's current web page",
          keys: ["path", "referrer", "search", "title", "url"],
        },
        {
          property: "referrer",
          mandate: "set implicitly",
          type: "object",
          description:
            "Object describing the how a user was referred to the app.",
          keys: ["type", "name", "url", "link"],
        },
        {
          property: "screen",
          mandate: "set implicitly",
          type: "object",
          description: "Object describing the user's screen.",
          keys: ["density", "height", "width"],
        },
        {
          property: "library",
          mandate: "set implicitly",
          type: "object",
          description: "Object describing the Darwin API library.",
          keys: ["name", "version"],
        },
      ]
    }

    if (props.fields == "identify") {
      fieldsList = [
        {
          property: "userId",
          mandate: "optional - anonymouseId is set instead",
          type: "string",
          description:
            "Unique id associated with the user in your database. If omitted anonymousId must be set and is set automatically by Darwin in the browser.",
        },
        {
          property: "traits",
          mandate: "optional",
          type: "boolean",
          description:
            "An object describing the user's traits. Includes reserved and free-form properties.",
        },
      ]
    }

    if (props.fields == "traits") {
      fieldsList = [
        {
          property: "email",
          type: "string",
          description: "User email",
        },
        {
          property: "firstName",
          type: "string",
          description: "User first name",
        },
        {
          property: "lastName",
          type: "string",
          description: "User last name",
        },
        {
          property: "name",
          type: "string",
          description:
            "User full name. Autofilled if firstName or lastName is supplied.",
        },
        {
          property: "description",
          type: "string",
          description: "Text description for the user",
        },
        {
          property: "phone",
          type: "string",
          description: "User phone number",
        },
        {
          property: "title",
          type: "string",
          description:
            "User title. Typically associated with a company position: 'head of marketing'.",
        },
        {
          property: "username",
          type: "string",
          description: "The username for this user on your site/app",
        },
        {
          property: "website",
          type: "string",
          description: "The user's website.",
        },
        {
          property: "address",
          type: "object",
          description: "The user's street address",
          keys: ["city", "country", "postalCode", "state", "street"],
        },
        {
          property: "age",
          type: "number",
          description: "The age of the user",
        },
        {
          property: "avatar",
          type: "string",
          description: "The full URL of the user's avatar",
        },
        {
          property: "birthday",
          type: "date",
          description: "User's birthday in Date format. ISO-8601 format.",
        },
        {
          property: "company",
          type: "object",
          description:
            "Company to associate with a user. Additional sub-traits allowed.",
          keys: ["name", "id", "industry", "employee_count", "plan"],
        },
        {
          property: "createdAt",
          type: "date",
          description:
            "Date when the user account was created. ISO-8601 format.",
        },
      ]
    }

    if (props.fields == "properties") {
      fieldsList = [
        {
          property: "revenue",
          type: "number",
          description:
            "The amount of direct revenue this event resulted in. Can be a decimal value: 99.99",
        },
        {
          property: "currency",
          type: "string",
          description:
            "Currency related to the revenue and/or value. This should be sent in the ISO 4127 format. If missing, assumed to be in US dollars.",
        },
        {
          property: "value",
          type: "number",
          description:
            "Value is an abstract number that can be associated with events. Generally it respresents transactions without a specific revenue amount but some approximate intrinsic value.",
        },
      ]
    }

    if (props.fields == "groups") {
      fieldsList = [
        {
          property: "groupId",
          mandate: "required",
          type: "string",
          description: "Unique id for the group in your database.",
        },
        {
          property: "traits",
          mandate: "optional",
          type: "object",
          description:
            "An object describing the group's traits. Includes reserved and free-form properties.",
        },
      ]
    }

    if (props.fields == "groupTraits") {
      fieldsList = [
        {
          property: "email",
          type: "string",
          description: "Email for group",
        },
        {
          property: "name",
          type: "string",
          description: "Group's name",
        },
        {
          property: "description",
          type: "string",
          description: "Text description for the group",
        },
        {
          property: "phone",
          type: "string",
          description: "Group phone number",
        },

        {
          property: "id",
          type: "string",
          description: "The unique id for the group. Typically from DB.",
        },
        {
          property: "website",
          type: "string",
          description: "The group's primary website.",
        },
        {
          property: "address",
          type: "object",
          description: "The group's street address",
          keys: ["city", "country", "postalCode", "state", "street"],
        },
        {
          property: "employees",
          type: "number",
          description: "Number of employees in the group",
        },
        {
          property: "avatar",
          type: "string",
          description: "The full URL of the group's avatar",
        },
        {
          property: "plan",
          type: "string",
          description: "Plan the group has or belongs to.",
        },
        {
          property: "industry",
          type: "string",
          description: "Industry a user works in, or a group is part of",
        },
        {
          property: "createdAt",
          type: "date",
          description: "Date when the group was created. ISO-8601 format.",
        },
      ]
    }

    return { fieldsList }
  },
}
</script>
