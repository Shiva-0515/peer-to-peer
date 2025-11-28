// import { useState } from "react";
// import { Zap, Lock, Share2, Gauge } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// const Auth = () => {
//   const navigate = useNavigate();
//   const [tab, setTab] = useState("login");

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [registerUsername, setRegisterUsername] = useState("");
//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!loginEmail || !loginPassword) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       // TODO: Replace with backend API call
//       // const res = await fetch("/api/login", { ... });
//       const res = await axios.post("/api/login", {
//         email: loginEmail,
//         password: loginPassword,
//       }); 
//       // const data = await res.json();
//       const data = res.data;
//       alert("Logged in successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Login failed");
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!registerUsername || !registerEmail || !registerPassword) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       // TODO: Replace with backend API call
//       // const res = await fetch("/api/register", { ... });
//       // const data = await res.json();
//       alert("Account created successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed");
//     }
//   };

//   const features = [
//     {
//       icon: Lock,
//       title: "End-to-End Encrypted",
//       description: "Your files never touch our servers",
//       color: "text-blue-600",
//     },
//     {
//       icon: Zap,
//       title: "Lightning Fast",
//       description: "Direct peer connections for speed",
//       color: "text-green-600",
//     },
//     {
//       icon: Share2,
//       title: "No Size Limits",
//       description: "Share files of any size",
//       color: "text-purple-600",
//     },
//     {
//       icon: Gauge,
//       title: "Real-time Transfers",
//       description: "See progress in real-time",
//       color: "text-yellow-600",
//     },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row">
//       {/* Left side - Hero */}
//       <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
//         <div className="max-w-xl">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
//             <Zap className="h-4 w-4" />
//             Secure P2P File Sharing
//           </div>

//           <h1 className="text-5xl font-bold mb-6">
//             Share Files <br />
//             <span className="text-blue-600">Directly & Securely</span>
//           </h1>

//           <p className="text-lg text-gray-600 mb-12">
//             Transfer files peer-to-peer using WebRTC technology. No server
//             storage, no limits, completely secure.
//           </p>

//           <div className="grid grid-cols-2 gap-6">
//             {features.map((feature) => (
//               <div key={feature.title} className="flex gap-3">
//                 <div className={`flex-shrink-0 ${feature.color}`}>
//                   <feature.icon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-sm mb-1">
//                     {feature.title}
//                   </h3>
//                   <p className="text-xs text-gray-500">{feature.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right side - Auth Forms */}
//       <div className="flex-1 flex items-center justify-center p-8 bg-white">
//         <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-6">
//           <h2 className="text-2xl font-bold mb-2">Get Started</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Create an account or sign in to start sharing files
//           </p>

//           {/* Tabs */}
//           <div className="grid grid-cols-2 border-b mb-6">
//             <button
//               onClick={() => setTab("login")}
//               className={`py-2 font-medium text-sm ${
//                 tab === "login"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setTab("register")}
//               className={`py-2 font-medium text-sm ${
//                 tab === "register"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               Register
//             </button>
//           </div>

//           {/* Login Form */}
//           {tab === "login" && (
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="login-email"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Email
//                 </label>
//                 <input
//                   id="login-email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={loginEmail}
//                   onChange={(e) => setLoginEmail(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="login-password"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="login-password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="text-blue-600 text-sm hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Sign In
//               </button>
//             </form>
//           )}

//           {/* Register Form */}
//           {tab === "register" && (
//             <form onSubmit={handleRegister} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="register-username"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Username
//                 </label>
//                 <input
//                   id="register-username"
//                   type="text"
//                   placeholder="johndoe"
//                   value={registerUsername}
//                   onChange={(e) => setRegisterUsername(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="register-email"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Email
//                 </label>
//                 <input
//                   id="register-email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={registerEmail}
//                   onChange={(e) => setRegisterEmail(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="register-password"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="register-password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={registerPassword}
//                   onChange={(e) => setRegisterPassword(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Create Account
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

import { useState } from "react";
import { Zap, Lock, Share2, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

const Auth = () => {
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // ✅ Your backend base URL

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      toast.success("Logged in successfully!" , {
            style: {
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
      });
      localStorage.setItem("token", res.data.token); // optional
      localStorage.setItem("UserName", res.data.user.username); // optional
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed" ,{
        style: {
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerUsername || !registerEmail || !registerPassword) {
      toast.dismiss();
       toast.error("Please fill in all fields" , {
            style: {
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
      });
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      });
      console.log(res.data);
        toast.success(
          <div>
            Account created successfully!
            <div style={{ textAlign:"center" }}>Please log in.</div>
          </div> , 
          {
            style: {
            width: 'auto',
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
          duration: 2500,
      });
      // localStorage.setItem("token", res.data.token); // optional
      // localStorage.setItem("UserName", res.data.user.username); // optional
      navigate("/");
    } catch (err) {
      console.error(err);
      // alert(err.response?.data?.message || "Registration failed");
      toast(err.response?.data?.message || "Registration failed" , {
            style: {
            width: 'auto',
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
          duration: 2500,
      });
    }
  };

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      description: "Your files never touch our servers",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Direct peer connections for speed",
      color: "text-green-600",
    },
    {
      icon: Share2,
      title: "No Size Limits",
      description: "Share files of any size",
      color: "text-purple-600",
    },
    {
      icon: Gauge,
      title: "Real-time Transfers",
      description: "See progress in real-time",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Secure P2P File Sharing
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Share Files <br />
            <span className="text-blue-600">Directly & Securely</span>
          </h1>

          <p className="text-lg text-gray-600 mb-12">
            Transfer files peer-to-peer using WebRTC technology. No server
            storage, no limits, completely secure.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <div className={`flex-shrink-0 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-2">Get Started</h2>
          <p className="text-sm text-gray-500 mb-6">
            Create an account or sign in to start sharing files
          </p>

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b mb-6">
            <button
              onClick={() => setTab("login")}
              className={`py-2 font-medium text-sm ${
                tab === "login"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`py-2 font-medium text-sm ${
                tab === "register"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="register-username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  id="register-username"
                  type="text"
                  placeholder="johndoe"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
