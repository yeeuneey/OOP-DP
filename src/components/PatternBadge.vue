<template>
  <li>
    <button class="pattern-badge" :data-type="type" type="button" @click="$emit('select')">
      <span class="pattern-badge__glow"></span>
      <span class="pattern-badge__dot"></span>
      <span class="pattern-badge__text">{{ label }}</span>
    </button>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  type: "creational" | "structural" | "behavioral"
}>()

defineEmits<{
  select: []
}>()
</script>
