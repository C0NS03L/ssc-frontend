<template>
    <v-container v-if="isAuthenticated">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <v-card-title>
            <span class="headline">Welcome, {{ username }}</span>
          </v-card-title>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" @click="logout">Logout</v-btn>
        </v-col>
      </v-row>
  
      <v-row>
        <!------------------------------------------ Left side boxes ------------------------------------------>
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title>Income</v-card-title>
            <v-card-text>
              <!-- Income content goes here -->
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>Expenses</v-card-title>
            <v-card-text>
              <!-- Expenses content goes here -->
            </v-card-text>
          </v-card>
        </v-col>
        <!------------------------------------------ Right side box ------------------------------------------>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Balance</v-card-title>
            <v-card-text>
              <!-- Balance content goes here -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title>
              <span class="headline">Please Log In</span>
            </v-card-title>
            <v-card-text>
              You need to be logged in to view this page.
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="redirectToLogin">Go to Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface VerifyResponse {
  jwt: string;
  username: string;
  userId: number;
}

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref('');

const checkAuthentication = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    verifyToken(token);
  } else {
    isAuthenticated.value = false;
  }
};

const verifyToken = async (token: string) => {
  try {
    const response = await axios.get<VerifyResponse>('http://localhost:9090/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    isAuthenticated.value = true;
    console.log('Token verified:', response.data);
    username.value = response.data.username;
  } catch (error) {
    console.error('Token verification failed:', error);
    isAuthenticated.value = false;
    localStorage.removeItem('userToken');
  }
};

const logout = async () => {
  try {
    await axios.post('http://localhost:9090/api/auth/logout');
    localStorage.removeItem('userToken');
    isAuthenticated.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const redirectToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  checkAuthentication();
});
</script>