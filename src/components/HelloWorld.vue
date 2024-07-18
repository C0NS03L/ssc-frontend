<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <div class="text-center">
        <h1 class="font-weight-bold mb-n1">Welcome to</h1>

        <v-img class="mb-4" height="250" src="@/assets/MoneyTrackerLogo.png" />
      </div>

      <div class="py-4" />
      <v-row>
        <v-col cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-account-plus-outline"
            rounded="lg"
            variant="outlined"
            @mouseover="registerHover = true"
            @mouseleave="registerHover = false"
            @click="redirectTo('/register')"
            :class="{ 'register-hover': registerHover }"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">Get started</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">Register your account!</div>
            </template>

            <v-overlay
              opacity=".12"
              scrim="primary"
              contained
              v-show="registerHover"
              persistent
            />
          </v-card>
        </v-col>

        <!-- Login card -->
        <v-col cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-login-variant"
            rounded="lg"
            variant="outlined"
            @mouseover="loginHover = true"
            @mouseleave="loginHover = false"
            @click="redirectTo('/login')"
            :class="{ 'login-hover': loginHover }"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">Already have an account?</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">Login!</div>
            </template>

            <v-overlay
              opacity=".12"
              scrim="primary"
              contained
              v-show="loginHover"
              persistent
            />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
const loginHover = ref(false);
const registerHover = ref(false);
const router = useRouter();

if (localStorage.getItem("userToken")) {
  router.push("/dashboard");
}

const redirectTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.register-hover:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.login-hover:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
</style>
