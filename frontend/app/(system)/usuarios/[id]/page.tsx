export default async function Usuario({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return(
		<div>
			<h1>Usuario {id}</h1>
			<p>Bem-vindo ao sistema de usuarios</p>
			<p>Este é um sistema de usuarios</p>
			<p>Este é um sistema de usuarios</p>
		</div>
	)

}