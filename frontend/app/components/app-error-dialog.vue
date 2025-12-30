<template>
  <v-dialog v-model="errorStore.dialog" width="760">
    <v-card v-if="errorStore.error">
      <v-card-title class="text-center">
        <div style="font-size: 48px;">
          😱🥲🤔
        </div>
        <small>
          Oops! เกิดเหตุไม่คาดฝัน
        </small>
      </v-card-title>
      <v-divider/>
      <v-card-text style="max-height: 500px; overflow: scroll">
        <div>
          <h4>ปัญหาที่เกิดขึ้น</h4>
          <div class="pa-3 box">
            <b class="text-red">
              {{ errorStore.error.name }}
            </b>
            <div class="text-red">
              {{ errorStore.error.message }}
            </div>
          </div>
          <div v-if="user" class="mt-2">
            <div class="pa-3 box">
              <table>
                <tbody>
                <tr>
                  <td class="pr-2">Datetime</td>
<!--                  <td>{{ $datetime() }}</td>-->
                </tr>
                <tr>
                  <td>User</td>
                  <td>{{ user.id }} / {{ user.username }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="mt-2 pa-1">กรุณาแจ้งปัญหากับทางทีมพัฒนา ทางเราจะพยายามแก้ไขปัญหานี้ให้เร็วที่สุด</p>
        </div>

        <div class="mt-5" v-if="showDev">
          <h4>ข้อมูลสำหรับนักพัฒนา</h4>

          <div class="mt-2" v-if="errorStore.error instanceof FetchError">
            <div class="text-caption">Request</div>
            <div class="pa-3 box">
              [{{ errorStore.error.options?.method }}]
              {{ errorStore.error.request }}
            </div>

            <div class="mt-2 text-caption">Response</div>
            <div class="pa-3 box">
              <details open>
                <summary>{{ errorStore.error.status }}, {{ errorStore.error.statusText }}</summary>
                <v-divider class="my-2"></v-divider>
                <code>
                  {{ JSON.stringify(errorStore.error.data, null, 4) }}
                </code>
              </details>
            </div>
          </div>

          <div class="mt-2">
            <div class="text-caption">Stack Trace</div>
            <div class="pa-3 box" style="font-size: 12px; height: 100px; overflow: scroll;">
              <code>{{ errorStore.error.stack }}</code>
            </div>
          </div>
        </div>

        <div class="mt-5 text-center">
          <v-btn size="sm" color="primary" variant="text" class="pa-1 text-grey-darken-5 font-weight-light text-body-2"
                 @click="toggleDeveloperDetail">
            แสดงข้อมูลสำหรับนักพัฒนา
          </v-btn>
        </div>
      </v-card-text>

      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="errorStore.clear()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import {FetchError} from "ofetch";

const errorStore = useErrorStore()
const userStore = useAuthStore()
const user = computed(() => userStore.user)

const showDev = ref(false)

function toggleDeveloperDetail() {
  showDev.value = !showDev.value
}

</script>

<style scoped>
.box {
  border: 1px solid gray;
  border-radius: 5px;
  margin-top: 4px;
}
</style>