<template>
  <div id="dialog-event"></div>

  <v-dialog v-model="store.visible" persistent width="560" id="app-dialog">
    <v-card>
      <v-card-title v-if="store.title">
        {{ store.title }}
      </v-card-title>
      <v-divider v-if="store.title"/>

      <v-card-text>
        <div v-html="store.body"></div>

        <v-text-field
            v-if="store.input_type"
            v-model="store.input"
            :type="store.input_type"/>
      </v-card-text>
      <v-divider/>

      <v-card-actions>
        <v-btn v-for="btn in store.buttons.filter(b => b.position === 'left')" :color="btn.color" @click="onClick(btn.value)">
          {{ btn.text }}
        </v-btn>
        <v-spacer/>
        <v-btn v-for="btn in store.buttons.filter(b => b.position === 'center')" :color="btn.color" @click="onClick(btn.value)">
          {{ btn.text }}
        </v-btn>
        <v-spacer/>
        <v-btn v-for="btn in store.buttons.filter(b => b.position === 'right')" :color="btn.color" @click="onClick(btn.value)">
          {{ btn.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const store = useDialogStore()
const dialog = ref(null as HTMLElement | null)

onMounted(() => {
  dialog.value = document.getElementById('dialog-event')
  store.setupRef(dialog)
})

function onClick (value: string) {
  dialog.value?.dispatchEvent(new CustomEvent('x-click', { detail: value }))
}
</script>