import '../App.css';
import { useEffect, useState } from "react";

const Transferencia = () => {
  const [clientes, setClientes] = useState([]);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error("Error cargando clientes:", err));
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!sender || !receiver || !amount) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    if (sender === receiver) {
      setMensaje("La cuenta de origen y destino no pueden ser la misma.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAccountNumber: sender,
          receiverAccountNumber: receiver,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMensaje(`Error: ${errorText}`);
      } else {
        setMensaje("¡Transferencia realizada con éxito!");
        setSender("");
        setReceiver("");
        setAmount("");
      }
    } catch (error) {
      setMensaje("Ocurrió un error al realizar la transferencia.");
      console.error("Transferencia error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Realizar Transferencia</h2>
  
      <form onSubmit={handleTransfer}>
        <div>
          <label>Cuenta Origen:</label>
          <select value={sender} onChange={(e) => setSender(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {clientes.map((c) => (
              <option key={c.accountNumber} value={c.accountNumber}>
                {c.firstName} {c.lastName} ({c.accountNumber})
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label>Cuenta Destino:</label>
          <select value={receiver} onChange={(e) => setReceiver(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {clientes.map((c) => (
              <option key={c.accountNumber} value={c.accountNumber}>
                {c.firstName} {c.lastName} ({c.accountNumber})
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label>Monto:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
  
        <button type="submit">Transferir</button>
      </form>
  
      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
};

export default Transferencia;
