<template>
    <v-container v-if="isAuthenticated">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <v-card-title>
            <span class="headline">Income Details</span>
          </v-card-title>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" @click="logout">Logout</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                label="Search Income"
                prepend-icon="mdi-magnify"
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(income, index) in filteredIncomeData" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ income.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ income.amount.toLocaleString() }} THB</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="editIncome(income.id)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteIncome(income.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
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
            <v-card-text>You need to be logged in to view this page.</v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="redirectToLogin">Go to Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { IncomeResponse } from "@/types/Types";
  import dummyData from "@/assets/dummy.json";
  
  const router = useRouter();
  const isAuthenticated = ref(false);
  const search = ref("");
  const incomeData = ref<IncomeResponse[]>([]);
  const filteredIncomeData = computed(() =>
    incomeData.value.filter(income =>
      income.description.toLowerCase().includes(search.value.toLowerCase())
    )
  );
  
  const checkAuthentication = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      verifyToken(token);
    } else {
      isAuthenticated.value = false;
    }
  };
  
  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
      isAuthenticated.value = true;
      console.log("Token verified:", response.data);
    } catch (error) {
      console.error("Token verification failed:", error);
      isAuthenticated.value = false;
      localStorage.removeItem("userToken");
    }
  };
  
  const fetchIncomeData = async () => {
    incomeData.value = dummyData.income;
  };
  
  const logout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout");
      localStorage.removeItem("userToken");
      isAuthenticated.value = false;
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const redirectToLogin = () => {
    router.push("/login");
  };
  
  const editIncome = (id: number) => {
    console.log("Edit income with id:", id);
    // TODO: Add Functionality
};
  
  const deleteIncome = (id: number) => {
    console.log("Delete income with id:", id);
    // TODO: Add Functionality
  };
  
  onMounted(() => {
    checkAuthentication();
    fetchIncomeData();
  });
  </script>
  
  <style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
  </style>
  