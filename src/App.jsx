import React, { useState } from 'react';
import axios from 'axios';
import { Camera, BrainCircuit, Send, ArrowRight, ShieldCheck, AlertTriangle, UploadCloud, MapPin, CheckCircle2, Navigation } from 'lucide-react';

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
      alert("Browser kamu tidak mendukung fitur GPS.");
      return;
    }
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setKoordinat(mapsUrl);
        setAlamat(`Terdeteksi otomatis via GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setLoadingGPS(false);
      },
      (error) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin GPS (Location) diizinkan di browsermu.");
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
    if (!image) return alert("Pilih foto jalan dulu ya!");
    if (!alamat) return alert("Alamat jalannya diisi dulu dong!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(`${NGROK_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setHasil(response.data);
      } else {
        alert("Gagal mendeteksi: " + response.data.error);
      }
    } catch (error) {
      alert("Error menghubungi server Colab! Pastikan link Ngrok di App.jsx sudah benar dan mesin Colab masih jalan.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaporWA = () => {
    const nomorDishub = "6281234567890"; // Ganti dengan nomor tujuan
    const mapInfo = koordinat ? `\n📍 *Link Peta (GPS):* ${koordinat}` : "";
    
    // Logika prioritas
    let prioritas = "Rendah 🟢";
    if (hasil.confidence > 0.8) prioritas = "Tinggi 🔴";
    else if (hasil.confidence > 0.5) prioritas = "Sedang 🟡";

    const pesan = `Halo Dishub, saya ingin melaporkan kondisi jalan berikut:\n\n*Status:* ${hasil.label}\n*Prioritas Penanganan:* ${prioritas}\n*Keyakinan AI:* ${(hasil.confidence * 100).toFixed(2)}%\n\n*Lokasi:* ${alamat}${mapInfo}\n\nMohon untuk segera ditindaklanjuti. Terima kasih.`;
    
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
              <a href="#beranda" className="text-slate-300 hover:text-amber-400 transition-colors">Beranda</a>
              <a href="#tentang" className="text-slate-300 hover:text-amber-400 transition-colors">Tentang</a>
              <a href="#cara-kerja" className="text-slate-300 hover:text-amber-400 transition-colors">Cara Kerja</a>
              <a href="#deteksi" className="text-slate-300 hover:text-amber-400 transition-colors">Deteksi AI</a>
              <a href="#tim" className="text-slate-300 hover:text-amber-400 transition-colors">Tim Kami</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative min-h-screen flex items-center pt-16">
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
              <span>Didukung oleh MobileNetV2 CNN</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Lapor Jalan Rusak Kini Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Cerdas dengan AI</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Sistem pelaporan infrastruktur pintar yang menganalisis tingkat kerusakan jalan secara otomatis dan langsung terhubung dengan instansi terkait untuk penanganan lebih cepat.
            </p>
            <a href="#deteksi" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              Coba Deteksi Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section id="tentang" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Mengatasi Masalah Pelaporan yang <span className="text-teal-400">Lambat</span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                Selama ini, laporan kerusakan jalan sering kali terhambat karena proses birokrasi yang panjang dan kurangnya validasi visual yang akurat. Masyarakat kesulitan melaporkan, dan pihak berwenang lambat merespons karena data yang tidak terstruktur.
              </p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-teal-400" /> Solusi Cerdas Kami
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Dengan memanfaatkan teknologi <strong className="text-amber-400">Convolutional Neural Network (CNN)</strong> model MobileNetV2, sistem kami dapat mengklasifikasikan jenis kerusakan jalan secara instan. Laporan tervalidasi ini siap dikirimkan formatnya via WhatsApp ke Dinas Perhubungan terkait.
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

      {/* Cara Kerja Section */}
      <section id="cara-kerja" className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Cara Kerja Sistem</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Tiga langkah cerdas untuk berkontribusi pada keamanan infrastruktur jalan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-amber-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">1. Unggah Foto</h3>
                <p className="text-slate-400 leading-relaxed">Ambil atau unggah foto jalan yang berlubang, retak, atau mengalami kerusakan lainnya langsung dari gawai Anda.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-teal-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">2. Analisis AI</h3>
                <p className="text-slate-400 leading-relaxed">Model AI canggih kami akan menganalisis foto secara instan untuk mengklasifikasikan jenis dan tingkat kerusakan.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              <div className="relative">
                <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">3. Lapor via WhatsApp</h3>
                <p className="text-slate-400 leading-relaxed">Sistem membuat draf laporan otomatis berisi lokasi dan deteksi AI untuk dikirimkan langsung ke instansi terkait.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deteksi AI Section */}
      <section id="deteksi" className="py-24 bg-slate-900 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Mulai Deteksi AI</h2>
            <p className="text-slate-400 text-lg">Unggah foto jalan rusak dan buktikan keakuratan sistem pendeteksi kami.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
            {/* Glossy highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

            <div className="space-y-8 relative">
              {/* Input Lokasi */}
              <div>
                <label className="block text-slate-200 font-medium mb-3 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  Alamat / Titik Lokasi
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Contoh: Jl. Sudirman depan halte..."
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
                    {loadingGPS ? 'Melacak...' : 'Pakai GPS'}
                  </button>
                </div>
              </div>

              {/* Drag and Drop Box */}
              <div>
                <label className="block text-slate-200 font-medium mb-3 flex items-center gap-2 text-lg">
                  <Camera className="w-5 h-5 text-teal-400" />
                  Foto Jalan
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
                          <CheckCircle2 className="w-4 h-4" /> Foto terpilih. Klik/drop untuk mengganti.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-white font-medium text-lg mb-2">Klik atau Drag & Drop foto ke sini</p>
                        <p className="text-slate-500 text-sm">Mendukung format JPG, PNG (Maks. 5MB)</p>
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
                    Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-6 h-6" />
                    Deteksi Kerusakan Jalan
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
                    Hasil Analisis AI
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Status Jalan</p>
                      <p className="text-2xl font-bold text-amber-400">{hasil.label}</p>
                    </div>
                    
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Prioritas</p>
                      {hasil.confidence > 0.8 ? (
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30">
                          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                          <span className="font-bold text-lg">Tinggi</span>
                        </div>
                      ) : hasil.confidence > 0.5 ? (
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                          <span className="font-bold text-lg">Sedang</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30">
                          <span className="h-3 w-3 rounded-full bg-green-500"></span>
                          <span className="font-bold text-lg">Rendah</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Akurasi AI</p>
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

                  <button 
                    onClick={handleLaporWA}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] z-10 relative border border-teal-400/50"
                  >
                    <Send className="w-5 h-5" />
                    Laporkan ke Dishub via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tim Pengembang Section */}
      <section id="tim" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Tim Pengembang</h2>
            <p className="text-slate-400 text-lg">Kolaborasi inovasi mahasiswa untuk infrastruktur yang lebih baik.</p>
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
              <p className="text-slate-400 text-sm leading-relaxed">Merancang arsitektur CNN MobileNetV2 dan integrasi API Backend.</p>
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
              <p className="text-slate-400 text-sm leading-relaxed">Membangun interaktivitas SPA dengan pendekatan Glassmorphism.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-900/80 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-colors">
              <p className="text-slate-300 font-medium text-lg">Mahasiswa Program Studi Sistem Informasi</p>
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
            &copy; {new Date().getFullYear()} Sistem Pelapor Kerusakan Jalan. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privasi</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Ketentuan</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

export default App;