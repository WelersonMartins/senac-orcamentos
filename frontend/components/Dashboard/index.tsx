"use client";

import { Container, Row, Col } from "react-bootstrap";
import Indicador from "./Indicador";
import GraficoLinha from "./GraficoLinha";
import GraficoPizza from "./GraficoPizza";
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
    useState<DashboardValorOrcadoPorMes | null>(null);
  const [dashboardTopClientesOrcamentos, setDashboardTopClientesOrcamentos] =
    useState<DashboardTopClientesOrcamentos | null>(null);
  const [dashboardTopProdutosOrcados, setDashboardTopProdutosOrcados] =
    useState<DashboardTopProdutosOrcados | null>(null);

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
    getDashboardValorOrcadoPorMes(2026).then((data) => {
      setDashboardValorOrcadoPorMes(data);
    });
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
					<h3>Orçamentos por Mês</h3>
					<GraficoLinha titulo="Orçamentos por Mês" dados={dashboardOrcamentosPorMes} />
				</Col>
			  </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
