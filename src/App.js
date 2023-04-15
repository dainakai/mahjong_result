import "./styles.css";
import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Data from "./data.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const zoomOptions = {
  pan: {
    enabled: true,
    mode: "x",
    speed: 0.01,
  },
  zoom: {
    wheel: {
      enabled: true
    },
    pinch: {
      enabled: true
    },
    mode: "x",
    speed: 0.00001,
  }
};

const isSmallScreen = window.innerWidth < 600;

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: isSmallScreen ? 'bottom' : 'top',
      labels: {
        boxWidth: isSmallScreen ? 20 : 40,
      },
    },
    title: {
      display: true,
      text: "Mahjong Score Chart"
    },
    zoom: zoomOptions,
    tooltip: {
      titleFont: { size: 17 },
      bodyFont: { size: 17 },
      titleMarginBottom: 15,
      backgroundColor: "rgba(255,112,162,0.8)",
      titleColor: "rgba(0,0,0,1)",
      bodyColor: "rgba(0,0,0,1)",
      displayColors: true,
      xAlign: "center"
    },
  }
};

const labels = [];
const formattedLabels = [];
const firstUser = Data.UserInfo[0];
for (const key in firstUser) {
  // Check if the key is a date (length of 8 and starts with "20")
  if (key.length === 8 && key.startsWith("20")) {
    const year = key.slice(0, 4);
    const month = key.slice(4, 6);
    const day = key.slice(6, 8);
    const formattedDate = `${year}/${month}/${day}`;
    labels.push(key);
    formattedLabels.push(formattedDate);
  }
}
// const labels = ["1", "2"];

const data = {
  labels,
  datasets: []
};

for (const user of Data.UserInfo) {
  const dataset = {
    label: user.name,
    data: [],
    borderColor: user.color,
    backgroundColor: user.color,
    pointRadius : 10,
    pointHoverRadius: 50,
    spanGaps: true
  };
  let sumscore = 0;
  for (let i = 0; i < labels.length; i++) {
    const date = labels[i];
    const score = user[date];
    if (score === undefined){
      dataset.data.push(null);
      continue;
    }
    sumscore = sumscore + score;
    dataset.data.push(sumscore);
    // dataset.data.push(sumscore);
  }
  data.datasets.push(dataset);
}


export default function App() {
  const chartRef = useRef(null);

  const onResetZoom = () => {
    chartRef.current.resetZoom();
  };

  return (
    <div className="App">
      <Line ref={chartRef} options={options} data={data} />
      <button onClick={onResetZoom}>zoom reset</button>
    </div>
  );
}