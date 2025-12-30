<template>
  <v-dialog v-model="store.visible" persistent width="300">
    <v-card>
      <v-card-text>
        <div>
          <v-img src="/public/loading/hand-sewing-loading.gif" height="100"/>
        </div>
        <div class="text-center">
          <v-progress-linear indeterminate color="primary"/>
          <div class="text-caption">
            {{ store.message }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const store = useLoaderStore()
</script>