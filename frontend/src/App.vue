<template>
  <router-view />
  <ToastStack />
  <ConfirmDialog />
</template>

<script setup>
import ToastStack from './components/ToastStack.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
</script>
