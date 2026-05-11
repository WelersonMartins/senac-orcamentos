"use client";

import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export type ItemGraficoLinha = {
  ano: number;
  mes: number;
  total: number;
};

export interface GraficoLinhaProps {
  titulo?: string;
  dados: ItemGraficoLinha[];
}

enum Meses {
  Janeiro = 1,
  Fevereiro = 2,
  Março = 3,
  Abril = 4,
  Maio = 5,
  Junho = 6,
  Julho = 7,
  Agosto = 8,
  Setembro = 9,
  Outubro = 10,
  Novembro = 11,
  Dezembro = 12,
}

export default function GraficoLinha({ titulo,  dados, }: GraficoLinhaProps) {
  const data = {
    labels: dados.map((item) => Meses[item.mes]),
    datasets: [
      {
        label: "Total",
        data: dados.map((item) => item.total),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: titulo,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="shadow-sm p-3">
      <Line options={options} data={data} />
    </Card>
  );
}
