"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function GasChart({ labels, values }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Predicted Gas (Gwei)",
        data: values,
        borderColor: "rgb(6, 182, 212)",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: { display: false },
      y: { display: true, grid: { color: "rgba(255, 255, 255, 0.05)" } }, 
    },
    plugins: { legend: { display: false } },
  };
  return <Line data={chartData} options={options} />;
}