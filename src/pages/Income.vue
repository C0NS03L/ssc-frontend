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
      <v-col cols="12" md="6" class="income-column">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              label="Search Income"
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-card-title>
          <v-card-title>
            <v-select
              v-model="selectedMonth"
              :items="months"
              label="Select Month"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <v-list height="50vh" class="scroll">
              <v-list-item
                v-for="(income, index) in filteredIncomeData"
                :key="index"
              >
                <div style="display: flex; justify-content: space-between">
                  <v-list-item-title>{{
                    income.description
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    income.category
                  }}</v-list-item-subtitle>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <v-list-item-subtitle>
                    {{ income.amount.toLocaleString() }} THB
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ new Date(income.date).toLocaleString("en-US", options) }}
                  </v-list-item-subtitle>
                </div>
                <v-list-item-action>
                  <v-btn icon @click="deleteIncome(income.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="graph-column">
        <v-card class="fill-height">
          <v-card-title>
            <span class="headline"
              >Based on
              {{
                selectedMonth != "" ? selectedMonth + "'s" : "Total"
              }}
              spendings</span
            >
          </v-card-title>
          <v-card-text class="fill-height">
            <PieChart :incomeData="filteredPieChartData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Add Income Button -->
    <v-row justify="center" class="mt-4 d-flex flex-row ga-4">
      <v-btn color="red" @click="redirectToDashboard">Back to Dashboard</v-btn>
      <v-btn color="primary" @click="openAddIncomeForm">Add Income</v-btn>
      <AddIncomeForm v-model="dialog" v-on:close-dialog="closeDialog" />
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

<style scoped>
.income-column,
.graph-column {
  display: flex;
  flex-direction: column;
}

.fill-height {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.v-card-text.fill-height {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Income } from "@/types/Types";
import AddIncomeForm from "@/components/AddIncomeForm.vue";
import PieChart from "@/components/IncomePieChart.vue";

const dialog = ref(false);
const router = useRouter();
const isAuthenticated = ref(false);
const search = ref("");
const selectedMonth = ref("");
const months = ref([
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);
const incomeData = ref<Income[]>([]);
const filteredIncomeData = computed(() =>
  incomeData.value.filter(
    (income) =>
      income.description.toLowerCase().includes(search.value.toLowerCase()) &&
      (selectedMonth.value === "" ||
        new Date(income.date)
          .toLocaleString("default", { month: "long" })
          .includes(selectedMonth.value.toString())),
  ),
);

const options = {
  year: "numeric", // Full year (e.g., 2024)
  month: "long", // Full name of the month (e.g., January, February)
  day: "numeric", // Day of the month (e.g., 1, 2, 3)
  hour: "numeric", // Hour (e.g., 1, 2, 3)
  minute: "numeric", // Minute (e.g., 01, 02, 03)
  hour12: true, // 12-hour clock (true) or 24-hour clock (false)
};

const filteredPieChartData = computed(() =>
  incomeData.value.filter(
    (income) =>
      selectedMonth.value === "" ||
      new Date(income.date)
        .toLocaleString("default", { month: "long" })
        .includes(selectedMonth.value.toString()),
  ),
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
      headers: { Authorization: `Bearer ${token}` },
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
    incomeData.value.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
    );
  } catch (error) {
    console.error("Income Failed:", error);
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

const redirectToDashboard = () => {
  router.push("/dashboard");
};

const openAddIncomeForm = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const deleteIncome = async (id: number) => {
  const confirmed = confirm("Are you sure you want to delete this income?");
  if (confirmed) {
    try {
      await axios.delete("http://localhost:8080/api/income?id=" + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      fetchIncomeData();
    } catch (error) {
      alert("Failed to delete income.");
      fetchIncomeData();
    }
  }
};

onMounted(() => {
  checkAuthentication();
  fetchIncomeData();
});
</script>
