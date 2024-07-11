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
      <v-col cols="12" md="4" class="d-flex flex-column">
        <v-card class="mb-4">
          <v-card-title>Income</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(income, index) in incomeData" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{
                    income.description
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      income.amount.toLocaleString()
                    }}
                    THB</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold"
                  >Total Income</v-list-item-title
                >
                <v-list-item-subtitle class="font-weight-bold"
                  >{{
                    balanceData.totalIncome.toLocaleString()
                  }}
                  THB</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Expenses</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(expense, index) in expenseData" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{
                    expense.description
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      expense.amount.toLocaleString()
                    }}
                    THB</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold"
                  >Total Expenses</v-list-item-title
                >
                <v-list-item-subtitle class="font-weight-bold"
                  >{{
                    balanceData.totalExpense.toLocaleString()
                  }}
                  THB</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
      <!------------------------------------------ Right side box ------------------------------------------>
      <v-col cols="12" md="8" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title>Balance</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ balanceData.netBalance.toLocaleString() }} THB</h1>
          </v-card-text>
          <BalanceChart />
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import {
  BalanceResponse,
  ExpenseResponse,
  IncomeResponse,
} from "@/types/Types";
import dummyData from "@/assets/dummy.json";

interface VerifyResponse {
  jwt: string;
  username: string;
  userId: number;
}

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref("");
const userId = ref<number | null>(null);

const incomeData = ref<IncomeResponse[]>([]);
const expenseData = ref<ExpenseResponse[]>([]);
const balanceData = ref<BalanceResponse>({
  userId: 0,
  netBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
});

const fetchIncomeData = async () => {
  incomeData.value = dummyData.income;
  console.log("Income data:", incomeData.value);
};

const fetchExpenseData = async () => {
  expenseData.value = dummyData.expenses;
};

const fetchBalanceData = () => {
  // Calculate balance from dummy data
  const totalIncome = dummyData.income.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalExpense = dummyData.expenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  balanceData.value = {
    userId: 1,
    netBalance: totalIncome - totalExpense,
    totalIncome: totalIncome,
    totalExpense: totalExpense,
  };
};

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
    const response = await axios.get<VerifyResponse>(
      "http://localhost:8080/api/auth/verify",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    isAuthenticated.value = true;
    console.log("Token verified:", response.data);
    username.value = response.data.username;
    userId.value = response.data.userId;
  } catch (error) {
    console.error("Token verification failed:", error);
    isAuthenticated.value = false;
    localStorage.removeItem("userToken");
  }
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

onMounted(() => {
  checkAuthentication();
  fetchIncomeData();
  fetchExpenseData();
  fetchBalanceData();
});
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
