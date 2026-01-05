<template>
    <v-container>
    <v-text-field 
    label="test" 
    v-model="text"
    prepend-icon="mdi-plus"
    @click:prepend="list.push({task:text})"
    ></v-text-field>
    
    <v-card v-for="item in list">
        <v-card-item>
            {{ item.task }}
            <v-btn>
                
            </v-btn>
        </v-card-item>
    </v-card>
    </v-container>
</template>

<script setup>
    const list = ref([])
    const text = ref('')
    
</script>

<style   scoped>

</style>