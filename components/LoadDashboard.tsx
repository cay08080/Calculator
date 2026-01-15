
import React from 'react';
import { CalculationResult } from '../types';
import { Weight, Maximize2, MoveVertical, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Props {
  result: CalculationResult;
  maxWidth: number;
}

export const LoadDashboard: React.FC<Props> = ({ result, maxWidth }) => {
  const utilization = (result.maxWidthUsed / maxWidth) * 100;
  const isSafe = result.warnings.length === 0 && result.layers.length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <Weight size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Weight</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{(result.totalWeight * 1000).toLocaleString('pt-BR')} <span className="text-sm font-bold text-slate-400">kg</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.totalWeight.toFixed(3)} t métricas</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
            <Maximize2 size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Width</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{result.maxWidthUsed.toFixed(0)} <span className="text-sm font-bold text-slate-400">cm</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ocupação: {utilization.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
            <MoveVertical size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Height</span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">{result.totalHeight.toFixed(1)} <span className="text-sm font-bold text-slate-400">cm</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.layers.length} camadas totais</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between col-span-1 lg:col-span-2 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 ${isSafe ? 'bg-green-600' : 'bg-red-600'}`}></div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl transition-all ${isSafe ? 'bg-green-50 text-green-600' : result.layers.length === 0 ? 'bg-slate-50 text-slate-300' : 'bg-red-50 text-red-600'}`}>
            {isSafe ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Safety Compliance</span>
        </div>
        <div>
          <p className={`text-2xl font-black tracking-tighter ${isSafe ? 'text-green-700' : result.layers.length === 0 ? 'text-slate-400' : 'text-red-700'}`}>
            {result.layers.length === 0 ? 'Sistema Ocioso' : isSafe ? 'Carga em Conformidade' : 'Instabilidade Detectada'}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isSafe ? 'Gaps dentro da margem operacional' : result.layers.length > 0 ? 'Corrija os desníveis de camada' : 'Aguardando dados de entrada'}
          </p>
        </div>
      </div>
    </div>
  );
};
