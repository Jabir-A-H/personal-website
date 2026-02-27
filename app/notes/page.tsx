'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const nodes = [
  { id: 'n1', title: 'Accounting Principles', category: 'study', x: 20, y: 30, content: ['Double-entry bookkeeping', 'Accrual vs Cash basis', 'Financial statement analysis'] },
  { id: 'n2', title: 'System Design', category: 'tech', x: 60, y: 20, content: ['Component decoupling', 'State management patterns', 'API architecture'] },
  { id: 'n3', title: 'Visual Hierarchy', category: 'design', x: 80, y: 60, content: ['Typography scales', 'Grid systems', 'Negative space utility'] },
  { id: 'n4', title: 'Value Theory', category: 'reflection', x: 30, y: 70, content: ['Subjective theory of value', 'Time value of money', 'Opportunity cost'] },
  { id: 'n5', title: 'Workflow Automation', category: 'tech', x: 50, y: 50, content: ['CI/CD pipelines', 'Scripting repetitive tasks', 'Tooling integration'] },
];

export default function NotesPage() {
  const [activeNode, setActiveNode] = useState<typeof nodes[0] | null>(null);

  return (
    <div className="col-span-12 w-full min-h-[70vh] relative font-mono py-8">
      <header className="absolute top-0 left-0 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Knowledge Map</h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Structured Thinking</p>
      </header>

      {/* Nodes Container */}
      <div className="absolute inset-0 w-full h-full mt-16">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer group"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveNode(node)}
          >
            <div className={`w-3 h-3 rounded-full mb-2 transition-colors ${
              activeNode?.id === node.id ? 'bg-slate-900' : 'bg-slate-400 group-hover:bg-slate-600'
            }`} />
            <span className={`text-xs whitespace-nowrap transition-colors ${
              activeNode?.id === node.id ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-800'
            }`}>
              {node.title}
            </span>
          </motion.div>
        ))}
        
        {/* Decorative connecting lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
          <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="60%" y2="20%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="80%" y2="60%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 right-0 w-72 bg-white border border-slate-200 shadow-xl p-6 z-20"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-sm">
                {activeNode.category}
              </span>
              <button 
                onClick={() => setActiveNode(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                &times;
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{activeNode.title}</h3>
            <ul className="space-y-3">
              {activeNode.content.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start">
                  <span className="text-slate-300 mr-2">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
