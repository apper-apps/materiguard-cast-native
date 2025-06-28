import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/pages/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Remises from '@/components/pages/Remises';
import Stock from '@/components/pages/Stock';
import Emprunts from '@/components/pages/Emprunts';
import Historique from '@/components/pages/Historique';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="remises" element={<Remises />} />
          <Route path="stock" element={<Stock />} />
          <Route path="emprunts" element={<Emprunts />} />
          <Route path="historique" element={<Historique />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;