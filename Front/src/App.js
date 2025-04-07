
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Clientes from "./components/Clientes";
import Transferencia from "./components/Transferencia";
import Historial from "./components/Historial";



function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/clientes" style={{ marginRight: "10px" }}>Clientes</Link>
          <Link to="/transferencia" style={{ marginRight: "10px" }}>Transferencia</Link>
          <Link to="/historial" style={{ marginRight: "10px" }} >Historial</Link>
         
        </nav>

        <Routes>
          <Route path="/" element={<h2>Bienvenido al sistema bancario</h2>} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/transferencia" element={<Transferencia />} />
          <Route path="/historial" element={<Historial />} />
        
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
