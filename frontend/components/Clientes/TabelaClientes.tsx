"use client";

import { getClientes, excluirCliente } from "@/app/(system)/clientes/actions";
import { Cliente as ClienteType } from "@/types/clientes";
import { PopUpInclusaoEdicao } from "@/components/Clientes";
import { Table, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/CofirmDialog";
import { notify } from "@/components/Notify";

export default function TabelaClientes() {
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showPopUpInclusaoEdicao, setShowPopUpInclusaoEdicao] = useState(false);
  const [idCliente, setIdCliente] = useState<number | null | undefined>(null);
  const [idClienteExclusao, setIdClienteExclusao] = useState<number | undefined>(undefined);

  const [showModalConfirmarExlusao, setShowModalConfirmarExlusao] = useState(false);

  const loadClientes = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch {
      setLoadError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleShowModalConfirmarExlusao = useCallback(
    (id: number | undefined) => {
      if (id === undefined || id === null) return;
      setIdClienteExclusao(id);
      setShowModalConfirmarExlusao(true);
    },
    [],
  );

  const handleConfirmarExclusao = useCallback(async () => {
    if (!idClienteExclusao) {
      return;
    }
    try {
      await excluirCliente(idClienteExclusao);
      notify("Cliente excluído com sucesso.", "success");
      void loadClientes();
      setShowModalConfirmarExlusao(false);
      setIdClienteExclusao(undefined);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível excluir o cliente.";
      notify(msg, "danger");
    }
  }, [loadClientes, idClienteExclusao]);

  useEffect(() => {
    void loadClientes();
  }, [loadClientes]);

  const fecharModal = () => {
    setShowPopUpInclusaoEdicao(false);
  };

  const handleSaveSuccess = useCallback(() => {
    void loadClientes();
    setShowPopUpInclusaoEdicao(false);
  }, [loadClientes]);

  const handleEditar = (id: number | undefined) => {
    setIdCliente(id);
    setShowPopUpInclusaoEdicao(true);
  };

  const handleIncluir = () => {
    setIdCliente(null);
    setShowPopUpInclusaoEdicao(true);
  };

  return (
    <div className="table-responsive">
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <Button variant="primary" size="sm" onClick={handleIncluir}>
          Incluir novo Cliente
        </Button>
      </div>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && loadError && <p className="text-danger">{loadError}</p>}

      {!loading && !loadError && (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle app-data-table"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Telefone</th>
              <th>Observações</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nome}</td>
                <td>{item.email}</td>
                <td>{item.documento}</td>
                <td>{item.telefone}</td>
                <td>{item.observacoes}</td>
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
      )}

      <PopUpInclusaoEdicao
        visible={showPopUpInclusaoEdicao}
        idCliente={idCliente}
        onHide={fecharModal}
        onSaveSuccess={handleSaveSuccess}
      />
      <ConfirmDialog
        visible={showModalConfirmarExlusao}
        titulo="Excluir Cliente"
        mensagem="Tem certeza que deseja excluir o cliente?"
        aoConfirmar={handleConfirmarExclusao}
        onHide={() => {
          setShowModalConfirmarExlusao(false);
          setIdClienteExclusao(undefined);
        }}
      />
    </div>
  );
}
