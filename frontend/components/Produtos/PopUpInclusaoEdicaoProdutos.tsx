"use client";

import { createProduto, getProduto, updateProduto, deleteProduto } from "@/app/(system)/produtos/actions";
import { notify } from "@/components/Notify";
import { Modal, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Produto } from "@/types/produtos";

type Props = {
  visible: boolean;
  codProduto: number | null | undefined;
  onHide: () => void;
  onSaveSuccess?: () => void;
};

export default function PopUpInclusaoEdicaoProdutos({
  visible,
  codProduto,
  onHide,
  onSaveSuccess,
}: Props) {

  const [idProduto, setIdProduto] = useState<number | undefined | null>(codProduto);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [unidade, setUnidade] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [codigoSku, setCodigoSku] = useState("");

  const handleSave = async () => {
    try {
		const produto: Produto = {
			id: idProduto,
			codigoSku,
			nome,
			descricao,
			precoUnitario,
			unidade,
			ativo,
		};
      if (codProduto) {
        await updateProduto(idProduto, produto);
        notify("Produto atualizado com sucesso.", "success");
      } else {
        await createProduto(produto);
        notify("Produto cadastrado com sucesso.", "success");
      }
      onSaveSuccess?.();
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : codProduto
            ? "Não foi possível atualizar o produto."
            : "Não foi possível cadastrar o produto.";
      notify(msg, "danger");
    }
  };

  useEffect(() => {
    if (!visible) return;

    if (codProduto) {
      void getProduto(codProduto)
        .then((dados) => {
          setNome(dados.nome ?? "");
          setDescricao(dados.descricao ?? "");
          setPrecoUnitario(dados.precoUnitario ?? "");
          setUnidade(dados.unidade ?? "");
          setAtivo(dados.ativo ?? true);
          setCodigoSku(dados.codigoSku ?? "");
        })
        .catch(() => {
          notify("Não foi possível carregar os dados do cliente.", "danger");
        });
    } else {
      setNome("");
	  setCodigoSku("");
      setDescricao("");
      setPrecoUnitario(0);
      setUnidade("");
      setAtivo(true);
      setCodigoSku("");
    }
  }, [visible, codProduto]);

  return (
    <Modal show={visible} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {codProduto ? "Edição de produto" : "Inclusão de produto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>
		  <Form.Group className="mb-3">
            <Form.Label>Código SKU</Form.Label>
            <Form.Control
              type="text"
              value={codigoSku}
              onChange={(e) => setCodigoSku(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Preço Unitário</Form.Label>
            <Form.Control
              type="number"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unidade</Form.Label>
            <Form.Control
              type="text"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
			<Form.Check
              type="checkbox"
              label="Ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={() => void handleSave()}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
