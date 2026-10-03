import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisLoading } from './components/AnalysisLoading';
import { ErrorAlert } from './components/ErrorAlert';
import { ResultDisplay } from './components/ResultDisplay';
import { UploadedFileState, BugAnalysis } from './types';
import { analyzeBugScreenshot, SUPPORTED_MODELS, DEFAULT_MODEL } from './services/gemini';
import { 
  Bug, 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  ShieldCheck, 
  Key, 
  Settings2,
  Cpu,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PresetBug {
  name: string;
  filename: string;
  context: string;
  analysis: BugAnalysis;
  renderCanvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const PRESET_BUGS: PresetBug[] = [
  {
    name: 'React TypeError',
    filename: 'react-typeerror.png',
    context: 'Occurred right after fetching user list from /api/v1/users',
    analysis: {
      whatIsWrong: "TypeError: Cannot read properties of undefined (reading 'map') in UserList.tsx at line 42.",
      whyItIsHappening: "The 'users' state variable was initialized as undefined or the API response payload returned { data: [...] } instead of a direct array, causing .map() to be invoked on undefined before the fetch resolved.",
      howToFix: [
        "Ensure the initial state provides a fallback empty array: const [users, setUsers] = useState<User[]>([]);",
        "Safely access the array using optional chaining: users?.map(user => ...)",
        "Verify the backend API response schema to ensure you are setting setUsers(res.data.users ?? res.data ?? [])."
      ],
      immediateNextAction: "Change line 18 in UserList.tsx to: const [users, setUsers] = useState<User[]>([]); and add users?.map(...) at line 42.",
      errorType: "React Runtime TypeError",
      confidence: "High"
    },
    renderCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('Uncaught TypeError: users.map is not a function', 25, 60);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px monospace';
      ctx.fillText('at UserList (src/components/UserList.tsx:42:21)', 25, 95);
      ctx.fillText('at renderWithHooks (react-dom.development.js:15486)', 25, 125);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('HTTP 200 OK: GET /api/v1/users -> { "status": "ok" }', 25, 170);
    }
  },
  {
    name: 'Python Module Error',
    filename: 'python-modulenotfound.png',
    context: 'Running python main.py inside virtualenv after pulling latest changes',
    analysis: {
      whatIsWrong: "ModuleNotFoundError: No module named 'google.genai' in app.py at line 3.",
      whyItIsHappening: "The new Google GenAI SDK was added to requirements.txt but has not been installed into the active Python environment.",
      howToFix: [
        "Run pip install google-genai to install the missing package.",
        "Alternatively update all environment packages via: pip install -r requirements.txt",
        "Verify you have activated your virtual environment before running the script."
      ],
      immediateNextAction: "pip install google-genai",
      errorType: "Python ModuleNotFoundError",
      confidence: "High"
    },
    renderCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px monospace';
      ctx.fillText('$ python app.py', 25, 45);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Traceback (most recent call last):', 25, 75);
      ctx.fillText('  File "app.py", line 3, in <module>', 25, 105);
      ctx.fillText('    from google import genai', 25, 135);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('ModuleNotFoundError: No module named \'google.genai\'', 25, 175);
    }
  },
  {
    name: 'Docker Port Conflict',
    filename: 'docker-bind-conflict.png',
    context: 'Running docker compose up -d for backend API service',
    analysis: {
      whatIsWrong: "Docker bind error: Address already in use (port 8000).",
      whyItIsHappening: "Another host process or previously running container is already bound to local port 8000.",
      howToFix: [
        "Find and terminate the process occupying port 8000.",
        "Or map the container to an alternative host port in docker-compose.yml (e.g. 8080:8000)."
      ],
      immediateNextAction: "Kill the process occupying port 8000 or change port mapping in docker-compose.yml to '8080:8000'.",
      errorType: "Docker Network Bind Failure",
      confidence: "High"
    },
    renderCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px monospace';
      ctx.fillText('$ docker compose up -d', 25, 45);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('Error response from daemon: driver failed programming external connectivity', 25, 80);
      ctx.fillText('Bind for 0.0.0.0:8000 failed: port is already allocated', 25, 115);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px monospace';
      ctx.fillText('Container web-service-1 exited with code 128', 25, 155);
    }
  }
];

export const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [userContext, setUserContext] = useState<string>('');
  const [showContextField, setShowContextField] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  
  // Model & API Key state
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem('bugbuster_api_key') || ''
  );
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem('bugbuster_api_key', val);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    if (!uploadedFile.base64Data) {
      setError('Screenshot data is still loading. Please try again in a moment.');
      return;
    }

    const hasEnvKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
    if (!hasEnvKey && !apiKey.trim()) {
      setShowConfig(true);
      setError('Please provide a Google Gemini API Key below or in .env.local to analyze with Gemma 4.');
      return;
    }

    setError(null);
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeBugScreenshot(
        uploadedFile.base64Data,
        uploadedFile.mimeType,
        apiKey.trim(),
        selectedModel,
        userContext
      );
      setAnalysis(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze screenshot. Please verify your API key or model.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUserContext('');
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handleLoadPreset = (preset: PresetBug) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      preset.renderCanvas(ctx, canvas.width, canvas.height);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], preset.filename, { type: 'image/png' });
        const previewUrl = URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = (reader.result as string)?.split(',')[1] || '';
          setUploadedFile({
            file,
            previewUrl,
            base64Data,
            mimeType: 'image/png',
            name: preset.filename,
            sizeFormatted: '38 KB',
          });
          setUserContext(preset.context);
          setShowContextField(true);
          setError(null);
          setAnalysis(null);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header onReset={handleReset} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MLH Hacktoberfest &bull; Gemma 4 Multimodal Error Solver</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Instant Error Diagnosis with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400">
              Bug Buster
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload any technical error, compiler traceback, or browser console screenshot. 
            Gemma 4 examines the visual evidence and outputs an exact 4-part remediation plan.
          </p>
        </section>

        {/* Optional Quick Config Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Model:</span>
            <span className="font-mono text-purple-300 font-semibold">{selectedModel}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide Config' : 'Configure Model / Key'}</span>
          </button>
        </div>

        {/* Config Dropdown Drawer */}
        {showConfig && (
          <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 space-y-3 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gemini API Key (or set VITE_GEMINI_API_KEY in .env.local)</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Target Model</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  {SUPPORTED_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Keys entered here stay strictly in your local browser and are never sent anywhere except directly to Google Gemini API.
            </p>
          </div>
        )}

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Presets:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_BUGS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-purple-400" />
              <span>Step 1: Provide Error Screenshot</span>
            </h2>
          </div>

          <ImageUpload
            uploadedFile={uploadedFile}
            onFileSelect={(file) => {
              setUploadedFile(file);
              setAnalysis(null);
              setError(null);
            }}
            disabled={isAnalyzing}
          />

          {/* Add context to the bug (collapsible text area) */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowContextField(!showContextField)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium">
                  Add Context / Notes to the Bug {userContext ? '(Added)' : '(Optional)'}
                </span>
              </div>
              {showContextField ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showContextField && (
              <div className="p-4 pt-1 border-t border-slate-800/60 space-y-2">
                <p className="text-[11px] text-slate-400">
                  Paste terminal logs, recent git commits, or what command you ran:
                </p>
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="e.g. Ran 'npm run dev' on Node v20 after pulling branch feat/auth..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500 placeholder:text-slate-600 resize-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* Action Controls */}
        <section className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!uploadedFile || isAnalyzing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg ${
              !uploadedFile || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-98 cursor-pointer'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Screenshot with Gemma 4</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Error Alert Display */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={handleAnalyze}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Loading State Display */}
        {isAnalyzing && <AnalysisLoading />}

        {/* Result State Display */}
        {analysis && !isAnalyzing && (
          <section className="pt-2">
            <ResultDisplay
              analysis={analysis}
              onReset={handleReset}
            />
          </section>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/30 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bug Buster &bull; MLH Hack Day Hyderabad MVP</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemma 4 Multimodal</span>
            <span>React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
