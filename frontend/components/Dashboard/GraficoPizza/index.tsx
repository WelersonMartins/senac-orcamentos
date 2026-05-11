'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

export type ItemGraficoPizza = {
  label: string;
  valor: number;
};

type GraficoPizzaProps = {
  titulo: string;
  dados: ItemGraficoPizza[] ;
};

const CORES = [
  '#1e40af', // azul primary
  '#ea580c', // laranja secondary
  '#16a34a', // verde
  '#dc2626', // vermelho
  '#64748b', // cinza
];

export default function GraficoPizza({ titulo, dados }: GraficoPizzaProps) {
  const data = {
    labels: dados.map((item) => item.label),
    datasets: [
      {
        data: dados.map((item) => item.valor),
        backgroundColor: CORES,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: titulo,
      },
    },
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Doughnut data={data} options={options} />
      </Card.Body>
    </Card>
  );
}