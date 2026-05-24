"use client";

import { Card, Table } from "react-bootstrap";

export type ItemRanking = {
  id: number;
  nome: string;
  total: number;
};

interface TabelaRankingProps {
  titulo?: string;
  colunaNome: string;
  colunaTotal: string;
  dados: ItemRanking[];
}

export default function TabelaRanking({
  titulo,
  colunaNome,
  colunaTotal,
  dados,
}: TabelaRankingProps) {
  return (
    <Card className="shadow-sm">
      {titulo && (
        <Card.Header className="bg-white fw-semibold">{titulo}</Card.Header>
      )}
      <Card.Body className="p-0">
        {dados.length === 0 ? (
          <p className="text-muted mb-0 p-3">Nenhum dado disponível.</p>
        ) : (
          <Table
            responsive
            className="align-middle app-data-table table-striped table-hover mb-0"
          >
            <thead>
              <tr>
                <th style={{ width: "3rem" }}>#</th>
                <th>{colunaNome}</th>
                <th className="text-end" style={{ width: "8rem" }}>
                  {colunaTotal}
                </th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, indice) => (
                <tr key={item.id}>
                  <td>{indice + 1}</td>
                  <td>{item.nome}</td>
                  <td className="text-end">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
