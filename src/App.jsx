import React, { useState } from 'react';
import axios from 'axios';
import { Camera, BrainCircuit, Send, ArrowRight, ShieldCheck, AlertTriangle, UploadCloud, MapPin, CheckCircle2, Navigation, Info } from 'lucide-react';

function App() {
  // UBAH DENGAN LINK NGROK KAMU (Tanpa akhiran /predict)
  const NGROK_URL = "https://reporter-dance-safely.ngrok-free.dev";
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [alamat, setAlamat] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [koordinat, setKoordinat] = useState(null);
  const [loadingGPS, setLoadingGPS] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support GPS features.");
      return;
    }
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setKoordinat(mapsUrl);
        setAlamat(`Automatically detected via GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setLoadingGPS(false);
      },
      (error) => {
        alert("Failed to get location. Please ensure GPS (Location) permission is allowed in your browser.");
        setLoadingGPS(false);
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setHasil(null);
    }
  };

  const handlePrediksi = async () => {
    if (!image) return alert("Please select a road photo first!");
    if (!alamat) return alert("Please fill in the road address!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(`${NGROK_URL}/predict`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (response.data.success) {
        setHasil(response.data);
      } else {
        alert("Failed to detect: " + response.data.error);
      }
    } catch (error) {
      alert("Error contacting Colab server! Ensure the Ngrok link in App.jsx is correct and the Colab machine is still running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getKnowledge = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("mulus") || lowerLabel.includes("baik") || lowerLabel.includes("good") || lowerLabel.includes("smooth") || lowerLabel.includes("normal")) {
      return {
        title: "Good Road Condition",
        desc: "This road is in good condition and does not require immediate repair. Please continue to drive safely, always wear a helmet, and obey traffic rules."
      };
    } else if (lowerLabel.includes("lubang") || lowerLabel.includes("pothole")) {
      return {
        title: "Pothole Cause Analysis",
        desc: "Potholes are usually caused by water trapped under the asphalt, which expands and contracts, weakening the road structure. High traffic load then breaks the surface."
      };
    } else if (lowerLabel.includes("retak") || lowerLabel.includes("crack")) {
      return {
        title: "Cracked Road Analysis",
        desc: "Road cracks are often early signs of structural failure due to temperature changes, poor drainage, or excessive vehicle weight. If left untreated, they can develop into potholes."
      };
    } else {
      return {
        title: "General Maintenance Info",
        desc: "Any sign of road degradation should be monitored. Weather changes and heavy traffic are the main contributors to road surface wear."
      };
    }
  };

  const handleLaporWA = () => {
    const nomorDishub = "6281234567890"; // Change to destination number
    const mapInfo = koordinat ? `\n📍 *Map Link (GPS):* ${koordinat}` : "";
    
    // Priority logic
    let prioritas = "Low 🟢";
    if (hasil.confidence > 0.8) prioritas = "High 🔴";
    else if (hasil.confidence > 0.5) prioritas = "Medium 🟡";

    const pesan = `Hello Authority, I would like to report the following road condition:\n\n*Status:* ${hasil.label}\n*Handling Priority:* ${prioritas}\n*AI Confidence:* ${(hasil.confidence * 100).toFixed(2)}%\n\n*Location:* ${alamat}${mapInfo}\n\nPlease follow up immediately. Thank you.`;
    
    const waUrl = `https://wa.me/${nomorDishub}?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-amber-500 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-slate-900" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Road<span className="text-amber-500">AI</span></span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-slate-300 hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="text-slate-300 hover:text-amber-400 transition-colors">About</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-amber-400 transition-colors">How it Works</a>
              <a href="#ai-detection" className="text-slate-300 hover:text-amber-400 transition-colors">AI Detection</a>
              <a href="#team" className="text-slate-300 hover:text-amber-400 transition-colors">Our Team</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern Highway" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-6 text-sm font-semibold">
              <BrainCircuit className="w-4 h-4" />
              <span>Powered by MobileNetV2 CNN</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Report Road Damage <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Smarter with AI</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              A smart infrastructure reporting system that automatically analyzes the level of road damage and connects directly with relevant authorities for faster handling.
            </p>
            <a href="#ai-detection" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              Try Detection Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Solving the Problem of <span className="text-teal-400">Slow Reporting</span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Traditionally, road damage reports are often delayed due to lengthy bureaucratic processes and a lack of accurate visual validation. Citizens find it hard to report, and authorities respond slowly due to unstructured data.
              </p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-teal-400" /> Our Smart Solution
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  By utilizing <strong className="text-amber-400">Convolutional Neural Network (CNN)</strong> technology with the MobileNetV2 model, our system can classify road damage types instantly. These validated reports are ready to be sent formatted via WhatsApp to the relevant Transportation Authority.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full transform group-hover:scale-110 transition-transform duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1584852952809-566bc9044e31?auto=format&fit=crop&q=80&w=800" 
                alt="Road Maintenance" 
                className="relative rounded-3xl shadow-2xl border border-white/10 object-cover h-[500px] w-full group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How the System Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three smart steps to contribute to road infrastructure safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-amber-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">1. Upload Photo</h3>
                <p className="text-slate-400 leading-relaxed">Take or upload a photo of potholes, cracks, or other road damages directly from your device.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-teal-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">2. AI Analysis</h3>
                <p className="text-slate-400 leading-relaxed">Our advanced AI model will instantly analyze the photo to classify the type and severity of the damage.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">3. Report via WhatsApp</h3>
                <p className="text-slate-400 leading-relaxed">The system automatically creates a draft report containing the location and AI detection results to be sent directly to the relevant authority.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deteksi AI Section */}
      <section id="ai-detection" className="py-24 bg-slate-900 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Start AI Detection</h2>
            <p className="text-slate-400 text-lg">Upload a photo of a damaged road and prove the accuracy of our detection system.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
            {/* Glossy highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

            <div className="space-y-8 relative">
              {/* Input Lokasi */}
              <div>
                <label className="block text-slate-200 font-medium mb-3 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  Address / Location Point
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="e.g., Sudirman St. near the bus stop..."
                    className="flex-1 bg-slate-900/60 border border-slate-700/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 transition-all placeholder:text-slate-500 shadow-inner"
                    value={alamat}
                    onChange={(e) => { setAlamat(e.target.value); setKoordinat(null); }}
                  />
                  <button 
                    onClick={handleGetLocation}
                    disabled={loadingGPS}
                    className="sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Navigation className={`w-5 h-5 ${loadingGPS ? 'animate-pulse text-amber-500' : 'text-teal-400'}`} />
                    {loadingGPS ? 'Tracking...' : 'Use GPS'}
                  </button>
                </div>
                <p className="text-amber-500/90 text-sm mt-3 flex items-center gap-1.5 bg-amber-500/10 w-fit px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                  Privacy Tip: Please disable location access in your browser when not in use.
                </p>
              </div>

              {/* Drag and Drop Box */}
              <div>
                <label className="block text-slate-200 font-medium mb-3 flex items-center gap-2 text-lg">
                  <Camera className="w-5 h-5 text-teal-400" />
                  Road Photo
                </label>
                <div className="relative group">
                  <div className={`border-2 border-dashed ${preview ? 'border-teal-500/50 bg-teal-500/5' : 'border-slate-600 bg-slate-900/60 group-hover:border-amber-500/50 group-hover:bg-amber-500/5'} rounded-2xl p-8 text-center transition-all duration-300 shadow-inner`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {preview ? (
                      <div className="flex flex-col items-center">
                        <img src={preview} alt="Preview" className="max-h-72 rounded-xl shadow-lg border border-white/10 mb-4 object-contain" />
                        <span className="text-teal-400 text-sm font-medium flex items-center gap-1 bg-teal-500/10 px-4 py-2 rounded-full">
                          <CheckCircle2 className="w-4 h-4" /> Photo selected. Click/drop to replace.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-white font-medium text-lg mb-2">Click or Drag & Drop photo here</p>
                        <p className="text-slate-500 text-sm">Supports JPG, PNG formats (Max. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handlePrediksi}
                disabled={loading || !image || !alamat}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading || !image || !alamat 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] border border-amber-400'
                }`}
              >
                {loading ? (
                  <>
                    <BrainCircuit className="w-6 h-6 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-6 h-6" />
                    Detect Road Damage
                  </>
                )}
              </button>

              {/* Result Area */}
              {hasil && (
                <div className="mt-8 p-6 bg-slate-800/80 backdrop-blur-md border border-white/20 rounded-2xl relative overflow-hidden transition-all duration-500 ease-in-out transform scale-100">
                  {/* Decorative glowing orb */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full pointer-events-none"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    AI Analysis Result
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Road Status</p>
                      <p className="text-2xl font-bold text-amber-400">{hasil.label}</p>
                    </div>
                    
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Priority</p>
                      {hasil.confidence > 0.8 ? (
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30">
                          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                          <span className="font-bold text-lg">High</span>
                        </div>
                      ) : hasil.confidence > 0.5 ? (
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                          <span className="font-bold text-lg">Medium</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30">
                          <span className="h-3 w-3 rounded-full bg-green-500"></span>
                          <span className="font-bold text-lg">Low</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">AI Accuracy</p>
                      <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-white">{(hasil.confidence * 100).toFixed(1)}%</p>
                        <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden hidden lg:block">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-teal-400 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${hasil.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner mb-6">
                    <h4 className="text-teal-400 font-bold flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5" />
                      {getKnowledge(hasil.label).title}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {getKnowledge(hasil.label).desc}
                    </p>
                  </div>

                  <button 
                    onClick={handleLaporWA}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] z-10 relative border border-teal-400/50"
                  >
                    <Send className="w-5 h-5" />
                    Report to Authority via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tim Pengembang Section */}
      <section id="team" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Development Team</h2>
            <p className="text-slate-400 text-lg">Student innovation collaboration for better infrastructure.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            {/* Profile 1 */}
            <div className="flex-1 group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-teal-500 rounded-full blur opacity-40 group-hover:opacity-70 group-hover:scale-125 transition duration-500"></div>
                <img 
                  src="https://ui-avatars.com/api/?name=AI+Dev&background=0d9488&color=fff&size=128&bold=true" 
                  alt="AI Developer" 
                  className="relative w-32 h-32 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Developer 1</h3>
              <p className="text-teal-400 font-medium mb-4 tracking-wide">AI & Backend Developer</p>
              <p className="text-slate-400 text-sm leading-relaxed">Designing the MobileNetV2 CNN architecture and Backend API integration.</p>
            </div>

            {/* Profile 2 */}
            <div className="flex-1 group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur opacity-40 group-hover:opacity-70 group-hover:scale-125 transition duration-500"></div>
                <img 
                  src="https://ui-avatars.com/api/?name=UI+UX&background=f59e0b&color=fff&size=128&bold=true" 
                  alt="Frontend Developer" 
                  className="relative w-32 h-32 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Developer 2</h3>
              <p className="text-amber-400 font-medium mb-4 tracking-wide">Frontend & UI/UX Designer</p>
              <p className="text-slate-400 text-sm leading-relaxed">Building SPA interactivity with a Glassmorphism approach.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-900/80 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-colors">
              <p className="text-slate-300 font-medium text-lg">Information Systems Study Program Students</p>
              <p className="text-teal-400 font-bold text-xl mt-1 tracking-wide">Politeknik Caltex Riau</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group">
            <div className="bg-amber-500 p-1.5 rounded-md group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-xl text-white">Road<span className="text-amber-500">AI</span></span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Road Damage Reporting System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

export default App;