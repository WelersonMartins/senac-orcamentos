import { useEffect, useState } from "react";
import { Produto } from "@/types/produtos";
import { getProdutos, deleteProduto } from "@/app/(system)/produtos/actions";
import { Table, Button } from "react-bootstrap";
import { PopUpInclusaoEdicaoProdutos } from ".";
import { ConfirmDialog } from "../CofirmDialog";
import { notify } from "../Notify";

export default function TabelaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showModalInclusaoEdicao, setShowModalInclusaoEdicao] = useState(false);
  const [codProduto, setCodProduto] = useState<number | undefined | null>(null);
  const [showModalConfirmarExlusao, setShowModalConfirmarExlusao] = useState(false);
  const [idProdutoExclusao, setIdProdutoExclusao] = useState<number | undefined | null>(null);

  useEffect(() => {
    getProdutos().then((data) => setProdutos(data));
  }, []);

  const handleEditar = (id: number | undefined | null) => {
    setCodProduto(id);
    setShowModalInclusaoEdicao(true);
  };

  const handleExcluir = async (id: number | undefined | null) => {
    if (id === undefined || id === null) return;
    try {
      await deleteProduto(id);
      notify("Produto excluído com sucesso.", "success");
      void getProdutos().then((data) => setProdutos(data));
      setShowModalConfirmarExlusao(false);
      setIdProdutoExclusao(undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Não foi possível excluir o produto.";
      notify(msg, "danger");
    }
  };

  const handleShowModalConfirmarExlusao = (id: number | undefined | null) => {
    setIdProdutoExclusao(id);
    setShowModalConfirmarExlusao(true);
  };


  return (
    <div className="table-responsive">
      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Código SKU</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço Unitário</th>
            <th>Unidade</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.codigoSku}</td>
              <td>{item.nome}</td>
              <td>{item.descricao}</td>
              <td>{item.precoUnitario}</td>
              <td>{item.unidade}</td>
              <td>{item.ativo ? "Sim" : "Não"}</td>
              <td className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEditar(item.id)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowModalConfirmarExlusao(item.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
	  <PopUpInclusaoEdicaoProdutos
        visible={showModalInclusaoEdicao}
        codProduto={codProduto}
        onHide={() => setShowModalInclusaoEdicao(false)}
        onSaveSuccess={() => {
          setShowModalInclusaoEdicao(false);
          void getProdutos().then((data) => setProdutos(data));
        }}
      />
	  <ConfirmDialog
        visible={showModalConfirmarExlusao}
        onHide={() => setShowModalConfirmarExlusao(false)}
        aoConfirmar={() => handleExcluir(idProdutoExclusao)}
        titulo="Exclusão de Produto"
        mensagem="Tem certeza que deseja excluir o produto?"
      />
    </div>
  );
}
