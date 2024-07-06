<template>
  <v-footer height="40" app>
    <div class="text-caption text-disabled" style="position: absolute; left: 16px">
      &copy; 2016-{{ new Date().getFullYear() }} Money Tracker App
    </div>
    
    <div class="text-caption text-disabled" style="position: absolute; right: 16px">
      <a
        class="text-decoration-none on-surface"
        href="/privacy-policy"
      >
        Privacy Policy
      </a>
      |
      <a
        class="text-decoration-none on-surface"
        href="/terms-of-service"
      >
        Terms of Service
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
// Add any necessary script here
</script>

<style scoped lang="sass">
a
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
