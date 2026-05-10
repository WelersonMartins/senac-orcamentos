/** Payload para POST /clientes (camelCase, alinhado ao DTO da API). */
export type Cliente = {
	id?: number;
	nome: string;
	documento?: string | null;
	email?: string | null;
	telefone?: string | null;
	observacoes?: string | null;
	usuarioCriadorId?: number | null;
	criadoEm?: Date;
	atualizadoEm?: Date;
};


