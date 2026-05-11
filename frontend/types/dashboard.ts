export interface DashboardResumo {
	totalOrcamentos: number;
	totalClientes: number;
	totalProdutosAtivos: number;
}

export interface DashboardOrcamentosPorStatus {
	situacao: string;
	total: number;
}

export interface DashboardOrcamentosPorMes {
	ano: number;
	mes: number;
	total: number;
}

export interface DashboardValorOrcadoPorMes {
	totalValorOrcado: number;
	totalValorOrcadoPendentes: number;
	totalValorOrcadoAprovados: number;
	totalValorOrcadoReprovados: number;
	totalValorOrcadoCancelados: number;
}

export interface DashboardTopClientesOrcamentos {
	totalClientes: number;
	totalClientesPendentes: number;
	totalClientesAprovados: number;
	totalClientesReprovados: number;
	totalClientesCancelados: number;
}

export interface DashboardTopProdutosOrcados {
	totalProdutos: number;
	totalProdutosPendentes: number;
	totalProdutosAprovados: number;
	totalProdutosReprovados: number;
	totalProdutosCancelados: number;
}