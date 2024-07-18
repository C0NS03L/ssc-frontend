<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Expense</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="expense.description"
            :error="submitted && !expense.description"
            label="Description"
            required
          ></v-text-field>
          <v-text-field
            v-model="expense.amount"
            :error="submitted && !expense.amount"
            label="Amount"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="expense.category"
            :items="categories"
            :error="submitted && !expense.category"
            label="Category"
            required
          ></v-select>
          <div class="d-flex flex-column justify-center align-center">
            <v-date-picker
              width="100%"
              v-model="expense.date"
              :error="submitted && !expense.date"
              label="Date"
              required
            ></v-date-picker>
            <v-time-picker
              width="100%"
              v-model="expense.time"
              :error="submitted && !expense.time"
              label="Time"
              required
            ></v-time-picker>
          </div>
          <v-alert v-if="submitted && formInvalid" type="error" dismissible>
            Please fill in all fields.
          </v-alert>
          <v-card-actions>
            <v-btn color="primary" type="submit">Save</v-btn>
            <v-btn color="red" @click="$emit('close-dialog')">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const dialog = ref(true);
const expense = ref({
  description: "",
  amount: null,
  date: new Date(),
  time: new Date(),
  category: "",
});

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Bills",
  "Others",
];
const submitted = ref(false);

const submitForm = async () => {
  submitted.value = true;
  if (formInvalid.value) {
    console.error("Please fill in all fields.");
    return;
  }
  if (!expense.value.date || !expense.value.time) {
    console.error("Please select a date and time.");
    return;
  }

  let date = new Date(expense.value.date);
  var hours, minutes;
  if (typeof expense.value.time === "object") {
    [hours, minutes] = expense.value.time.toTimeString().split(":").map(Number);
  } else {
    [hours, minutes] = (expense.value.time as string).split(":").map(Number);
  }

  date.setHours(hours, minutes);

  try {
    const response = await axios.post(
      "http://localhost:8080/api/expense",
      {
        description: expense.value.description,
        amount: expense.value.amount,
        date: toFormattedTime(date),
        category: categories.includes(expense.value.category)
          ? expense.value.category
          : "Others",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    console.log("Expense added successfully:", response.data);
    resetForm();
    window.location.href = "/expense";
  } catch (error) {
    console.error("Failed to add expense:", error);
  }
};

function toFormattedTime(date: Date) {
  var year = date.getFullYear();
  var month = pad(date.getMonth() + 1);
  var day = pad(date.getDate());
  var hours = pad(date.getHours());
  var minutes = pad(date.getMinutes());
  var seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function pad(number: number) {
  if (number < 10) {
    return "0" + number;
  }
  return number.toString();
}

function resetForm() {
  expense.value.description = "";
  expense.value.amount = null;
  expense.value.date = new Date();
  expense.value.time = new Date();
  expense.value.category = "";
  submitted.value = false;
}

const formInvalid = ref(false);
watchEffect(() => {
  formInvalid.value =
    !expense.value.description ||
    !expense.value.amount ||
    !expense.value.date ||
    !expense.value.time ||
    !expense.value.category;
});
</script>

<style scoped></style>
