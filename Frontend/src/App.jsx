// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Landing from "./components/Landing";
// import Auth from "./components/Auth";
// import Dashboard from "./components/Dashboard";
// import History from "./components/History";
// import NotFound from "./components/NotFound";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/auth" element={<Auth />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/history" element={<History />} />
//         {/* Catch-all route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Auth from "./components/Auth";
// import Dashboard from "./components/Dashboard";
// import History from "./components/History";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Auth />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/history" element={<History />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import React from "react";
import P2PMini from "./components/P2PMini.jsx";

export default function App() {
  return <P2PMini />;
}
