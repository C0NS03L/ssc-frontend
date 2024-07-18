<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" class="pieChart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Income } from "@/types/Types";

Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  incomeData: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => {
  const categories = ["Salary", "Gift", "Investment", "Others"];
  const categoryAmounts = categories.map((category) => {
    return props.incomeData
      .filter((income) => (income as Income).category === category)
      .reduce((sum, income) => sum + (income as Income).amount, 0);
  });

  return {
    labels: categories,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A"],
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
