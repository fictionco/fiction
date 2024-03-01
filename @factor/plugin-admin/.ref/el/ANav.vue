<script lang="ts" setup>
import type { FactorUser, NavItem } from '@factor/api'
import { getNavComponentType, toLabel, useService } from '@factor/api'
import type { FactorAdmin } from '..'

const { factorAdmin, factorUser } = useService<{
  factorAdmin: FactorAdmin
  factorUser: FactorUser
}>()

async function handleClick(event: MouseEvent, item: NavItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}
</script>

<template>
  <div class="space-y-1 font-sans">
    <div class="flex items-center  rounded-full space-x-3 mb-8">
      <div class=" ">
        <div class="w-[3em] h-[3em] rounded-full bg-theme-700 text-theme-100 flex items-center justify-center">
          <div
            class="text-xl"
          >
            <div class="i-tabler-building" />
          </div>
        </div>
      </div>
      <div class="font-bold leading-tight pr-2 min-w-0">
        {{ factorUser.activeOrganization.value?.orgName }}
      </div>
    </div>

    <div
      v-for="(sub, i) in factorAdmin.primaryNav.value"
      :key="i"
      class="menu-group"
    >
      <div class="nav-menu">
        <component
          :is="getNavComponentType(sub)"
          class="group nav-item flex cursor-pointer items-center space-x-3 truncate rounded-full  text-base  focus:outline-none"
          :to="sub.href"
          :href="sub.href"
          :class="
            sub.isActive
              ? 'text-primary-600 font-bold'
              : 'active:bg-theme-200 text-theme-700 hover:text-theme-900  font-semibold border-theme-0'
          "
          @click="handleClick($event, sub)"
        >
          <div class="">
            <div
              class="w-[3em] h-[3em] rounded-full flex items-center justify-center transition-all"
              :class="sub.isActive ? 'text-primary-600 bg-primary-50' : 'text-theme-800 group-hover:bg-theme-100'"
            >
              <div
                v-if="sub.icon"
                class="text-2xl"
              >
                <div :class="sub.icon" />
              </div>
            </div>
          </div>
          <div class="">
            {{ toLabel(sub.name) }}
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
