<template>
    <div>
        <h1 class="counter">{{ 1+ counter }}</h1>
        
    </div>
</template>

<script setup>
    const props = defineProps({
        counter: Number,
    })
</script>

<style scoped>
.counter{
    text-align: center;
    border: 2px solid black;
    border-radius: 50px;
}
</style>