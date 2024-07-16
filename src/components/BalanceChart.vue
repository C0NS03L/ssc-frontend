<template>
  <Bar :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const props = defineProps({
  incomeData: Array,
  expenseData: Array,
});

// Function to get last three months' labels
const getLastThreeMonths = () => {
  const labels = [];
  const date = new Date();
  for (let i = 2; i >= 0; i--) {
    const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
    labels.push(month.toLocaleString("default", { month: "long" }));
  }
  return labels;
};

const getMonthlyData = (data, dateField) => {
  const monthlyData = new Array(3).fill(0);
  const date = new Date();
  for (let i = 0; i < data.length; i++) {
    const itemDate = new Date(data[i][dateField]);
    const monthDiff =
      date.getMonth() -
      itemDate.getMonth() +
      12 * (date.getFullYear() - itemDate.getFullYear());
    if (monthDiff >= 0 && monthDiff < 3) {
      monthlyData[2 - monthDiff] += data[i].amount;
    }
  }
  return monthlyData;
};

const chartData = computed(() => ({
  labels: getLastThreeMonths(),
  datasets: [
    {
      label: "Income",
      data: getMonthlyData(props.incomeData, "date"),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
    {
      label: "Expenses",
      data: getMonthlyData(props.expenseData, "date"),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  indexAxis: "y",
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Income vs Expenses (Last 3 Months)",
    },
  },
  scales: {
    x: {
      stacked: false,
      title: {
        display: true,
        text: "Amount (THB)",
      },
    },
    y: {
      stacked: false,
    },
  },
};
</script>
