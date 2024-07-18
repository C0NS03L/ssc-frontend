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
        <v-flex class="d-flex flex-column flex-grow-1">
          <v-card class="mb-4 flex-grow-1">
            <v-card-title
              class="d-flex flex-row ga-2"
              @click="navigateToIncome"
            >
              <span class="link-icon">Recent Income</span>
              <v-icon>mdi-link</v-icon>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(income, index) in latestIncome"
                  :key="index"
                >
                  <v-list-item-title>{{
                    income.description
                  }}</v-list-item-title>
                  <div style="display: flex; justify-content: space-between">
                    <v-list-item-subtitle
                      >{{
                        income.amount.toLocaleString()
                      }}
                      THB</v-list-item-subtitle
                    >
                    <v-list-item-subtitle>{{
                      new Date(income.date).toLocaleDateString()
                    }}</v-list-item-subtitle>
                  </div>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title class="font-weight-bold"
                  >Total Income (This month)</v-list-item-title
                >
                <v-list-item-subtitle class="font-weight-bold"
                  >{{
                    balanceData.totalIncome
                      ? balanceData.totalIncome.toLocaleString()
                      : 0
                  }}
                  THB</v-list-item-subtitle
                >
              </v-list-item>
            </v-card-text>
          </v-card>
          <v-card class="flex-grow-1">
            <v-card-title
              class="d-flex flex-row ga-2"
              @click="navigateToExpense"
            >
              <span class="link-icon">Recent Expense</span>
              <v-icon>mdi-link</v-icon>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(expense, index) in latestExpense"
                  :key="index"
                >
                  <v-list-item-title>{{
                    expense.description
                  }}</v-list-item-title>
                  <div style="display: flex; justify-content: space-between">
                    <v-list-item-subtitle
                      >{{
                        expense.amount.toLocaleString()
                      }}
                      THB</v-list-item-subtitle
                    >
                    <v-list-item-subtitle>{{
                      new Date(expense.date).toLocaleDateString()
                    }}</v-list-item-subtitle>
                  </div>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title class="font-weight-bold"
                  >Total Expenses (This month)</v-list-item-title
                >
                <v-list-item-subtitle class="font-weight-bold"
                  >{{
                    balanceData.totalExpense
                      ? balanceData.totalExpense.toLocaleString()
                      : 0
                  }}
                  THB</v-list-item-subtitle
                >
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-col>

      <!------------------------------------------ Right side box ------------------------------------------>
      <v-col cols="12" md="8" class="d-flex">
        <v-card class="flex-grow-1">
          <v-card-title>Balance</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ balanceData.netBalance.toLocaleString() }} THB</h1>
          </v-card-text>
          <BalanceChart :incomeData="incomeData" :expenseData="expenseData" />
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
import { Balance, Expense, Income } from "@/types/Types";

interface VerifyResponse {
  jwt: string;
  username: string;
  userId: number;
}

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref("");
const userId = ref<number | null>(null);

const incomeData = ref<Income[]>([]);
const expenseData = ref<Expense[]>([]);
const balanceData = ref<Balance>({} as Balance);

const fetchIncomeData = async () => {
  try {
    const response = await axios.get<Income[]>(
      "http://localhost:8080/api/income",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    incomeData.value = response.data;
  } catch (error) {
    console.error("Income Failed:", error);
  }
};

const fetchExpenseData = async () => {
  try {
    const response = await axios.get<Expense[]>(
      "http://localhost:8080/api/expense",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    expenseData.value = response.data;
  } catch (error) {
    console.error("Expense Failed:", error);
  }
};

const fetchBalanceData = async () => {
  try {
    const response = await axios.get<Balance>(
      "http://localhost:8080/api/balance",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    balanceData.value = response.data;
  } catch (error) {
    console.error("Balance Failed:", error);
  }

  const monthlyIncome = incomeData.value
    .filter(
      (item) =>
        new Date(item.date).getMonth() === new Date().getMonth() &&
        new Date(item.date).getFullYear() === new Date().getFullYear(),
    )
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpense = expenseData.value
    .filter(
      (item) =>
        new Date(item.date).getMonth() === new Date().getMonth() &&
        new Date(item.date).getFullYear() === new Date().getFullYear(),
    )
    .reduce((sum, item) => sum + item.amount, 0);

  // console.log(totalIncome, totalExpense);
  // console.log(monthlyIncome, monthlyExpense);
  balanceData.value.totalExpense = monthlyExpense;
  balanceData.value.totalIncome = monthlyIncome;
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

watch([incomeData, expenseData], () => {
  fetchBalanceData();
});

const latestExpense = computed(() => {
  return expenseData.value
    .filter(
      (item) =>
        new Date(item.date).getMonth() === new Date().getMonth() &&
        new Date(item.date).getFullYear() === new Date().getFullYear(),
    )
    .sort(sortbyDate)
    .slice(0, 5);
});

const latestIncome = computed(() => {
  return incomeData.value
    .filter(
      (item) =>
        new Date(item.date).getMonth() === new Date().getMonth() &&
        new Date(item.date).getFullYear() === new Date().getFullYear(),
    )
    .sort(sortbyDate)
    .slice(0, 5);
});

function sortbyDate(a: any, b: any) {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
}

const navigateToIncome = () => {
  router.push("/income");
};

const navigateToExpense = () => {
  router.push("/expense");
};
</script>
<style>
.link-icon {
  cursor: pointer;
  transition:
    color 0.3s,
    text-decoration 0.3s;
}

.link-icon:hover {
  color: #1976d2; /* Primary color or any color you prefer */
  text-decoration: underline;
}
</style>
