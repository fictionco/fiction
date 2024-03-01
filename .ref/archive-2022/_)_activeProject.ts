import { displayDomain, getFavicon, getRouter } from '@factor/api'
import { computed, watch } from 'vue'
import type { FactorUser } from '@factor/api/plugin-user'
import { useKaptionService } from '@kaption/core/utils/inject'
import type { Organization, ProjectUtil } from '@kaption/core/plugin-admin/types'

const { nav, activeUser } = useKaptionService()

export const activeOrganizations = computed<Organization[]>(() => {
  return activeUser.value?.organizations ?? []
})

/**
 * Gets all the projects associated with the user
 * @computed
 */
export const activeUserProjects = computed<ProjectUtil[]>(() => {
  const organizations = activeOrganizations.value

  let allProjects: ProjectUtil[] = []
  if (organizations.length > 0) {
    organizations.forEach((org) => {
      const { projects = [], organizationName } = org
      const refined = projects.map((s) => {
        const domain = displayDomain(s?.projectDomain ?? '')

        return {
          ...s,
          icon: getFavicon(s?.projectDomain),
          name: s?.projectName || domain,
          organizationName,
          path: `/project/${s.projectId}`,
          description: s?.projectName ? domain : organizationName,
        }
      })
      allProjects = [...allProjects, ...refined]
    })
  }

  return allProjects
})

const dbActiveProject = computed((): ProjectUtil | undefined => {
  return activeUserProjects.value.find(p => p.lastProject)
})
/**
 * Get the project from a projectId
 */
export function getProjectById(projectId?: string): ProjectUtil | undefined {
  const projects = activeUserProjects.value

  let project: ProjectUtil | undefined
  if (projectId)
    project = projects.find(project => project.projectId === projectId)

  return project
}
/**
 * The actively computed selected website in the app
 */
export const activeProject = computed<ProjectUtil | undefined>(() => {
  const routeProjectId = getRouter().currentRoute.value.params
    .projectId as string

  const project
    = getProjectById(routeProjectId)
    || dbActiveProject.value
    || activeUserProjects.value[0]

  return project
})
/**
 * Get the organization from a organizationId
 */
export function getOrgById(organizationId?: string): Organization | undefined {
  const orgs = activeOrganizations.value

  let org: Organization | undefined
  if (organizationId)
    org = orgs.find(o => o.organizationId === organizationId)

  return org
}
/**
 * Organization for the activated site
 */
export const activeOrganization = computed<Organization | undefined>(() => {
  const activeOrg
    = getOrgById(
      getRouter().currentRoute.value.params.organizationId as string,
    )
    || getOrgById(activeProject.value?.organizationId)
    || activeOrganizations.value[0]

  return activeOrg
})

/**
 * Get the selected site id
 * @computed
 */
export const activeProjectId = computed<string | undefined>(() => {
  return activeProject.value?.projectId
})

/**
 * Initialize the active site handling
 * @initializer
 */
export async function watchProjectChange(params: {
  factorUser: FactorUser
}): Promise<void> {
  const { factorUser } = params
  await factorUser.userInitialized()

  const r = getRouter()

  watch(
    () => r.currentRoute.value,
    async (route) => {
      if (activeUser.value) {
        if (activeUser.value && route.path === '/') {
          /**
           * Handle home route (/)
           * Should default to project dash / org single / all orgs
           */
          const projectId = activeProject.value?.projectId ?? ''
          const path = nav.to('dashboard', { projectId })
          return await getRouter().replace({ path })
        }
        else {
          /**
           * If new projectId, update user with lastProject for state
           */
          const projectId = route.params.projectId as string | undefined
          const project = getProjectById(projectId)

          if (
            project
            && project.projectId !== dbActiveProject.value?.projectId
          ) {
            const r = await factorUser.requests.ManageUser.request({
              _action: 'update',
              email: activeUser.value.email,
              fields: { lastProject: project.projectId },
            })

            if (r.data)
              await factorUser.updateUser(() => r.data)
          }
        }
      }
    },
    { immediate: true },
  )
}

// /**
//  * Take localstorage saved project/org id and set them to the current project
//  * @note only if the project/org are in the user's settings... this can be an issue when switching accounts
//  */
// const initializeReactiveIds = (user: PrivateUser): void => {
//   const savedProject = getLocal<string>({ key: "kaptionProject", raw: true })
//   const savedOrg = getLocal<string>({ key: "kaptionOrg", raw: true })

//   const { organizations } = user
//   const projects = organizations.flatMap((o) => o.projects)

//   let activeProjectId = savedProject

//   if (!savedProject || !projects.some((p) => p.projectId === activeProjectId)) {
//     activeProjectId = projects[0]?.projectId
//   }

//   const project = getProjectById(activeProjectId)
//   const org = getOrgById(savedOrg)

//   if (project) {
//     storeItem("activeProject", project.projectId)
//     setStoredOrganizationId(project.organizationId)
//   } else if (org) {
//     setStoredOrganizationId(org.organizationId)
//   }
// }

// /**
//  * Refines the url if it includes strings :projectId or loading
//  * and replaces with the computed values
//  */
// export const refineLoadingUrl = async (router: Router): Promise<void> => {
//   const path = router.currentRoute.value.path
//   const project = await syncProject()

//   let newPath = ""
//   if (project) {
//     if (path.includes(":projectId")) {
//       newPath = path.replace(":projectId", project.projectI``d)
//     }

//     if (path.includes(":orgId")) {
//       newPath = path.replace(":orgId", project.organizationId)
//     }
//   }

//   if (newPath) await router.replace({ path: newPath })
// }
