<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 min-h-screen">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">👋 Welcome back</h1>
        <p class="text-medium-emphasis">POS Utility & Formatter Playground</p>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-card class="mb-6 rounded-l" elevation="2">
      <v-card-text class="d-flex flex-wrap gap-3">
        <v-btn
          color="success"
          prepend-icon="mdi-check-circle-outline"
          @click="$snackbar('success', '🎉 Happy New Year 2026 🎉')"
        >
          Snackbar
        </v-btn>

        <v-btn
          class="ml-2"
          color="primary"
          prepend-icon="mdi-timer-sand"
          @click="$loading(true)"
        >
          Loading
        </v-btn>

        <v-btn
          class="ml-2"
          color="warning"
          prepend-icon="mdi-help-circle-outline"
          @click="confirmDialog"
        >
          Confirm Dialog
        </v-btn>

        <v-btn
          class="ml-2"
          color="red"
          prepend-icon="mdi-alert-circle-outline"
          @click="showError"
        >
          Error Dialog
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Feature Cards -->
    <v-row dense>
      <!-- Date Formatter -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-m h-100">
          <v-card-title class="d-flex align-center gap-3">
            <v-avatar color="blue-darken-2" class="mr-3">
              <v-icon icon="mdi-calendar-clock-outline" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">Format Date</div>
              <div class="text-caption text-medium-emphasis">
                can use: <code>$date</code>, <code>$datetime</code>
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="text-body-2">
            <div class="mb-2"><strong>Raw:</strong> {{ date }}</div>
            <div class="mb-2"><strong>$date:</strong> {{ $date(date) }}</div>
            <div><strong>$datetime:</strong> {{ $datetime(date) }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Currency Formatter -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-m h-100">
          <v-card-title class="d-flex align-center gap-3">
            <v-avatar color="green-darken-2" class="mr-3">
              <v-icon icon="mdi-currency-usd" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">Format Currency</div>
              <div class="text-caption text-medium-emphasis">
                can use: <code>$currency</code>, <code>$fnumber</code>
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="text-body-2">
            <div class="mb-2"><strong>Value:</strong> {{ number }}</div>
            <div class="mb-2">
              <strong>$currency:</strong> {{ $currency(number) }}
            </div>
            <div>
              <strong>$fnumber (1,000,000):</strong> {{ $fnumber(1000000) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Upload File (NEW) -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-m h-100">
          <v-card-title class="d-flex align-center gap-3">
            <v-avatar color="purple-darken-2" class="mr-3">
              <v-icon icon="mdi-cloud-upload-outline" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">Upload File</div>
              <div class="text-caption text-medium-emphasis">
                รองรับ: <code>multiple</code>, <code>preview</code>,
                <code>progress</code>
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="text-body-2">
            <v-file-input
              label="เลือกไฟล์"
              prepend-icon="mdi-paperclip"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              multiple
              show-size
              clearable
              accept=".png,.jpg,.jpeg,.pdf,.csv,.xlsx,.txt"
              @change="(event: any) => (file = event.target!.files![0])"
            />

            <v-img v-if="image" :src="image" />

            <!-- Actions -->
            <div class="d-flex flex-wrap gap-3 mt-4">
              <v-btn
                color="purple"
                prepend-icon="mdi-upload"
                @click="uploadFile"
              >
                Upload
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { FileRepository } from "~/repositories/FileRepository";
const $err = useErrorStore();
const { $date, $snackbar, $loading, $dialog, $currency, $fnumber } =
  useNuxtApp();
const date = Date.now();
const number = 10000.565;
const file = ref(null);
const file_repository = new FileRepository();
const image = ref("");

async function confirmDialog() {
  const confirm_delete = await $dialog.confirmDelete();
  if (confirm_delete === "cancel") return;
  // delete file
}

function showError() {
  const err_test = "";
  $err.handle(err_test);
}

async function uploadFile() {
  if (!file.value) return;

  const [response, error] = await file_repository.uploadPublicFile(
    file.value,
    "test"
  );

  if (error) {
    console.log(error);
    return;
  }

  console.log(response);
  image.value = "http://localhost:8000" + response.url;
}
</script>

<style scoped></style>
