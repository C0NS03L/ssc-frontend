<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Income</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="income.description"
            :error="submitted && !income.description"
            label="Description"
            required
          ></v-text-field>
          <v-text-field
            v-model="income.amount"
            :error="submitted && !income.amount"
            label="Amount"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="income.category"
            :items="categories"
            :error="submitted && !income.category"
            label="Category"
            required
          ></v-select>
          <div class="d-flex flex-column justify-center align-center">
            <v-date-picker
              width="100%"
              v-model="income.date"
              :error="submitted && !income.date"
              label="Date"
              required
            ></v-date-picker>
            <v-time-picker
              width="100%"
              v-model="income.time"
              :error="submitted && !income.time"
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
const income = ref({
  description: "",
  amount: null,
  date: new Date(),
  time: new Date(),
  category: "",
});

const categories = ["Salary", "Gift", "Investment", "Others"];
const submitted = ref(false);

const submitForm = async () => {
  submitted.value = true;
  if (formInvalid.value) {
    console.error("Please fill in all fields.");
    return;
  }
  if (!income.value.date || !income.value.time) {
    console.error("Please select a date and time.");
    return;
  }

  let date = new Date(income.value.date);
  var hours, minutes;
  if (typeof income.value.time === "object") {
    [hours, minutes] = income.value.time.toTimeString().split(":").map(Number);
  } else {
    [hours, minutes] = (income.value.time as string).split(":").map(Number);
  }

  date.setHours(hours, minutes);

  try {
    const response = await axios.post(
      "http://localhost:8080/api/income",
      {
        description: income.value.description,
        amount: income.value.amount,
        date: toFormattedTime(date),
        category: income.value.category,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    console.log("Income added successfully:", response.data);
    resetForm();
    window.location.href = "/income";
  } catch (error) {
    console.error("Failed to add income:", error);
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
  income.value.description = "";
  income.value.amount = null;
  income.value.date = new Date();
  income.value.time = new Date();
  income.value.category = "";
  submitted.value = false;
}

const formInvalid = ref(false);
watchEffect(() => {
  formInvalid.value =
    !income.value.description ||
    !income.value.amount ||
    !income.value.date ||
    !income.value.time ||
    !income.value.category;
});
</script>

<style scoped></style>
