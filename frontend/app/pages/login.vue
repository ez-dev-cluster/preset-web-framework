<template>
  <v-sheet
      class="bg-grey-lighten-4 d-flex align-center justify-center"
      height="100vh"
  >
    <v-card
        class="pa-8 rounded-xl"
        elevation="8"
        max-width="420"
        width="100%"
    >
      <!-- Logo -->
      <div class="text-center mb-6">
        <v-img
            src="/public/logo/tnp-logo.png"
            max-width="220"
            class="mx-auto mb-4"
            alt="TNP Thanapando"
            contain
        />

        <h2 class="text-h6 font-weight-bold text-grey-darken-3">
          Kitchen Garment Expert
        </h2>
        <p class="text-body-2 text-grey">
          กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ
        </p>
      </div>

      <!-- Form -->
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
            label="ชื่อผู้ใช้"
            prepend-inner-icon="mdi-account"
            v-model="username"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="[$rules.required]"
        />

        <v-text-field
            label="รหัสผ่าน"
            prepend-inner-icon="mdi-lock"
            v-model="password"
            variant="outlined"
            density="comfortable"
            :rules="[$rules.required]"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="toggleShowPassword"
            :type="show_password ? 'text' : 'password'"
        />

        <v-alert
            v-if="error_msg"
            type="error"
            variant="tonal"
            class="my-4"
            border="start"
        >
          ไม่สามารถเข้าสู่ระบบได้<br />
          กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน
        </v-alert>

        <v-btn
            color="primary"
            size="large"
            type="submit"
            block
            class="mt-4"
        >
          เข้าสู่ระบบ
        </v-btn>
      </v-form>

      <!-- Footer -->
      <div class="text-center text-caption text-grey mt-6">
        © 2026 TNP Thanapando
      </div>
    </v-card>
  </v-sheet>
</template>




<script setup lang="ts">
import {ref} from 'vue'
import {navigateTo} from "#imports";
import NonFieldError from "~/components/non-field-error.vue";

const {$rules} = useNuxtApp();
const authStore = useAuthStore()
// const $err = useErrorStore()
const form = ref(false)
const show_password = ref(false)
const username = ref('')
const password = ref('')
const error_msg = ref('')
definePageMeta({ layout: 'blank' });
async function onSubmit() {
  if (!form.value) return
  const [_, error] = await authStore.login(username.value, password.value)
  if (error) {
    // alert(error)
    // $err.handle(error)
    error_msg.value = error.data.detail
    return;
  }
  navigateTo('/')
}

function toggleShowPassword() {
  show_password.value = !show_password.value
}

</script>