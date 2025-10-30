import { Zap, Lock, Share2, Gauge, Send, ArrowRight, Users, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      description: "Your files never touch our servers. Everything is encrypted and sent directly between peers.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Direct peer connections mean maximum speed. No upload/download bottlenecks.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Share2,
      title: "No Size Limits",
      description: "Share files of any size without restrictions. From documents to large video files.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Gauge,
      title: "Real-time Transfers",
      description: "Watch your files transfer in real-time with live progress updates.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Users,
      title: "Room-based Sharing",
      description: "Create or join rooms to share files with multiple people simultaneously.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No data collection, no tracking. Your files and privacy are completely protected.",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Send className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">P2P File Share</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-100 via-white to-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Secure Peer-to-Peer File Sharing
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Share Files <br />
            <span className="text-blue-600">Directly & Securely</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transfer files instantly using WebRTC technology. No server storage, unlimited file sizes, 
            completely private and encrypted end-to-end.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-600 text-white text-lg h-12 px-8 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              Start Sharing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="border border-gray-300 text-lg h-12 px-8 rounded-md hover:bg-gray-100 transition"
            >
              Learn More
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">0 MB</div>
              <div className="text-sm text-gray-600">Size Limit</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-1">P2P</div>
              <div className="text-sm text-gray-600">Direct Transfer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for secure, fast, and private file sharing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">About P2P File Share</h2>
            <p className="text-xl text-gray-600">Built with privacy and security at its core</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="border border-blue-200 rounded-lg p-6">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Server Storage</h3>
                <p className="text-gray-600">
                  Your files are never stored on our servers. They transfer directly from one peer to another using WebRTC technology.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-6">
                <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2">
                  <Rocket className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Open Source</h3>
                <p className="text-gray-600">
                  Our code is transparent and open for review. We believe in building trust through transparency and community collaboration.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">How It Works</h3>
              {[
                { step: 1, title: "Create or Join a Room", desc: "Start by creating a unique room or join an existing one" },
                { step: 2, title: "Select Your File", desc: "Choose any file from your device - no size restrictions" },
                { step: 3, title: "Share Instantly", desc: "Files transfer directly between peers with real-time progress" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-blue-600 text-white rounded-md py-3 text-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ready to Share Files Securely?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of users who trust P2P File Share for their file transfer needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/auth")}
            className="bg-white text-blue-600 text-lg h-12 px-8 rounded-md hover:bg-gray-100 transition"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-white text-lg h-12 px-8 rounded-md hover:bg-white hover:text-blue-600 transition"
          >
            View Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">P2P File Share</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Secure, fast, and private peer-to-peer file sharing for everyone.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-blue-600">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/dashboard")} className="hover:text-blue-600">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/history")} className="hover:text-blue-600">
                    History
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-blue-600">
                    About
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
            <p>&copy; 2025 P2P File Share. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
