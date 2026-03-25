import React from 'react';
import { motion } from 'framer-motion';

const AttackMap = ({ incidents = [] }: { incidents: any[] }) => {
    // Standard coordinates for demo locations
    const locations: Record<string, { x: number, y: number }> = {
        'New York': { x: 25, y: 35 },
        'Tokyo': { x: 85, y: 40 },
        'London': { x: 45, y: 30 },
        'Russia': { x: 65, y: 25 },
        'Home': { x: 30, y: 45 },
        'Mumbai': { x: 70, y: 55 },
        'Sydney': { x: 85, y: 80 },
        'Brazil': { x: 35, y: 75 },
    };

    const targetPos = { x: 50, y: 50 }; // Central Bank Server

    return (
        <div className="relative w-full h-[300px] bg-slate-950/20 rounded-3xl border border-white/5 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Minimal World Map Background (dots) */}
                {Array.from({ length: 200 }).map((_, i) => (
                    <circle
                        key={i}
                        cx={Math.random() * 100}
                        cy={Math.random() * 100}
                        r="0.2"
                        fill="rgba(255,255,255,0.03)"
                    />
                ))}

                {/* Grid Lines */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.05" strokeOpacity="0.1" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.05" strokeOpacity="0.1" />

                {/* Central Target (The Bank) */}
                <circle cx={targetPos.x} cy={targetPos.y} r="2" fill="#10b981" fillOpacity="0.2" />
                <motion.circle
                    cx={targetPos.x}
                    cy={targetPos.y}
                    r="1"
                    fill="#10b981"
                    animate={{ r: [1, 3, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <rect x={targetPos.x - 1} y={targetPos.y - 1} width="2" height="2" fill="#10b981" rx="0.3" />

                {/* Attack Vectors */}
                {incidents.slice(0, 10).map((inc, idx) => {
                    const loc = inc.location || 'Unknown';
                    const start = locations[loc] || { x: 10 + (idx * 15) % 80, y: 20 + (idx * 20) % 60 };
                    
                    return (
                        <g key={inc.id}>
                            {/* Origin Point */}
                            <circle cx={start.x} cy={start.y} r="0.8" fill={inc.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'} />
                            <motion.circle
                                cx={start.x}
                                cy={start.y}
                                r="0.8"
                                fill={inc.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                            />

                            {/* Attack Line */}
                            <motion.path
                                d={`M ${start.x} ${start.y} Q ${(start.x + targetPos.x) / 2} ${(start.y + targetPos.y) / 2 - 10} ${targetPos.x} ${targetPos.y}`}
                                fill="none"
                                stroke={inc.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                                strokeWidth="0.3"
                                strokeDasharray="1, 2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 1.5, delay: idx * 0.2 }}
                            />

                            {/* Projectile */}
                            <motion.circle
                                r="0.4"
                                fill={inc.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                                initial={{ offset: 0 }}
                                animate={{ 
                                    cx: [start.x, targetPos.x],
                                    cy: [start.y, targetPos.y],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5, ease: "linear" }}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest">LIVE ATTACK VECTORS</span>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Global Ingress Monitor</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">v5.0 Stable</span>
            </div>
        </div>
    );
};

export default AttackMap;
