<template>
    <v-container v-if="isAuthenticated">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <v-card-title>
            <span class="headline">Expense Details</span>
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
                label="Search Expense"
                prepend-icon="mdi-magnify"
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(expense, index) in filteredExpenseData" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ expense.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ expense.amount.toLocaleString() }} THB</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="editExpense(expense.id)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteExpense(expense.id)">
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
  import { ExpenseResponse } from "@/types/Types";
  import dummyData from "@/assets/dummy.json";
  
  const router = useRouter();
  const isAuthenticated = ref(false);
  const search = ref("");
  const expenseData = ref<ExpenseResponse[]>([]);
  const filteredExpenseData = computed(() =>
    expenseData.value.filter(expense =>
      expense.description.toLowerCase().includes(search.value.toLowerCase())
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
  
  const fetchExpenseData = async () => {
    expenseData.value = dummyData.expenses;
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
  
  const editExpense = (id: number) => {
    console.log("Edit expense with id:", id);
    // TODO: Add Functionality
};
  
  const deleteExpense = (id: number) => {
    console.log("Delete expense with id:", id);
    // TODO: Add Functionality
};
  
  onMounted(() => {
    checkAuthentication();
    fetchExpenseData();
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
  