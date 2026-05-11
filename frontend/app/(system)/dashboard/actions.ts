'use server';

import { apiServerFetch } from "@/lib/api-server";
import { DashboardResumo, DashboardOrcamentosPorStatus, DashboardOrcamentosPorMes, DashboardValorOrcadoPorMes, DashboardTopClientesOrcamentos, DashboardTopProdutosOrcados } from "@/types/dashboard";


/**
 * GET /api/dashboard/resumo
GET /api/dashboard/orcamentos-por-status
GET /api/dashboard/orcamentos-por-mes?ano=2026
GET /api/dashboard/valor-orcado-por-mes?ano=2026
GET /api/dashboard/top-clientes-orcamentos?limit=10
GET /api/dashboard/top-produtos-orcados?limit=10
 */

export async function getDashboardResumo(): Promise<DashboardResumo> {
	const response = await apiServerFetch('/dashboard/resumo');
	return response.json();
}

export async function getDashboardOrcamentosPorStatus(): Promise<DashboardOrcamentosPorStatus[]> {
	const response = await apiServerFetch('/dashboard/orcamentos-por-status');
	return response.json();
}

export async function getDashboardOrcamentosPorMes(ano: number): Promise<DashboardOrcamentosPorMes[]> {
	const response = await apiServerFetch(`/dashboard/orcamentos-por-mes?ano=${ano}`);
	return response.json();
}

export async function getDashboardValorOrcadoPorMes(ano: number): Promise<DashboardValorOrcadoPorMes> {
	const response = await apiServerFetch(`/dashboard/valor-orcado-por-mes?ano=${ano}`);
	return response.json();
}

export async function getDashboardTopClientesOrcamentos(limit: number): Promise<DashboardTopClientesOrcamentos> {
	const response = await apiServerFetch(`/dashboard/top-clientes-orcamentos?limit=${limit}`);
	return response.json();
}

export async function getDashboardTopProdutosOrcados(limit: number): Promise<DashboardTopProdutosOrcados> {
	const response = await apiServerFetch(`/dashboard/top-produtos-orcados?limit=${limit}`);
	return response.json();
}