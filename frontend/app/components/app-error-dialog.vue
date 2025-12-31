<template>
  <v-dialog
      v-model="dialog_show_dev"
      max-width="720"
      persistent
  >
    <v-card class="error-card" max-width="720">
      <!-- Header -->
      <v-card-title class="text-center py-6">
        <div class="emoji">⚠️</div>
        <div class="title">เกิดข้อผิดพลาด</div>
        <div class="subtitle">
          ระบบพบเหตุไม่คาดฝัน กรุณาลองใหม่อีกครั้ง
        </div>
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text class="content">
        <!-- Error Summary -->
        <section class="section">
          <h4 class="section-title">รายละเอียดปัญหา</h4>
          <div class="error-box">
            <div class="error-name">
              {{ errorStore.error?.name }}
            </div>
            <div class="error-message">
              {{ errorStore.error?.message }}
            </div>
          </div>
        </section>

        <!-- User Info -->
        <section v-if="user" class="section">
          <h4 class="section-title">ข้อมูลผู้ใช้งาน</h4>
          <div class="info-box">
            <table>
              <tbody>
              <tr>
                <td class="label">User</td>
                <td>{{ user.id }} / {{ user.username }}</td>
              </tr>
              <tr>
                <td class="label">Datetime</td>
                <td>{{ new Date().toLocaleString() }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Dev Info -->
        <section v-if="showDev" class="section dev-section">
          <h4 class="section-title">ข้อมูลสำหรับนักพัฒนา</h4>

          <template v-if="errorStore.error instanceof FetchError">
            <div class="dev-block">
              <div class="dev-label">Request</div>
              <code class="code-box">
                [{{ errorStore.error.options?.method }}]
                {{ errorStore.error.request }}
              </code>
            </div>

            <div class="dev-block">
              <div class="dev-label">Response</div>
              <code class="code-box">
                {{ JSON.stringify(errorStore.error.data, null, 2) }}
              </code>
            </div>
          </template>

          <div class="dev-block">
            <div class="dev-label">Stack Trace</div>
            <code class="code-box small">
              {{ errorStore.error?.stack }}
            </code>
          </div>
        </section>

        <!-- Toggle -->
        <div class="text-center mt-4">
          <v-btn
              variant="text"
              size="small"
              color="grey-darken-1"
              @click="toggleDeveloperDetail"
          >
            {{ showDev ? 'ซ่อนข้อมูลนักพัฒนา' : 'แสดงข้อมูลสำหรับนักพัฒนา' }}
          </v-btn>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Action -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
            color="primary"
            variant="flat"
            @click="dialog_show_dev=false"
        >
          ตกลง
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="errorStore.dialog"
      max-width="490"
      persistent>
    <v-card
        rounded="xl"
        class="pa-6 d-flex flex-column align-center text-center"
        @dblclick.stop="errorStore.dialog=false;dialog_show_dev=true"
    >

      <!-- ICON -->
      <v-icon
          size="56"
          color="error"
          class="mb-4 my-3"
      >
        mdi-alert-circle-outline
      </v-icon>

      <!-- TITLE -->
      <p class="text-h5 font-weight-bold mb-1">
        เกิดข้อผิดพลาด
      </p>

      <!-- MESSAGE -->
      <p class="text-body-1 text-medium-emphasis mb-6 mt-2">
        เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
      </p>

      <!-- ACTION -->
      <v-card-actions class="justify-center pa-0">
        <v-btn
            color="error"
            variant="flat"
            size="large"
            rounded="lg"
            min-width="120"
            @click="errorStore.clear()"
        >
          OK
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch'

const errorStore = useErrorStore()
const userStore = useAuthStore()

const user = computed(() => userStore.user)
const showDev = ref(false)
const dialog_show_dev = ref(false)

function toggleDeveloperDetail() {
  showDev.value = !showDev.value
}
</script>

<style scoped>
.error-card {
  border-radius: 16px;
}

/* Header */
.emoji {
  font-size: 48px;
}
.title {
  font-size: 20px;
  font-weight: 600;
}
.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* Content */
.content {
  background-color: #fafafa;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* Boxes */
.error-box {
  background: #fff;
  border: 1px solid #fee2e2;
  border-left: 4px solid #ef4444;
  padding: 12px;
  border-radius: 8px;
}

.error-name {
  color: #b91c1c;
  font-weight: 600;
}

.error-message {
  color: #7f1d1d;
  font-size: 14px;
}

.info-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 8px;
}

.label {
  padding-right: 12px;
  color: #6b7280;
}

/* Dev section */
.dev-section {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.dev-block {
  margin-bottom: 12px;
}

.dev-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.code-box {
  display: block;
  background: #111827;
  color: #e5e7eb;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
}

.code-box.small {
  max-height: 120px;
  overflow-y: auto;
}
</style>
