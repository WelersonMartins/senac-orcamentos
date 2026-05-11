'use server';

import { apiServerFetch } from "@/lib/api-server";
import { Produto } from "@/types/produtos";

export async function getProdutos(){

	const response = await apiServerFetch('/produtos')
	return response.json()
}

export async function getProduto(id: number | undefined | null){
	const response = await apiServerFetch(`/produtos/${id}`)
	return response.json()
}

export async function createProduto(produto: Produto){
	const response = await apiServerFetch('/produtos', {
		method: 'POST',
		body: JSON.stringify(produto),
	})
	return response.json()
}

export async function updateProduto(id: number | undefined | null, produto: Produto){
	const response = await apiServerFetch(`/produtos/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(produto),
	})
	return response.json()
}

export async function deleteProduto(id: number | undefined | null){
	const response = await apiServerFetch(`/produtos/${id}`, {
		method: 'DELETE',
	})
	return response.json()
}
