export interface DashboardResumo {
	totalOrcamentos: number;
	totalClientes: number;
	totalProdutosAtivos: number;
}

export interface DashboardOrcamentosPorStatus {
	situacao: string;
	total: number;
}

export type SerieMensal = {
	ano: number;
	mes: number;
	total: number;
};

export type DashboardOrcamentosPorMes = SerieMensal;

export type DashboardValorOrcadoPorMes = SerieMensal;

export interface DashboardTopClientesOrcamentos {
	clienteId: number;
	nome: string;
	totalOrcamentos: number;
}

export interface DashboardTopProdutosOrcados {
	produtoId: number;
	nome: string;
	totalOcorrencias: number;
}