"use client";

import Link from "next/link";
import { 
  ArrowRight, Terminal, Zap, Layers, Play, CheckCircle2, 
  Cpu, MessageSquare, Monitor, FileCode2, RefreshCw 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-0 text-text selection:bg-purple/30 font-sans">
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-bg-0/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center shadow-[0_0_15px_rgba(124,110,245,0.4)]">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <polygon points="6,1 11,4.5 9,11 3,11 1,4.5" fill="none" stroke="white" strokeWidth="1.4" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-white">BuildZero</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="text-sm text-text-3 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="px-5 py-2 bg-white text-black font-medium text-[13px] rounded-full hover:bg-gray-200 transition-colors">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center border-b border-border">
          <div className="absolute inset-0 bg-bg-0">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#7c6ef5 1px,transparent 1px),linear-gradient(90deg,#7c6ef5 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            
            {/* Moving background animation boxes */}
            <div className="absolute top-[20%] left-[15%] w-24 h-24 bg-purple/10 border border-purple/20 rounded-2xl backdrop-blur-[2px] pointer-events-none animate-[float-1_7s_ease-in-out_infinite]" />
            <div className="absolute top-[60%] left-[10%] w-32 h-32 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-[2px] pointer-events-none animate-[float-2_10s_ease-in-out_infinite_reverse]" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[25%] right-[15%] w-40 h-40 bg-accent-amber/10 border border-accent-amber/20 rounded-3xl backdrop-blur-[2px] pointer-events-none animate-[float-3_12s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[70%] right-[10%] w-20 h-20 bg-accent-green/10 border border-accent-green/20 rounded-xl backdrop-blur-[2px] pointer-events-none animate-[float-1_8s_ease-in-out_infinite_reverse]" style={{ animationDelay: '3s' }} />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] bg-purple/15 blur-[120px] rounded-full pointer-events-none" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 w-full text-center z-10 pt-10">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-2 border border-border text-text-2 text-xs mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
                BuildZero is now in public beta
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
                Build Web Apps <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-cyan-400">At Light Speed.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-3 mb-10 max-w-2xl mx-auto leading-relaxed">
                The intelligent, zero-friction development environment. Turn prompts into complete applications instantly, running directly in your browser.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-purple text-white rounded-xl font-medium hover:opacity-90 transition-opacity w-full sm:w-auto shadow-[0_0_24px_rgba(124,110,245,0.4)] text-[14px]">
                  Start Building <ArrowRight size={16} />
                </Link>
                <Link href="#demo" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-bg-2 border border-border text-text rounded-xl font-medium hover:bg-bg-3 transition-colors w-full sm:w-auto text-[14px]">
                  <Play size={16} fill="currentColor" /> View Demo
                </Link>
              </div>
            </div>

            <div className="mt-20 mx-auto max-w-5xl rounded-2xl border border-border bg-bg-1 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative animate-fade-in-up delay-200">
              <div className="h-10 border-b border-border bg-bg-2 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-red" />
                <div className="w-3 h-3 rounded-full bg-accent-amber" />
                <div className="w-3 h-3 rounded-full bg-accent-green" />
                <div className="mx-auto text-[11px] text-text-3 font-medium flex items-center gap-2">
                  <Monitor size={12} /> app.buildzero.dev
                </div>
                <div className="w-16" />
              </div>
              <div className="flex flex-col md:flex-row h-[420px] bg-bg-0 text-left">
                <div className="w-full md:w-[45%] border-b md:border-b-0 md:border-r border-border p-6 font-mono text-[13px] overflow-hidden relative">
                  <div className="text-purple mb-4 text-xs flex items-center gap-2 bg-purple/10 border border-purple/20 w-fit px-2 py-1 rounded">
                    <RefreshCw size={12} className="animate-spin" /> Compiling AI instructions...
                  </div>
                  <div className="text-blue-400">import <span className="text-text-2">React, {'{'} useState {'}'}</span> from <span className="text-accent-green">"react"</span>;</div>
                  
                  <div className="text-text-2 mt-4"><span className="text-purple">export default</span> <span className="text-blue-400">function</span> <span className="text-accent-amber">Dashboard</span>() {'{'}</div>
                  <div className="pl-4 text-text-3 mt-1">const [loading] = <span className="text-blue-400">useState</span>(false);</div>
                  <div className="pl-4 text-blue-400 mt-3">return (</div>
                  <div className="pl-8 text-text-3">&lt;<span className="text-blue-300">div</span> className=<span className="text-accent-green">"min-h-screen bg-black"</span>&gt;</div>
                  <div className="pl-12 text-text-3">&lt;<span className="text-blue-300">h1</span> className=<span className="text-accent-green">"text-2xl font-bold"</span>&gt;Analytics&lt;/<span className="text-blue-300">h1</span>&gt;</div>
                  <div className="pl-12 text-text-3">&lt;<span className="text-blue-300">MetricsGrid</span> /&gt;</div>
                  <div className="pl-8 text-text-3">&lt;/<span className="text-blue-300">div</span>&gt;</div>
                  <div className="pl-4 text-blue-400">);</div>
                  <div className="text-text-2">{'}'}</div>

                  <div className="w-2 h-4 bg-purple/80 absolute top-[280px] left-[32px] animate-pulse" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-0 to-transparent" />
                </div>
                
                <div className="w-full md:w-[55%] bg-bg-1 relative p-6 flex flex-col justify-center">
                  <div className="w-full h-full border border-border-2 rounded-xl bg-bg-0/60 shadow-inner flex flex-col items-center justify-center overflow-hidden">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-purple/10 rounded-2xl mx-auto flex items-center justify-center mb-5 border border-purple/20">
                        <Zap size={24} className="text-purple" />
                      </div>
                      <h2 className="text-[22px] font-bold text-text mb-2 tracking-tight">Live Server Running</h2>
                      <p className="text-text-3 text-[13px] max-w-[250px] mx-auto leading-relaxed">Instant HMR inside secure WebContainers without latency.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PIPELINE SECTION */}
        <section className="py-32 bg-bg-0 relative border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 cursor-default">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Under The Hood</h2>
              <p className="text-text-3 text-lg">A complete Node.js architecture executed entirely inside the browser.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-[20px] text-center max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center w-full md:w-56 z-10 bg-bg-1 p-6 rounded-2xl border border-border">
                <div className="w-14 h-14 rounded-xl bg-bg-2 border border-border-2 flex items-center justify-center mb-4">
                  <MessageSquare size={22} className="text-text-2" />
                </div>
                <div className="text-[15px] font-medium text-text mb-1">1. Concept Prompt</div>
                <div className="text-[12.5px] text-text-3 leading-snug">Natural language requirement parsing</div>
              </div>

              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-border to-purple max-w-[50px] shrink-0" />
              <div className="md:hidden w-px h-6 bg-gradient-to-b from-border to-purple my-1 shrink-0" />

              {/* Step 2 */}
              <div className="flex flex-col items-center w-full md:w-56 z-10 bg-bg-1 p-6 rounded-2xl border border-border shadow-[0_0_20px_rgba(124,110,245,0.1)]">
                <div className="w-14 h-14 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center mb-4">
                  <Cpu size={22} className="text-purple" />
                </div>
                <div className="text-[15px] font-medium text-text mb-1">2. AI Generation</div>
                <div className="text-[12.5px] text-text-3 leading-snug">Writes robust full-stack codebase</div>
              </div>

              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-purple to-blue-500 max-w-[50px] shrink-0" />
              <div className="md:hidden w-px h-6 bg-gradient-to-b from-purple to-blue-500 my-1 shrink-0" />

              {/* Step 3 */}
              <div className="flex flex-col items-center w-full md:w-56 z-10 bg-bg-1 p-6 rounded-2xl border border-border">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <FileCode2 size={22} className="text-blue-400" />
                </div>
                <div className="text-[15px] font-medium text-text mb-1">3. Virtual Structure</div>
                <div className="text-[12.5px] text-text-3 leading-snug">Files mounted to in-memory system</div>
              </div>

              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-blue-500 to-green-500 max-w-[50px] shrink-0" />
              <div className="md:hidden w-px h-6 bg-gradient-to-b from-blue-500 to-green-500 my-1 shrink-0" />

              {/* Step 4 */}
              <div className="flex flex-col items-center w-full md:w-56 z-10 bg-bg-1 p-6 rounded-2xl border border-border">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <Monitor size={22} className="text-accent-green" />
                </div>
                <div className="text-[15px] font-medium text-text mb-1">4. WebContainer</div>
                <div className="text-[12.5px] text-text-3 leading-snug">Zero-latency secure preview server</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-32 bg-bg-1" id="demo">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-bg-0 border border-border rounded-2xl p-7 hover:border-border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-default group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border bg-purple/10 border-purple/20 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="text-purple" />
                </div>
                <h3 className="text-[16px] font-semibold text-text mb-3">Multi-Framework Output</h3>
                <p className="text-[13px] text-text-3 leading-relaxed">Instantly deploy Next.js, React, HTML/CSS, or Vanilla JS templates securely.</p>
              </div>

              <div className="bg-bg-0 border border-border rounded-2xl p-7 hover:border-border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-default group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border bg-accent-amber/10 border-accent-amber/20 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-accent-amber" />
                </div>
                <h3 className="text-[16px] font-semibold text-text mb-3">Instant Booting</h3>
                <p className="text-[13px] text-text-3 leading-relaxed">Node.js environments load in milliseconds. Forget agonizing VM spin-ups.</p>
              </div>

              <div className="bg-bg-0 border border-border rounded-2xl p-7 hover:border-border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-default group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border bg-blue-500/10 border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Terminal className="text-blue-400" />
                </div>
                <h3 className="text-[16px] font-semibold text-text mb-3">Hot Module Reloading</h3>
                <p className="text-[13px] text-text-3 leading-relaxed">AI code insertions immediately reflect in the integrated browser preview seamlessly.</p>
              </div>

              <div className="bg-bg-0 border border-border rounded-2xl p-7 hover:border-border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-default group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border bg-accent-green/10 border-accent-green/20 group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="text-accent-green" />
                </div>
                <h3 className="text-[16px] font-semibold text-text mb-3">True Browser Execution</h3>
                <p className="text-[13px] text-text-3 leading-relaxed">Running full Node CLI tools locally without remote servers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEV EXPERIENCE SECTION */}
        <section className="py-32 bg-bg-0 overflow-hidden relative border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.15] tracking-tight">
                  Developer experience, <br className="hidden md:block"/> strictly <span className="text-purple">reimagined.</span>
                </h2>
                <p className="text-lg text-text-3 mb-10 leading-relaxed max-w-lg">
                  We threw away the friction of traditional environment setup. Enjoy automatic dependency resolution, intelligent error-handling algorithms, and an unbreakable link between AI design and pure execution.
                </p>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-[15px] font-medium text-text-2">
                    <div className="w-6 h-6 rounded-full bg-purple/10 flex items-center justify-center text-purple flex-shrink-0 border border-purple/20">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Zero local configuration or docker setup required</span>
                  </li>
                  <li className="flex items-center gap-4 text-[15px] font-medium text-text-2">
                    <div className="w-6 h-6 rounded-full bg-purple/10 flex items-center justify-center text-purple flex-shrink-0 border border-purple/20">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Automated error parsing and CLI auto-fix loops</span>
                  </li>
                  <li className="flex items-center gap-4 text-[15px] font-medium text-text-2">
                    <div className="w-6 h-6 rounded-full bg-purple/10 flex items-center justify-center text-purple flex-shrink-0 border border-purple/20">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Local browser-filesystem synchronization</span>
                  </li>
                </ul>
              </div>

              <div className="w-full lg:w-1/2 relative">
                <div className="relative rounded-2xl border border-border-2 bg-bg-1 p-6 z-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-5 border-b border-border-2 pb-3">
                    <div className="flex items-center gap-3">
                      <Terminal className="text-text-3" size={16} />
                      <span className="text-xs font-mono font-medium text-text-2">dev-server</span>
                    </div>
                    <div className="text-[10px] text-text-3 font-mono">WebContainer Core</div>
                  </div>
                  <div className="font-mono text-[13px] space-y-2.5 opacity-90 pb-2">
                    <div className="flex gap-2"><span className="text-accent-green">➜</span><span className="text-text-3">npm run dev</span></div>
                    <div><span className="text-blue-400 font-bold">VITE</span> <span className="text-text-3">v5.4.2 ready in</span> <span className="text-white">120 ms</span></div>
                    <div className="text-text-3 pt-2"><span className="text-accent-green font-bold">  ➜</span>  Local:   <span className="text-blue-400 underline">http://localhost:3000/</span></div>
                    <div className="text-text-3"><span className="text-text-3 font-bold">  ➜</span>  Network: use --host to expose</div>
                    <div className="text-text-3 pt-2"><span className="text-purple">12:34:00 PM</span> [vite] hmr update <span className="text-white">/src/App.tsx</span></div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-purple/15 blur-[100px] rounded-full z-0 pointer-events-none" />
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 bg-bg-0 relative border-t border-border overflow-hidden">
          <div className="absolute inset-0 bg-purple/5" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-purple/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to bring ideas to life?</h2>
            <p className="text-[17px] text-text-3 mb-10 max-w-2xl mx-auto leading-relaxed">
              Start building complete applications seamlessly from your browser. 
              No credit card required. Pure innovation awaits.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-9 py-4 bg-white text-black rounded-xl font-bold text-[14px] hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Launch Editor Space <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-bg-1 text-center text-text-3 text-[13px] border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-purple flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <polygon points="6,1 11,4.5 9,11 3,11 1,4.5" fill="none" stroke="white" strokeWidth="1.4" />
              </svg>
            </div>
            <span className="font-semibold text-text-2 tracking-tight text-[14px]">BuildZero</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub Repository</Link>
            <Link href="#" className="hover:text-white transition-colors">Integration</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
