import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes><Route path="/" element={<Landing />} />
        
        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="top-center" />
    </>
  );
};

export default App;

