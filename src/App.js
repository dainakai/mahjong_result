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
    enabled: true,
    wheel: {
      enabled: false
    },
    pinch: {
      enabled: false
    },
    mode: "x",
    speed: 0.00001,
  }
};

const isSmallScreen = window.innerWidth < 600;

const options1 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: isSmallScreen ? 20 : 40,
      },
    },
    title: {
      display: true,
      text: '累積得点チャート',
      font: {
        size: 24,
      },
    },
    zoom: zoomOptions,
    tooltip: {
      titleFont: { size: 17 },
      bodyFont: { size: 24 },
      titleMarginBottom: 15,
      backgroundColor: "rgba(180,180,180,0.6)",
      titleColor: "rgba(0,0,0,1)",
      bodyColor: "rgba(0,0,0,1)",
      displayColors: true,
      xAlign: "center"
    },
  }
};

const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: isSmallScreen ? 20 : 40,
      },
    },
    title: {
      display: true,
      text: '日毎得点チャート',
      font: {
        size: 24,
      },
    },
    zoom: zoomOptions,
    tooltip: {
      titleFont: { size: 17 },
      bodyFont: { size: 24 },
      titleMarginBottom: 15,
      backgroundColor: "rgba(180,180,180,0.6)",
      titleColor: "rgba(0,0,0,1)",
      bodyColor: "rgba(0,0,0,1)",
      displayColors: true,
      xAlign: "center"
    },
  }
};

// ラベルの定義
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

// チャート1,2のデータ定義
const data1 = {
  labels,
  datasets: []
};

const data2 = {
  labels,
  datasets: []
};

for (const user of Data.UserInfo) {
  const dataset1 = {
    label: user.name,
    data: [],
    borderColor: user.color,
    backgroundColor: user.color,
    pointRadius : 10,
    pointHoverRadius: 50,
    spanGaps: true
  };
  const dataset2 = {
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
      dataset1.data.push(null);
      dataset2.data.push(null);
      continue;
    }
    sumscore = sumscore + score;
    dataset1.data.push(sumscore);
    dataset2.data.push(score);
    // dataset.data.push(sumscore);
  }
  data1.datasets.push(dataset1);
  data2.datasets.push(dataset2);
}

export default function App() {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  const onResetZoom = (ref) => {
    ref.current.resetZoom();
  };

  const onZoomIn = (ref) => {
    ref.current.zoom(1.1);
  };

  const onZoomOut = (ref) => {
    ref.current.zoom(0.9);
  };

  const onPanRight = (ref) => {
    ref.current.pan({ x: -50 }, undefined, "default");
  };

  const onPanLeft = (ref) => {
    ref.current.pan({ x: 50 }, undefined, "default");
  };

  return (
    <div className="App">
      <div className="Header">
        <h1>Mahjong Score Charts</h1>
      </div>
      <div className="Chart1">
        <Line ref={chartRef1} options={options1} data={data1} />
        <div className="Chart1-Buttons">
          <button className="Chart-Button" onClick={() => onResetZoom(chartRef1)}>zoom reset</button>
          <button className="Chart-Button" onClick={() => onZoomIn(chartRef1)}>+</button>
          <button className="Chart-Button" onClick={() => onZoomOut(chartRef1)}>-</button>
          <button className="Chart-Button" onClick={() => onPanRight(chartRef1)}>&gt;</button>
          <button className="Chart-Button" onClick={() => onPanLeft(chartRef1)}>&lt;</button>
        </div>
      </div>
      <div className="Chart2">
        <Line ref={chartRef2} options={options2} data={data2} />
        <div className="Chart2-Buttons">
          <button className="Chart-Button" onClick={() => onResetZoom(chartRef2)}>zoom reset</button>
          <button className="Chart-Button" onClick={() => onZoomIn(chartRef2)}>+</button>
          <button className="Chart-Button" onClick={() => onZoomOut(chartRef2)}>-</button>
          <button className="Chart-Button" onClick={() => onPanRight(chartRef2)}>&gt;</button>
          <button className="Chart-Button" onClick={() => onPanLeft(chartRef2)}>&lt;</button>
        </div>
      </div>
    </div>
  );
}