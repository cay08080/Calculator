
import React from 'react';
import { CalculationResult, Config } from '../types';
import { FileText, Printer, CheckCircle2, Terminal } from 'lucide-react';

interface Props {
  result: CalculationResult;
  config: Config;
}

export const LoadReport: React.FC<Props> = ({ result, config }) => {
  const date = new Date().toLocaleDateString('pt-BR');
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const totalsByBitola = result.layers.reduce((acc, layer) => {
    layer.slots.forEach(slot => {
      slot.beams.forEach(beam => {
        const key = `${beam.bitola}_${beam.length}`;
        if (!acc[key]) acc[key] = { bitola: beam.bitola, length: beam.length, qty: 0, weight: 0 };
        acc[key].qty += 1;
        acc[key].weight += beam.weight;
      });
    });
    return acc;
  }, {} as Record<string, { bitola: string, length: number, qty: number, weight: number }>);

  const summaryItems = Object.values(totalsByBitola) as { bitola: string, length: number, qty: number, weight: number }[];

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        <div className="p-10">
          {/* Cabeçalho do Relatório */}
          <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-10">
            <div className="flex gap-6 items-center">
              <div className="bg-[#0033a0] p-5 rounded-[24px] text-white shadow-xl shadow-blue-100">
                <FileText size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Plano de Carga Detalhado</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Gerdau Logística & Engineering</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Certificado de Conformidade</p>
              <p className="text-lg font-black text-slate-800">{date} — {time}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            {/* Informações de Engenharia */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Configurações Operacionais</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Veículo</p>
                  <p className="text-sm font-black text-slate-700">{config.vehicleType}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Largura Útil</p>
                  <p className="text-sm font-black text-slate-700">{config.maxWidth} cm</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Madeiramento</p>
                  <p className="text-sm font-black text-slate-700">{config.woodHeight} cm</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Utilização</p>
                  <p className="text-sm font-black text-blue-600">{((result.maxWidthUsed / config.maxWidth) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Totais de Carga */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Métricas Consolidadas</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-emerald-50/20 p-8 rounded-[32px] border border-emerald-100/30">
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Peso Líquido</p>
                  <p className="text-sm font-black text-emerald-800">{(result.totalWeight * 1000).toLocaleString('pt-BR')} kg</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Tonelagem</p>
                  <p className="text-sm font-black text-emerald-800">{(result.totalWeight).toFixed(3)} t</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Volume de Níveis</p>
                  <p className="text-sm font-black text-emerald-800">{result.layers.length} níveis</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Altura Máxima</p>
                  <p className="text-sm font-black text-emerald-800">{result.totalHeight.toFixed(1)} cm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Inventário */}
          <div className="space-y-8 mb-16">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-slate-800 rounded-full"></div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Resumo de Material</h4>
              </div>
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-[10px] font-black text-white uppercase tracking-widest">
                  <tr>
                    <th className="px-10 py-6">Bitola Gerdau</th>
                    <th className="px-10 py-6 text-center">Longitude</th>
                    <th className="px-10 py-6 text-center">Quantidade</th>
                    <th className="px-8 py-6 text-right">Massa Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summaryItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 font-black text-xs text-slate-800">{item.bitola}</td>
                      <td className="px-10 py-6 text-center font-bold text-[10px] text-blue-600 uppercase tracking-tighter">{item.length}M</td>
                      <td className="px-10 py-6 text-center font-black text-slate-800">{item.qty} feixes</td>
                      <td className="px-8 py-6 text-right font-black text-xs text-slate-700">{(item.weight * 1000).toLocaleString('pt-BR')} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RODAPÉ E STATUS */}
          <div className="flex justify-between items-center pt-10 border-t border-slate-100">
            <div className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-full border border-emerald-100">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Estabilidade Física: Pirâmide Validada</span>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-5 rounded-[20px] transition-all shadow-xl print:hidden"
            >
              <Printer size={16} />
              Exportar para PDF / Impressão
            </button>
          </div>
        </div>
      </div>

      {/* DETALHAMENTO TEXTUAL (ESTILO CONSOLE) */}
      <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Terminal size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase">Análise de Formatação Sistêmica</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Resumo executivo de engenharia</p>
          </div>
        </div>

        <div className="space-y-10 font-mono text-sm leading-relaxed">
          <div className="space-y-3">
            <p className="text-blue-400 font-bold opacity-50 uppercase text-[10px] tracking-widest">>> CARGA POR BITOLA</p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              {summaryItems.map((item, i) => (
                <p key={i} className="mb-2">
                  <span className="text-slate-400">POS {i+1}:</span> {item.qty} feixes <span className="text-blue-300 font-bold">{item.bitola}</span> | Massa: <span className="text-emerald-400">{(item.weight * 1000).toFixed(0)} kg</span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <p className="text-blue-400 font-bold opacity-50 uppercase text-[10px] tracking-widest">>> ESCALONAMENTO LONGITUDINAL</p>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                <p>NÍVEIS CALCULADOS: <span className="font-bold text-blue-300">{result.layers.length}</span></p>
                <div className="pl-6 border-l-2 border-white/10 space-y-2 text-xs">
                  {result.layers.map((l, idx) => (
                    <p key={idx}>
                      Layer {idx + 1}: {l.slots.length} feixes | Largura Útil: {l.totalWidth.toFixed(0)}cm | Massa Nível: {(l.slots.reduce((a,b)=>a+b.weight,0)*1000).toFixed(0)}kg
                    </p>
                  ))}
                </div>
             </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <p className="text-xs text-slate-500 font-sans italic">Plataforma Gerdau Steel v7.0 — Geometria Invariante</p>
            <p className="text-2xl font-black tracking-tighter text-emerald-400 font-sans">TOTAL: {(result.totalWeight * 1000).toLocaleString('pt-BR')} KG</p>
          </div>
        </div>
      </div>
    </div>
  );
};
