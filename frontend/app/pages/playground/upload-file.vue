<template>
  <div>
    <input
      type="file"
      @change="(event: any) => (file = event.target!.files![0])"
    />
    <br />
    <br />
    <button @click="uploadFile">Upload</button>

    <v-img v-if="image" :src="image" />
  </div>
</template>

<script setup lang="ts">
import { FileRepository } from "~/repositories/FileRepository";

const file = ref(null);
const file_repository = new FileRepository();
const image = ref("");

async function uploadFile() {
  if (!file.value) return;

  console.log(file.value);

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
