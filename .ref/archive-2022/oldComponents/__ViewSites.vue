<script lang="ts" setup>
import { currentUser } from '@factor/api'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ElemAvatar from '../el/ElemAvatar.vue'
import ElemButton from '../el/ElemButton.vue'
import AppPage from '../AppPage.vue'
import ElemZeroState from '../el/ElemZeroState.vue'
import type { Organization } from '..'
import { currentUserCan, getRoute } from '..'
import ProjectList from './OrgProjectList.vue'
import PanelNewSite from './__PanelNewSite.vue'
import PanelTransferSite from './ProjectTransfer.vue'
import PanelOrganization from './__PanelOrganization.vue'
import PanelInviteMember from './__PanelInviteMember.vue'

const router = useRouter()

const showPanel = computed(() => {
  const q = router.currentRoute.value.query

  return q.mode
})

async function togglePanel(args: {
  org: Organization
  mode: 'newProject' | 'newOrganization' | 'invite' | 'transferSite'
  userId?: string
}): Promise<void> {
  const { org, mode, userId } = args
  const { organizationId } = org ?? {}
  const q = router.currentRoute.value.query
  const query: Record<string, any> = { ...q, mode }
  if (organizationId)
    query.organizationId = organizationId
  if (userId)
    query.userId = userId
  await router.push({ query })
}

async function closePanel(): Promise<void> {
  await router.replace({ query: {} })
}

async function editTeam(org: Organization): Promise<void> {
  const teamRoute = getRoute('team')
  // const query = { ...route.query }

  const getOrgId = org.organizationId

  await router.push(`${teamRoute}?organizationId=${getOrgId}`)
}

const organizations = computed<Organization[]>(() => {
  const user = currentUser()

  return user?.organizations ?? []
})
</script>

<template>
  <AppPage title="Manage Projects">
    <template #actions>
      <ElemButton
        class="hidden lg:inline-flex"
        btn="default"
        @click.stop="togglePanel({ mode: 'newOrganization' })"
      >
        New Organization
      </ElemButton>
      <ElemButton
        class="hidden lg:inline-flex"
        btn="primary"
        @click.stop="togglePanel({ mode: 'newProject' })"
      >
        New Project
      </ElemButton>
    </template>
    <div class="max-w-prose mx-auto py-8">
      <ElemZeroState
        v-if="organizations.length === 0"
        title="No Organizations Found"
        note="You can create one now"
      >
        <template #action>
          <ElemButton
            btn="primary"
            @click.stop="togglePanel({ mode: 'newOrganization' })"
          >
            New Organization
          </ElemButton>
        </template>
      </ElemZeroState>
      <template v-else>
        <div
          v-for="(org, i) in organizations"
          :key="i"
          class="mb-16 lg:mb-20"
        >
          <div class="flex items-center justify-between pb-3 space-x-8">
            <div class="flex items-center">
              <h2
                class="text-xl leading-6 font-bold mr-3"
                :title="org.organizationId"
              >
                {{ org.organizationName }}
              </h2>
              <router-link
                v-if="currentUserCan('manageOrganization', org)"
                class="hidden items-center px-2.5 py-0.5 rounded-full font-medium text-primary-600 bg-primary-50 hover:text-white hover:bg-primary-500 lg:inline-flex lg:text-xs"
                :to="
                  getRoute('orgEdit', {
                    organizationId: org.organizationId,
                  })
                "
              >
                Edit Org
              </router-link>
            </div>
            <div>
              <div
                class="block min-w-0 flex-1 sm:flex sm:items-center sm:justify-between"
              >
                <div class="flex overflow-hidden group transition-colors">
                  <div class="flex cursor-pointer" @click.stop="editTeam(org)">
                    <ElemAvatar
                      v-for="(member, ii) in org.members"
                      :key="ii"
                      class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      :email="member.email"
                    />
                  </div>

                  <div
                    v-if="currentUserCan('manageOrganization', org)"
                    class="shadow-sm bg-primary-500 text-white inline-block h-6 w-6 rounded-full ring-2 ring-white group-hover:text-white hover:bg-primary-700 cursor-pointer"
                    @click.stop="togglePanel({ org, mode: 'invite' })"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProjectList
            class="border border-slate-300 bg-white"
            :organization="org"
          />

          <div class="py-3">
            <div class="flex items-center justify-between">
              <div class="text-sm text-slate-500 mr-2">
                {{ org.projects.length }}
                project<template v-if="org.projects.length > 1">
                  s
                </template> in
                the
                <span class="font-medium">&ldquo;{{ org.organizationName }}&rdquo;</span>
                organization.
              </div>
              <div
                v-if="
                  currentUserCan('manageOrganization', org)
                    && org.projects.length > 0
                "
              >
                <ElemButton
                  class="hidden lg:inline-flex"
                  btn="primary"
                  size="sm"
                  @click.stop="togglePanel({ org, mode: 'newProject' })"
                >
                  <span class="text-lg leading-3 mr-2">+</span> New Project
                </ElemButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <PanelTransferSite
      :vis="showPanel === 'transferSite'"
      mode="route"
      @close="closePanel()"
    />
    <PanelNewSite
      :vis="showPanel === 'newProject'"
      mode="route"
      @close="closePanel()"
    />
    <PanelOrganization
      :vis="showPanel === 'newOrganization'"
      mode="route"
      @close="closePanel()"
    />
    <PanelInviteMember
      :vis="showPanel === 'invite'"
      mode="route"
      @close="closePanel()"
    />
  </AppPage>
</template>
