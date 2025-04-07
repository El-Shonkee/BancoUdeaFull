import { useEffect, useState } from "react";
import '../App.css';

const Historial = () => {
  const [cuentasUnicas, setCuentasUnicas] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then(res => res.json())
      .then(data => {
        setTransacciones(data);

        // Extraer cuentas únicas (origen y destino)
        const cuentasSet = new Set();
        data.forEach(t => {
          cuentasSet.add(t.senderAccountNumber);
          cuentasSet.add(t.receiverAccountNumber);
        });
        setCuentasUnicas(Array.from(cuentasSet));
      })
      .catch(err => console.error("Error cargando transacciones:", err));
  }, []);

  const transaccionesFiltradas = cuentaSeleccionada === "ALL"
    ? transacciones
    : transacciones.filter(t =>
        t.senderAccountNumber === cuentaSeleccionada ||
        t.receiverAccountNumber === cuentaSeleccionada
      );

      return (
        <div className="container">
          <h2>Historial de Transacciones</h2>
      
          <label>Selecciona una cuenta:</label>
          <select
            value={cuentaSeleccionada}
            onChange={(e) => setCuentaSeleccionada(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            <option value="ALL">Todas las cuentas</option>
            {cuentasUnicas.map((cuenta) => (
              <option key={cuenta} value={cuenta}>{cuenta}</option>
            ))}
          </select>
      
          {cuentaSeleccionada && transaccionesFiltradas.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Id transacción</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.map((t, i) => (
                  <tr key={i}>
                    <td>{t.id}</td>
                    <td>{t.senderAccountNumber}</td>
                    <td>{t.receiverAccountNumber}</td>
                    <td>${t.amount.toFixed(2)}</td>
                    <td>{new Date(t.timestamp + "Z").toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      
          {cuentaSeleccionada && transaccionesFiltradas.length === 0 && (
            <p className="message">No hay transacciones para esta cuenta.</p>
          )}
        </div>
      );
};

export default Historial;
