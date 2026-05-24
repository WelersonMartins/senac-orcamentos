'use client';

import { Row, Col, Card } from "react-bootstrap";

interface IndicadorProps {
  titulo: string;
  valor: string;
}

export default function Indicador({ titulo, valor }: IndicadorProps) {
  return (

    <Card className="text-center shadow-sm">
      <Card.Body>
        <Card.Title className="text-muted">{titulo}</Card.Title>
        <Card.Text className="h3">{valor}</Card.Text>
      </Card.Body>
    </Card>
  );
}
