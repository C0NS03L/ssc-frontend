<template>
  <Bar id="income-expense-chart" :options="chartOptions" :data="chartData" />
</template>

<script>
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

export default {
  name: "BarChart",
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [
          {
            label: "Income",
            data: [5000, 5500, 6000],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Expenses",
            data: [4000, 4200, 4500],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      },
      chartOptions: {
        responsive: true,
        indexAxis: "y",
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Income vs Expenses",
          },
        },
        scales: {
          x: {
            stacked: false,
            title: {
              display: true,
              text: "Amount ($)",
            },
          },
          y: {
            stacked: false,
          },
        },
      },
    };
  },
};
</script>
