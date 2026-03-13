import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  UserSquare2, 
  History, 
  UploadCloud,
  Check,
  Image as ImageIcon
} from 'lucide-react';

// --- Types ---
type Tab = 'enhance' | 'id-photo' | 'restore';

// --- Helper Components ---

const Panel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: React.ElementType }) => (
  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
    {Icon && <Icon className="w-4 h-4 text-purple-500" />}
    {children}
  </h3>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-slate-500 mb-1.5">{children}</label>
);

const RadioButton = ({ 
  active, 
  onClick, 
  children, 
  badge 
}: { 
  active: boolean, 
  onClick: () => void, 
  children: React.ReactNode,
  badge?: string
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
      active 
        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium shadow-sm shadow-purple-100' 
        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
    }`}
  >
    {children}
    {badge && (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        {badge}
      </span>
    )}
  </button>
);

const SegmentedControl = ({ 
  options, 
  active, 
  onChange 
}: { 
  options: string[], 
  active: string, 
  onChange: (val: string) => void 
}) => (
  <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
          active === opt 
            ? 'bg-white text-slate-800 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const Slider = ({ 
  label, 
  value, 
  onChange, 
  max = 100 
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  max?: number
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <Label>{label}</Label>
      <span className="text-xs text-slate-400 font-mono">{value}</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
    />
  </div>
);

const Checkbox = ({ 
  label, 
  sublabel, 
  checked, 
  onChange 
}: { 
  label: string, 
  sublabel?: string, 
  checked: boolean, 
  onChange: (val: boolean) => void 
}) => (
  <label className="flex items-start gap-3 cursor-pointer group mb-3">
    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
      checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-400'
    }`}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {sublabel && <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{sublabel}</div>}
    </div>
  </label>
);

// --- Main App Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('enhance');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhance State
  const [quality, setQuality] = useState('4K (Sharp)');
  const [procMode, setProcMode] = useState('Enhance & Restore');
  const [faceRetouch, setFaceRetouch] = useState(50);
  const [sharpening, setSharpening] = useState(30);
  const [upscaleStr, setUpscaleStr] = useState(25);
  const [hyperReal, setHyperReal] = useState(true);
  const [colorCorr, setColorCorr] = useState(true);

  // ID Photo State
  const [idSize, setIdSize] = useState('3x4 cm');
  const [idBg, setIdBg] = useState('white');
  const [idOutfit, setIdOutfit] = useState('Giữ Nguyên');
  const [skinSmooth, setSkinSmooth] = useState(60);
  const [removeAcne, setRemoveAcne] = useState(true);
  const [balanceLight, setBalanceLight] = useState(true);
  const [printLayout, setPrintLayout] = useState('None');

  // Restore State
  const [restoreModel, setRestoreModel] = useState('Gemini 3 Pro');
  const [restoreUpscale, setRestoreUpscale] = useState('Off (1x)');
  const [scratchRem, setScratchRem] = useState(80);
  const [denoise, setDenoise] = useState(50);
  const [colorize, setColorize] = useState(true);
  const [faceRestore, setFaceRestore] = useState(true);
  const [deblur, setDeblur] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const renderSidebar = () => {
    switch (activeTab) {
      case 'enhance':
        return (
          <Panel className="p-5 flex flex-col gap-5">
            <SectionTitle icon={Wand2}>Enhancement Controls</SectionTitle>
            
            <div>
              <Label>Output Quality</Label>
              <div className="flex flex-col gap-2">
                <RadioButton active={quality === '2K (Fast)'} onClick={() => setQuality('2K (Fast)')}>2K (Fast)</RadioButton>
                <RadioButton active={quality === '4K (Sharp)'} onClick={() => setQuality('4K (Sharp)')}>4K (Sharp)</RadioButton>
                <RadioButton active={quality === '8K ULTRA HDR'} onClick={() => setQuality('8K ULTRA HDR')} badge="GEMINI 3 PRO">8K ULTRA HDR</RadioButton>
              </div>
            </div>

            <div>
              <Label>Processing Mode</Label>
              <SegmentedControl options={['Upscale Only', 'Enhance & Restore']} active={procMode} onChange={setProcMode} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Slider label="Face Retouch" value={faceRetouch} onChange={setFaceRetouch} />
              <Slider label="Sharpening" value={sharpening} onChange={setSharpening} />
              <Slider label="AI Upscale Strength" value={upscaleStr} onChange={setUpscaleStr} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Label>Advanced Options</Label>
              <div className="mt-2">
                <Checkbox label="Hyper-Realism Texture" checked={hyperReal} onChange={setHyperReal} />
                <Checkbox label="Color Correction" checked={colorCorr} onChange={setColorCorr} />
              </div>
            </div>
          </Panel>
        );
      case 'id-photo':
        return (
          <Panel className="p-5 flex flex-col gap-5">
            <SectionTitle icon={UserSquare2}>Cấu Hình Ảnh Thẻ</SectionTitle>
            
            <div>
              <Label>Kích Thước</Label>
              <div className="grid grid-cols-2 gap-2">
                {['2x3 cm', '3x4 cm', '4x6 cm', '3.5x4.5 cm (Passport)', '5x5 cm (Visa)'].map(size => (
                  <button
                    key={size}
                    onClick={() => setIdSize(size)}
                    className={`py-2 px-2 text-xs rounded-xl border transition-all ${
                      idSize === size 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    } ${size === '5x5 cm (Visa)' ? 'col-span-2' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Màu Nền</Label>
              <div className="flex gap-3 mt-2">
                {[
                  { id: 'white', color: 'bg-white border-slate-200' },
                  { id: 'blue', color: 'bg-blue-500 border-blue-600' },
                  { id: 'red', color: 'bg-red-500 border-red-600' },
                  { id: 'black', color: 'bg-slate-900 border-slate-950' },
                  { id: 'gray', color: 'bg-slate-400 border-slate-500' },
                ].map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setIdBg(bg.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${bg.color} ${
                      idBg === bg.id ? 'ring-2 ring-purple-500 ring-offset-2' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Thay Trang Phục</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {[
                  'Giữ Nguyên', 'Vest Nam + Áo sơ mi + Cà vạt', 'Vest Nam (Đen)', 
                  'Áo sơ mi Nam + Cà vạt', 'Áo sơ mi Nam', 'Polo Đen'
                ].map(outfit => (
                  <button
                    key={outfit}
                    onClick={() => setIdOutfit(outfit)}
                    className={`py-2 px-2 text-[11px] leading-tight rounded-xl border text-left transition-all ${
                      idOutfit === outfit 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {outfit}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Label>Làm Đẹp Da & Xử Lý</Label>
              <div className="mt-3">
                <Slider label="Mịn Da (Skin Smooth)" value={skinSmooth} onChange={setSkinSmooth} />
                <Checkbox label="Nhặt Mụn / Xóa Vết Xước" sublabel="Acne & Blemish Removal" checked={removeAcne} onChange={setRemoveAcne} />
                <Checkbox label="Cân Bằng Ánh Sáng" checked={balanceLight} onChange={setBalanceLight} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Label>Ghép Khổ Giấy In</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['None', '8x13 cm', '10x15 cm'].map(layout => (
                  <button
                    key={layout}
                    onClick={() => setPrintLayout(layout)}
                    className={`py-2 px-2 text-xs rounded-xl border transition-all ${
                      printLayout === layout 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        );
      case 'restore':
        return (
          <Panel className="p-5 flex flex-col gap-5">
            <SectionTitle icon={History}>Khôi Phục Ảnh Cũ</SectionTitle>
            
            <div>
              <Label>Chọn Mô Hình AI</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRestoreModel('Gemini 2.5')}
                  className={`py-2 px-3 rounded-xl border text-left transition-all ${
                    restoreModel === 'Gemini 2.5' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`text-sm font-medium ${restoreModel === 'Gemini 2.5' ? 'text-purple-700' : 'text-slate-700'}`}>Gemini 2.5</div>
                  <div className="text-[10px] text-slate-400">Fast Speed</div>
                </button>
                <button
                  onClick={() => setRestoreModel('Gemini 3 Pro')}
                  className={`py-2 px-3 rounded-xl border text-left transition-all ${
                    restoreModel === 'Gemini 3 Pro' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`text-sm font-medium ${restoreModel === 'Gemini 3 Pro' ? 'text-purple-700' : 'text-slate-700'}`}>Gemini 3 Pro</div>
                  <div className="text-[10px] text-purple-400 font-medium">Best Quality</div>
                </button>
              </div>
            </div>

            <div>
              <Label>Tùy Chọn Upscale</Label>
              <SegmentedControl options={['Off (1x)', '2x Scale', '4x Scale']} active={restoreUpscale} onChange={setRestoreUpscale} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Label>Xử lý vết xước & Nhiễu</Label>
              <div className="mt-3">
                <Slider label="Xóa Vết Xước (Scratch Removal)" value={scratchRem} onChange={setScratchRem} />
                <Slider label="Khử Nhiễu (Denoise)" value={denoise} onChange={setDenoise} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Label>Tùy Chọn Phục Chế</Label>
              <div className="mt-2">
                <Checkbox label="Tái Tạo Màu Sắc (Colorize)" sublabel="Tô màu ảnh đen trắng hoặc phục hồi màu phai" checked={colorize} onChange={setColorize} />
                <Checkbox label="Khôi Phục Khuôn Mặt (Face Restore)" sublabel="Giữ nguyên nét gốc, không làm biến dạng" checked={faceRestore} onChange={setFaceRestore} />
                <Checkbox label="Làm Nét & Khử Mờ (Deblur)" checked={deblur} onChange={setDeblur} />
              </div>
            </div>
          </Panel>
        );
    }
  };

  const renderFooterInfo = () => {
    const infos = {
      'enhance': [
        { title: 'Smart Upscaling', desc: 'Up to 800% zoom without quality loss' },
        { title: 'Face Recovery', desc: 'Restores blurry faces with AI precision' },
        { title: 'Auto Color', desc: 'Balances lighting and corrects tone' }
      ],
      'id-photo': [
        { title: 'Auto Background', desc: 'Removes clutter, adds solid color' },
        { title: 'Smart Outfit', desc: 'Changes clothes to suits or shirts' },
        { title: 'Standard Sizes', desc: 'Ready for ID cards & Passports' }
      ],
      'restore': [
        { title: 'Gemini 3 Pro', desc: 'Using latest Vision model' },
        { title: 'Smart Colorize', desc: 'Brings B&W photos to life' },
        { title: 'Authentic Restore', desc: 'Keeps original facial features' }
      ]
    };

    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {infos[activeTab].map((info, idx) => (
          <Panel key={idx} className="p-3 bg-white/60 backdrop-blur-sm border-blue-50">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <h4 className="text-xs font-bold text-slate-700">{info.title}</h4>
            </div>
            <p className="text-[10px] text-slate-500 pl-3">{info.desc}</p>
          </Panel>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-purple-200">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-slate-800 mb-6">
            Thái Satoh <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">AI Enhancer</span>
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === 'thai1991') {
              setIsAuthenticated(true);
            } else {
              setLoginError('Mật khẩu không đúng');
            }
          }}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="false"
              />
              {loginError && <p className="text-red-500 text-xs mt-2 ml-1">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all text-sm"
            >
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-200">
      {/* Header */}
      <header className="pt-10 pb-6 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h1 className="text-xl font-bold">
            Thái Satoh Digital Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">AI Enhancer</span>
          </h1>
        </div>
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          V2.0 Pro <span className="text-slate-300">•</span> 
          <span className="flex items-center gap-1 text-purple-600">
            <Sparkles className="w-3 h-3" /> Gemini 3 Pro Active
          </span>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
          {[
            { id: 'enhance', label: 'Nâng Cấp Ảnh', icon: Wand2 },
            { id: 'id-photo', label: 'Tạo Ảnh Thẻ', icon: UserSquare2 },
            { id: 'restore', label: 'Khôi Phục Ảnh', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        
        {/* Left Sidebar */}
        <aside className="w-full">
          {renderSidebar()}
        </aside>

        {/* Right Workspace */}
        <section className="flex flex-col">
          <Panel className="flex-1 flex flex-col overflow-hidden">
            {/* Workspace Header */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace</h2>
            </div>
            
            {/* Dropzone / Preview */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[400px] bg-slate-50/30">
              {uploadedImage ? (
                activeTab === 'id-photo' && printLayout !== 'None' ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center group overflow-auto">
                    <div className="bg-white p-6 shadow-md border border-slate-200 flex flex-col items-center">
                      <div className="text-xs text-slate-400 mb-4 font-mono">{printLayout} Sheet Preview</div>
                      <div className={`grid gap-2 ${printLayout === '8x13 cm' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                        {Array.from({ length: printLayout === '8x13 cm' ? 4 : 8 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-24 h-32 border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: idBg === 'white' ? '#fff' : idBg === 'blue' ? '#3b82f6' : idBg === 'red' ? '#ef4444' : idBg === 'black' ? '#0f172a' : '#94a3b8' }}
                          >
                            <img 
                              src={uploadedImage} 
                              alt={`Copy ${i}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center group">
                    <div 
                      className="rounded-lg overflow-hidden shadow-sm flex items-center justify-center"
                      style={activeTab === 'id-photo' ? { backgroundColor: idBg === 'white' ? '#fff' : idBg === 'blue' ? '#3b82f6' : idBg === 'red' ? '#ef4444' : idBg === 'black' ? '#0f172a' : '#94a3b8' } : {}}
                    >
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded preview" 
                        className="max-w-full max-h-[500px] object-contain"
                      />
                    </div>
                    <button 
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      Change Image
                    </button>
                  </div>
                )
              ) : (
                <div 
                  className="w-full max-w-xl aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-purple-500">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Drop your photo here</h3>
                  <p className="text-sm text-slate-500 mb-4">or click to browse your files</p>
                  <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button 
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
                  uploadedImage 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5' 
                    : 'bg-slate-300 cursor-not-allowed shadow-none'
                }`}
                disabled={!uploadedImage}
              >
                {activeTab === 'enhance' && <><Wand2 className="w-5 h-5" /> Enhance Photo</>}
                {activeTab === 'id-photo' && <><UserSquare2 className="w-5 h-5" /> Generate ID Photo</>}
                {activeTab === 'restore' && <><History className="w-5 h-5" /> Restore Photo</>}
              </button>
            </div>
          </Panel>

          {/* Footer Info Cards */}
          {renderFooterInfo()}
        </section>

      </main>
    </div>
  );
}
