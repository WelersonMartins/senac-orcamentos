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
import { formatarMoeda } from "@/lib/format";

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
  tipoValor?: "numero" | "moeda";
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

export default function GraficoLinha({
  titulo,
  dados,
  tipoValor = "numero",
}: GraficoLinhaProps) {
  const formatar = (n: number) =>
    tipoValor === "moeda" ? formatarMoeda(n) : String(n);

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
        position: "top" as const,
      },
      title: {
        display: true,
        text: titulo,
      },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            formatar(ctx.parsed.y ?? 0),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => formatar(Number(value)),
        },
      },
    },
  };

  return (
    <Card className="shadow-sm p-3">
      <Line options={options} data={data} />
    </Card>
  );
}
