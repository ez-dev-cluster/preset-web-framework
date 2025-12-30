<template>
  <app-error-dialog/>
  <app-snackbar/>
  <app-loader/>
  <app-dialog/>
  <div>
    <v-btn color="red" @click="logOut">log out</v-btn>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {navigateTo} from "#imports";

const store = useAuthStore()

function logOut() {
  store.logout()
  navigateTo("/login")
}
</script>

<style scoped>

</style>