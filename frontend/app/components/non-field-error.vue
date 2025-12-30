<script setup lang="ts">
const $err = useErrorStore()
</script>

<template>
  <v-alert v-if="$err.form_errors.non_field_errors" color="error" variant="tonal">
    <ul>
      <li v-for="error in $err.form_errors.non_field_errors">
        {{ error }}
      </li>
    </ul>
  </v-alert>
</template>