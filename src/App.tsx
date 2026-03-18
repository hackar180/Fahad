/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, CheckCircle2, Loader2, ShieldAlert, Terminal, Server, Search, Wifi } from "lucide-react";

interface Target {
  model: string;
  sim: string;
  id: string;
}

export default function App() {
  const [currentTargetIndex, setCurrentTargetIndex] = useState(-1);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"scanning" | "connecting" | "hacking" | "accessing" | "whatsapp" | "complete" | "error">("scanning");
  
  const targets: Target[] = [
    { model: "iPhone 15 Pro Max", sim: "01797837149", id: "A2849" },
    { model: "iPhone 14 Pro Max", sim: "01797837149", id: "A2651" }
  ];

  const notify = async (stepNum: number, target: Target) => {
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: stepNum,
          deviceModel: target.model,
          simNumber: target.sim,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error(`Failed to notify step ${stepNum} for ${target.model}:`, error);
    }
  };

  useEffect(() => {
    const runFullSequence = async () => {
      // Phase 1: Network Scan
      setStatus("scanning");
      await new Promise(r => setTimeout(r, 4000));

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        setCurrentTargetIndex(i);
        setStatus("connecting");
        setStep(1);
        
        // Step 1: Initial Connection
        await notify(1, target);
        await new Promise(r => setTimeout(r, 3000));
        
        // Step 2: Hacking
        setStatus("hacking");
        setStep(2);
        await notify(2, target);
        await new Promise(r => setTimeout(r, 3000));

        // Step 3: Accessing
        setStatus("accessing");
        setStep(3);
        await notify(3, target);
        await new Promise(r => setTimeout(r, 3000));

        // Step 4: Complete
        setStatus("complete");
        setStep(4);
        await notify(4, target);
        await new Promise(r => setTimeout(r, 3000));

        // Step 5: WhatsApp Hacking
        setStatus("whatsapp");
        setStep(5);
        await notify(5, target);
        await new Promise(r => setTimeout(r, 4000));
        
        if (i < targets.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    };

    runFullSequence();
  }, []);

  const getIcon = () => {
    switch (status) {
      case "scanning": return <Search className="w-12 h-12 text-blue-500 animate-pulse" />;
      case "connecting": return <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />;
      case "hacking": return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case "accessing": return <Terminal className="w-12 h-12 text-amber-500" />;
      case "whatsapp": return <Smartphone className="w-12 h-12 text-green-500 animate-pulse" />;
      case "complete": return <Server className="w-12 h-12 text-emerald-500" />;
      default: return <Smartphone className="w-12 h-12 text-zinc-500" />;
    }
  };

  const getTitle = () => {
    if (status === "scanning") return "Scanning Network...";
    const target = targets[currentTargetIndex];
    if (!target) return "Initializing...";

    switch (status) {
      case "connecting": return `Target: ${target.model}`;
      case "hacking": return "DARK WEB ACCESS: SAUDI 🇸🇦";
      case "accessing": return `ATTACK INITIATED: SIM ${target.sim}`;
      case "whatsapp": return "WHATSAPP HACKING: IN PROGRESS";
      case "complete": return "CONTROL ESTABLISHED: FULL ACCESS";
      default: return "Device Information";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-500/50 tracking-widest mb-2">
            <Wifi className="w-3 h-3" />
            <span>REMOTE SERVER: ACTIVE</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={status + (currentTargetIndex >= 0 ? targets[currentTargetIndex].model : "")}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              className={`p-4 rounded-full border ${
                status === "hacking" ? "bg-red-500/10 border-red-500/20" :
                status === "accessing" ? "bg-amber-500/10 border-amber-500/20" :
                status === "scanning" ? "bg-blue-500/10 border-blue-500/20" :
                "bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              {getIcon()}
            </motion.div>
          </AnimatePresence>

          <div className="space-y-2">
            <h1 className={`text-xl font-bold tracking-tighter uppercase ${
              status === "hacking" ? "text-red-500" :
              status === "accessing" ? "text-amber-500" :
              status === "scanning" ? "text-blue-500" :
              "text-emerald-500"
            }`}>
              {getTitle()}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed min-h-[40px]">
              {status === "scanning" && "Detecting vulnerable devices on the local subnet..."}
              {status === "connecting" && `Synchronizing with ${targets[currentTargetIndex]?.model} hardware protocols...`}
              {status === "hacking" && "Dark web থেকে access নেওয়া হচ্ছে via Tor Network."}
              {status === "accessing" && "Device-এর access নেওয়া হচ্ছে. SIM attack in progress."}
              {status === "whatsapp" && "WhatsApp messages extraction... Security bypassed."}
              {status === "complete" && "Phone-এ attack গেছে. Full control established."}
            </p>
          </div>

          <div className="w-full space-y-3 pt-4 border-t border-white/5">
            {status === "scanning" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>Searching...</span>
                  <span className="animate-pulse">0%</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>Device Model</span>
                  <span className="text-zinc-300">{targets[currentTargetIndex]?.model}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>SIM Number</span>
                  <span className="text-zinc-300">{targets[currentTargetIndex]?.sim}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>Target ID</span>
                  <span className="text-zinc-300">{targets[currentTargetIndex]?.id}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>System</span>
                  <span className="text-zinc-300">Linux PC</span>
                </div>
                
                <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    key={currentTargetIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                    className={`h-full ${
                      status === "hacking" ? "bg-red-500" :
                      status === "accessing" ? "bg-amber-500" :
                      status === "whatsapp" ? "bg-green-500" :
                      "bg-emerald-500"
                    }`}
                  />
                </div>
              </>
            )}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            {targets.map((t, idx) => (
              <div 
                key={t.model}
                className={`p-2 rounded-lg border text-[8px] font-mono flex flex-col items-start transition-colors ${
                  idx === currentTargetIndex ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" :
                  idx < currentTargetIndex ? "bg-zinc-800/50 border-white/5 text-zinc-500" :
                  "bg-zinc-900 border-white/5 text-zinc-700"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {idx < currentTargetIndex ? <CheckCircle2 className="w-2 h-2" /> : <Smartphone className="w-2 h-2" />}
                  <span>{t.model}</span>
                </div>
                <span className="mt-1 opacity-50">{idx === currentTargetIndex ? "PROCESSING..." : idx < currentTargetIndex ? "CAPTURED" : "PENDING"}</span>
              </div>
            ))}
          </div>

          {status === "complete" && currentTargetIndex === targets.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-emerald-500 text-[10px] font-mono animate-pulse"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>ALL TARGETS COMPROMISED</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
