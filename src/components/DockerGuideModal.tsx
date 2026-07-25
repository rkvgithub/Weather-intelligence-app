import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ShieldCheck, HelpCircle } from 'lucide-react';

interface DockerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DockerGuideModal: React.FC<DockerGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Open Ubuntu WSL Terminal & Verify Runtimes',
      desc: 'Open Ubuntu WSL on your machine and verify Node.js and Docker are installed.',
      cmd: `node -v\nnpm -v\ndocker --version`,
    },
    {
      title: 'Step 2: Install Local Dependencies & Run Dev Server',
      desc: 'Navigate to the downloaded project folder inside WSL, install dependencies, and run locally.',
      cmd: `cd /path/to/weather-app\nnpm install\nnpm run dev`,
    },
    {
      title: 'Step 3: Build Docker Image from Ubuntu WSL',
      desc: 'Run the Docker build command from inside Ubuntu WSL to create the container image.',
      cmd: `docker build -t weather-intelligence-app .`,
    },
    {
      title: 'Step 4: Run Docker Container Locally',
      desc: 'Launch the container mapped to port 3000 (or port 8080) and test in browser.',
      cmd: `docker run -d -p 3000:80 --name weather-app weather-intelligence-app`,
    },
    {
      title: 'Step 5: Validate Container Execution',
      desc: 'Verify running containers and test city searches in browser at http://localhost:3000.',
      cmd: `docker ps\ncurl http://localhost:3000`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Ubuntu WSL & Docker Setup Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official assignment workflow for local testing and container validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WSL Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Important WSL Requirement:</p>
            <p>
              Per assignment instructions, all <code className="bg-amber-200/50 dark:bg-amber-950 px-1 rounded">npm</code> and <code className="bg-amber-200/50 dark:bg-amber-950 px-1 rounded">docker</code> commands MUST be executed inside Ubuntu WSL. Do not run Docker build directly from Windows Command Prompt or PowerShell.
            </p>
          </div>
        </div>

        {/* Step-by-Step Terminal Snippets */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {step.title}
                </p>
                <button
                  onClick={() => copyToClipboard(step.cmd, idx)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>

              <pre className="p-3 rounded-xl bg-slate-900 text-sky-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                {step.cmd}
              </pre>
            </div>
          ))}
        </div>

        {/* Evidence Verification Checklist */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Mandatory Submission Checklist:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Source code downloaded from AI Studio
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Tested locally with Node.js & npm in WSL
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Dockerfile & nginx.conf generated
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Docker image built in Ubuntu WSL
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Docker container running on port 3000
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              2 valid cities tested (e.g., London, Tokyo)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
