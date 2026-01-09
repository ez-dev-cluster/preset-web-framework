<template>
  <app-error-dialog />
  <app-snackbar />
  <app-loader />
  <app-dialog />

  <v-layout>
    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>
        <div class="d-flex align-center">
          <v-img
            src="/public/logo/thanapand.png"
            max-width="25"
            alt="TNP Thanapand"
          />

          <span class="text-h6 font-weight-black ml-2">THANAPAND</span>
        </div>
      </v-app-bar-title>

      <template #append>
        <div class="d-flex ga-2 align-center">
          <v-btn class="text-none me-1 px-3" height="48" slim>
            <template #prepend>
              <v-icon
                color="grey-darken-1"
                icon="mdi-account-circle-outline"
                size="32"
                start
              />
            </template>

            <span class="hidden-sm-and-down font-weight-bold">{{
              auth_store.user?.username
            }}</span>

            <v-menu activator="parent">
              <v-list density="compact" nav>
                <v-list-item
                  append-icon="mdi-lock-outline"
                  link
                  title="เปลี่ยนรหัสผ่าน"
                />
                <v-list-item
                  append-icon="mdi-account-edit-outline"
                  link
                  title="แก้ไขโปรไฟล์"
                />
                <v-list-item
                  @click="logOut"
                  append-icon="mdi-logout"
                  link
                  title="ออกจากระบบ"
                />
              </v-list>
            </v-menu>

            <template #append>
              <v-icon color="medium-emphasis" icon="mdi-chevron-down" />
            </template>
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="280">
      <div class="px-2">
        <v-list density="comfortable" nav slim>
          <v-list-subheader class="font-weight-bold"
            >FAVORITES</v-list-subheader
          >

          <template v-for="item in favorites" :key="item.title">
            <!-- GROUP -->
            <v-list-group
              v-if="item.mode == 'group' && item.has_perm"
              :value="item.title"
            >
              <!-- activator -->
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  color="primary"
                  rounded="lg"
                  :prepend-icon="item.icon"
                  :title="item.title"
                >
                </v-list-item>
              </template>

              <!-- children -->
              <v-list-item
                v-for="child in item.children"
                :key="`${item.title}-${child.title}`"
                color="primary"
                link
                rounded="lg"
                :title="child.title"
                :value="child.title"
              >
              </v-list-item>
            </v-list-group>

            <!-- NORMAL ITEM -->
            <v-list-item
              class="menu-item"
              v-if="item.mode == 'normal' && item.has_perm"
              color="primary"
              link
              rounded="lg"
              :prepend-icon="item.icon"
              :title="item.title"
              :value="item.title"
            >
            </v-list-item>

            <!-- Title -->
            <v-list-subheader
              v-if="item.mode == 'title' && item.has_perm"
              class="font-weight-bold py-3"
              >{{ item.title }}
            </v-list-subheader>
          </template>
        </v-list>
      </div>

      <template #append>
        <v-divider />

        <div class="pa-4 d-flex ga-2 justify-space-around">
          <v-btn
            v-for="(item, i) in appendItems"
            :key="i"
            border
            height="32"
            :icon="item.icon"
            rounded="lg"
            size="small"
            variant="text"
            width="32"
          >
            <v-icon color="medium-emphasis" />
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4" style="min-height: 100vh">
      <div>
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { navigateTo } from "#imports";
const { $auth } = useNuxtApp();

const auth_store = useAuthStore();

const favorites = [
  {
    mode: "normal",
    icon: "mdi-storefront-outline",
    title: "ช่องทางการขาย",
    url: "/",
    has_perm: true,
    children: [],
  },
  {
    mode: "normal",
    icon: "mdi-account-edit-outline",
    title: "จัดการข้อมูลใช้",
    url: "/",
    has_perm: true,
    children: [],
  },
  {
    mode: "normal",
    icon: "mdi-account-group-outline",
    title: "จัดการข้อมูลลูกค้า",
    url: "/",
    has_perm: true,
    children: [],
  },
  {
    mode: "title",
    icon: "",
    title: "REPORT",
    url: "/",
    has_perm: true,
    children: [],
  },
  {
    mode: "normal",
    icon: "mdi-finance",
    title: "รายงานสรุปการขาย",
    url: "/",
    has_perm: true,
    children: [],
  },
  {
    mode: "normal",
    icon: "mdi-chart-bar",
    title: "รายงานขายตามสาขา",
    url: "/",
    has_perm: true,
    children: [],
  },
  // {
  //   mode: "normal",
  //   icon: "mdi-needle",
  //   title: "รายงานสรุปการปัก",
  //   url: "/",
  //   has_perm: true,
  //   children: [],
  // },
  // {
  //   mode: "group",
  //   icon: "mdi-chart-box-outline",
  //   title: "รายงานสินค้าที่ขาย",
  //   url: "/",
  //   has_perm: true,
  //   children: [
  //     {
  //       title: "All Orders",
  //       icon: "mdi-format-list-bulleted",
  //       url: "/",
  //       has_perm: true,
  //     },
  //     {
  //       title: "Returns",
  //       icon: "mdi-backup-restore",
  //       url: "/",
  //       has_perm: true,
  //     },
  //   ],
  // },
];

const appendItems = [
  {
    icon: "mdi-account-circle",
    value: "profile",
  },
  {
    icon: "mdi-view-grid",
    value: "apps",
  },
  {
    icon: "mdi-github",
    value: "github",
  },
  {
    icon: "mdi-logout",
    value: "logout",
  },
];

const store = useAuthStore();
const drawer = ref(true);

function logOut() {
  store.logout();
  navigateTo("/login");
}
</script>

<style scoped>
.menu-item :deep(.v-list-item-title) {
  font-size: 16px;
  height: 19px;
}
</style>
