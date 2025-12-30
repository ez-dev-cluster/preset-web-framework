<template>

  <v-snackbar
      v-model="store.visible"
      :color="store.color"
      location="top right"
  >
    {{ store.message }}

    <template v-slot:actions>
      <v-btn
          variant="text"
          icon="mdi-close"
          @click="store.visible = false"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const store = useSnackbarStore()
</script>