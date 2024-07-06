<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="rounded-lg">
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :loading="loading"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

interface LoginResponse {
  jwt: string;
  username: string;
  userId: number;
}

const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);

const login = async () => {
  loading.value = true;
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:8080/api/auth/login",
      {
        username: username.value,
        password: password.value,
      },
    );

    localStorage.setItem("userToken", response.data.jwt);
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      } else if (error.response.status === 500) {
        alert("A server-side error occurred, please try again later");
      } else {
        alert("An error occurred, please try again later");
      }
    } else {
      alert("An unexpected error occurred");
    }
  } finally {
    loading.value = false;
  }
};
</script>
