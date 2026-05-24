"use client";

import { Container, Row, Col } from "react-bootstrap";
import Indicador from "./Indicador";
import GraficoLinha from "./GraficoLinha";
import GraficoPizza from "./GraficoPizza";
import TabelaRanking from "./TabelaRanking";
import { useState, useEffect } from "react";
import {
  DashboardResumo,
  DashboardOrcamentosPorStatus,
  DashboardOrcamentosPorMes,
  DashboardValorOrcadoPorMes,
  DashboardTopClientesOrcamentos,
  DashboardTopProdutosOrcados,
} from "@/types/dashboard";
import {
  getDashboardResumo,
  getDashboardOrcamentosPorStatus,
  getDashboardOrcamentosPorMes,
  getDashboardValorOrcadoPorMes,
  getDashboardTopClientesOrcamentos,
  getDashboardTopProdutosOrcados,
} from "@/app/(system)/dashboard/actions";
import { ItemGraficoPizza } from "./GraficoPizza";
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardResumo, setDashboardResumo] =
    useState<DashboardResumo | null>(null);
  const [dashboardOrcamentosPorStatus, setDashboardOrcamentosPorStatus] =
    useState<ItemGraficoPizza[] >([]);
  const [dashboardOrcamentosPorMes, setDashboardOrcamentosPorMes] =
    useState<DashboardOrcamentosPorMes[]>([]);
  const [dashboardValorOrcadoPorMes, setDashboardValorOrcadoPorMes] =
    useState<DashboardValorOrcadoPorMes[]>([]);
  const [dashboardTopClientesOrcamentos, setDashboardTopClientesOrcamentos] =
    useState<DashboardTopClientesOrcamentos[]>([]);
  const [dashboardTopProdutosOrcados, setDashboardTopProdutosOrcados] =
    useState<DashboardTopProdutosOrcados[]>([]);

  useEffect(() => {
    getDashboardResumo().then((data) => {
      setDashboardResumo(data);
    });
	getDashboardOrcamentosPorStatus().then((data: DashboardOrcamentosPorStatus[]) => {
		const dadosPadronizados: ItemGraficoPizza[] = data.map((item: DashboardOrcamentosPorStatus) => ({
			label: item.situacao,
			valor: item.total,
		}));
		console.log('padronizando dados para grafico pizza', dadosPadronizados);
		setDashboardOrcamentosPorStatus(dadosPadronizados);
	});

    getDashboardOrcamentosPorMes(2026).then((data: DashboardOrcamentosPorMes[]) => {
		const dadosPadronizados: DashboardOrcamentosPorMes[] = data.map((item: DashboardOrcamentosPorMes) => ({
			ano: item.ano,
			mes: item.mes,
			total: item.total,
		}));
      setDashboardOrcamentosPorMes(data);
    });
    getDashboardValorOrcadoPorMes(2026).then(setDashboardValorOrcadoPorMes);
    getDashboardTopClientesOrcamentos(10).then(setDashboardTopClientesOrcamentos);
    getDashboardTopProdutosOrcados(10).then(setDashboardTopProdutosOrcados);
    setLoading(false);
  }, []);
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={36} className="p-4">
          <h2>Visão Geral</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <>
			<h3>Resumo</h3>
			  <Row className="g-4 pt-4">
                <Col md={4}>
                  <Indicador
                    titulo={"Total de Orçamentos"}
                    valor={dashboardResumo?.totalOrcamentos.toString() || "0"}
                  />
                </Col>
                <Col md={4}>
                  <Indicador
                    titulo={"Total de Clientes"}
                    valor={dashboardResumo?.totalClientes.toString() || "0"}
                  />
                </Col>
                <Col md={4}>
                  <Indicador
                    titulo={"Total de Produtos Ativos"}
                    valor={
                      dashboardResumo?.totalProdutosAtivos.toString() || "0"
                    }
                  />
                </Col>
              </Row>
			  
			  <Row className="g-4 pt-4">
			 
				<Col md={4}>
					<h4>Orçamentos por Status</h4>
					<GraficoPizza titulo="Orçamentos por Status" dados={dashboardOrcamentosPorStatus} />
				</Col>
			  
				<Col md={4}>
					<h4>Orçamentos por Mês</h4>
					<GraficoLinha titulo="Orçamentos por Mês" dados={dashboardOrcamentosPorMes} />
				</Col>

				<Col md={4}>
					<h4>Valor orçado por mês</h4>
					<GraficoLinha
						titulo="Valor orçado por mês (2026)"
						dados={dashboardValorOrcadoPorMes}
						tipoValor="moeda"
					/>
				</Col>
			  </Row>

			  <Row className="g-4 pt-4 mt-2">
				<Col md={6}>
					<h4>Top clientes por orçamentos</h4>
					<TabelaRanking
						colunaNome="Cliente"
						colunaTotal="Orçamentos"
						dados={dashboardTopClientesOrcamentos.map((c) => ({
							id: c.clienteId,
							nome: c.nome,
							total: c.totalOrcamentos,
						}))}
					/>
				</Col>
				<Col md={6}>
					<h4>Top produtos orçados</h4>
					<TabelaRanking
						colunaNome="Produto"
						colunaTotal="Ocorrências"
						dados={dashboardTopProdutosOrcados.map((p) => ({
							id: p.produtoId,
							nome: p.nome,
							total: p.totalOcorrencias,
						}))}
					/>
				</Col>
			  </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
