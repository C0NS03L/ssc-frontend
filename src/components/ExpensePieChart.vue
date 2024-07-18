<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" class="pieChart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Expense } from "@/types/Types"; // Make sure to update this import to your expense type

Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  expenseData: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => {
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Shopping",
    "Bills",
    "Others",
  ];
  const categoryAmounts = categories.map((category) => {
    return props.expenseData
      .filter((expense) => (expense as Expense).category === category)
      .reduce((sum, expense) => sum + (expense as Expense).amount, 0);
  });

  return {
    labels: categories,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8BC34A",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8BC34A",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style>
.pieChart {
  width: 500px;
  height: 500px;
}

/* Styles for desktop */
@media (min-width: 768px) {
  .pieChart {
    width: 500px;
    height: 500px;
  }
}

/* Styles for mobile (phones) */
@media (max-width: 767px) {
  .pieChart {
    width: 300px;
    height: 300px;
  }
}
</style>
