export type Produto = {
	id?: number | undefined | null;
	codigoSku?: string;
	nome?: string;
	descricao?: string;
	precoUnitario?: number;
	unidade?: string;
	ativo?: boolean;
	criadoEm?: Date;
	atualizadoEm?: Date;
};