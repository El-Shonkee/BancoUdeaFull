import { useEffect, useState } from "react";
import '../App.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [form, setForm] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    firstName: "",
    lastName: "",
    balance: 0,
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener los clientes:", err);
        setLoading(false);
      });
  }, []);

  const cargarClientes = async () => {
    const res = await fetch("http://localhost:8080/api/customers");
    const data = await res.json();
    setClientes(data);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/customers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setClientes(clientes.filter((c) => c.id !== id));
      } else {
        alert("Error al eliminar cliente");
      }
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente.id);
    setForm({ ...cliente });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/customers/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const clienteActualizado = await res.json();
        setClientes(clientes.map((c) => (c.id === form.id ? clienteActualizado : c)));
        setClienteEditando(null);
      } else {
        alert("Error al actualizar cliente");
      }
    } catch (err) {
      console.error("Error actualizando cliente:", err);
    }
  };

  const handleCancelar = () => {
    setClienteEditando(null);
  };

  const handleCrearNuevoCliente = async (e) => {
    e.preventDefault();
    const { firstName, lastName } = nuevoCliente;

    if (!firstName || !lastName ) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });

      if (res.ok) {
        setMensaje("Cliente creado con éxito.");
        setNuevoCliente({ firstName: "", lastName: "", accountNumber: "", balance: 0 });
        setMostrarFormulario(false);
        cargarClientes();
      } else {
        const error = await res.text();
        setMensaje("Error: " + error);
      }
    } catch (err) {
      console.error("Error creando cliente:", err);
      setMensaje("Error en la creación del cliente.");
    }
  };

  if (loading) return <p className="message">Cargando clientes...</p>;

  return (
    <div className="container">
      <h2>Listado de Clientes</h2>

      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? "Cancelar" : "➕ Nuevo Cliente"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrearNuevoCliente} style={{ marginTop: "20px" }}>
          <h3>Crear Nuevo Cliente</h3>
          <input
            placeholder="Nombre"
            value={nuevoCliente.firstName}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, firstName: e.target.value })}
          />
          <input
            placeholder="Apellido"
            value={nuevoCliente.lastName}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, lastName: e.target.value })}
          />
         
          <input
            placeholder="Saldo Inicial"
            type="number"
            value={nuevoCliente.balance}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, balance: parseFloat(e.target.value) })}
          />
          <button type="submit">Crear</button>
        </form>
      )}

      {mensaje && <p className="message">{mensaje}</p>}

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Número de Cuenta</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) =>
            clienteEditando === cliente.id ? (
              <tr key={cliente.accountNumber}>
                <td>{cliente.id}</td>
                <td>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </td>
                <td>{cliente.accountNumber}</td>
                <td>
                  <input
                    type="number"
                    value={form.balance}
                    onChange={(e) =>
                      setForm({ ...form, balance: parseFloat(e.target.value) })
                    }
                  />
                </td>
                <td>
                  <button className="save" onClick={handleGuardar}>💾 Guardar</button>{" "}
                  <button className="cancel" onClick={handleCancelar}>❌ Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={cliente.accountNumber}>
                <td>{cliente.id}</td>
                <td>{cliente.firstName}</td>
                <td>{cliente.lastName}</td>
                <td>{cliente.accountNumber}</td>
                <td>${cliente.balance.toFixed(2)}</td>
                <td>
                  <button className="edit" onClick={() => handleEditar(cliente)}>✏️</button>{" "}
                  <button className="delete" onClick={() => handleEliminar(cliente.id)}>🗑️</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
