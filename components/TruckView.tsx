
import React from 'react';
import { Layer, ProcessedSlot } from '../types';
import { LayoutGrid } from 'lucide-react';

interface Props {
  layers: Layer[];
  maxWidth: number;
}

export const TruckView: React.FC<Props> = ({ layers, maxWidth }) => {
  const scaleX = 2.8;

  return (
    <div className="space-y-12">
      {/* Vista Transversal - Simetria Central Garantida */}
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tighter">Vista Transversal (Corte A-A)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geometria de Pirâmide Centralizada</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Estabilidade Ativa</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto pb-16 flex flex-col items-center custom-scrollbar">
          {/* Régua de Medida Superior */}
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="flex justify-between text-[10px] text-slate-400 font-black mb-6 border-b-2 border-slate-100 pb-2 uppercase tracking-tighter"
          >
            <span>- {maxWidth/2} cm</span>
            <span>Eixo Central (0)</span>
            <span>+ {maxWidth/2} cm</span>
          </div>

          {/* Cama do Veículo */}
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="border-x-[12px] border-b-[24px] border-slate-300 rounded-b-[48px] relative bg-[#fcfdfe] min-h-[450px] flex flex-col-reverse items-center p-8 shadow-inner"
          >
            {layers.map((layer, lIdx) => (
              <div key={lIdx} className="flex flex-col items-center shrink-0 w-full mb-1">
                {/* Calço de Madeira - Sempre centralizado e da largura da camada superior */}
                <div 
                  style={{ width: `${layer.totalWidth * scaleX}px` }}
                  className="h-3.5 bg-[#54301d] rounded shadow-sm mb-1 border-y border-black/10 opacity-90 transition-all duration-500"
                ></div>
                
                {/* Slots Centralizados na Camada */}
                <div className="flex justify-center items-end gap-1.5 mb-1 w-full transition-all duration-500">
                  {layer.slots.map((slot, sIdx) => (
                    <div 
                      key={sIdx}
                      style={{ 
                        width: `${slot.width * scaleX}px`, 
                        height: `${slot.height * scaleX}px` 
                      }}
                      className={`relative rounded-lg border-[1.5px] flex flex-col items-center justify-center transition-all group shrink-0 shadow-md overflow-hidden
                        ${slot.priority <= 2 ? 'bg-[#0033a0] border-[#00227a] text-white' : 
                          slot.priority <= 5 ? 'bg-[#1e40af] border-[#1e3a8a] text-white' : 
                          'bg-slate-300 border-slate-400 text-slate-700'}`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pointer-events-none">
                        <span className="text-[8px] font-black leading-none mb-0.5 drop-shadow-md truncate w-full text-center">
                          {slot.beams[0].bitola}
                        </span>
                        <span className="text-[6px] font-bold uppercase tracking-tighter opacity-70">P{slot.priority}</span>
                      </div>

                      {/* Tooltip Profissional */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-4 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none z-30 whitespace-nowrap shadow-2xl border border-white/10 transition-all scale-90 group-hover:scale-100 backdrop-blur-md">
                        <p className="font-black text-blue-400 mb-1">{slot.beams[0].bitola}</p>
                        <p className="font-bold opacity-80 uppercase tracking-widest text-[8px]">Dimensões: {slot.width}x{slot.height} cm</p>
                        <p className="font-bold opacity-80 uppercase tracking-widest text-[8px]">Peso Slot: {(slot.weight * 1000).toFixed(0)} kg</p>
                        <p className="font-bold text-emerald-400 uppercase tracking-widest text-[8px] mt-1">Entrega: Prioridade {slot.priority}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Rodas/Eixos Decorativos */}
            <div className="absolute -bottom-16 left-12 w-16 h-16 bg-slate-800 rounded-full border-[8px] border-slate-100 shadow-xl"></div>
            <div className="absolute -bottom-16 right-12 w-16 h-16 bg-slate-800 rounded-full border-[8px] border-slate-100 shadow-xl"></div>
          </div>
        </div>
      </div>

      {/* Vista Superior */}
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tighter">Planta de Carga (Superior)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Distribuição Longitudinal e Balanceamento</p>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto pb-6 custom-scrollbar">
          <div 
            style={{ width: '850px', minHeight: '450px' }}
            className="mx-auto border-[16px] border-slate-100 rounded-[56px] relative bg-[#f8fafc] p-10 flex flex-col gap-5 shadow-inner"
          >
            {layers.length > 0 ? (
              layers.slice().reverse().map((layer, lIdx) => (
                <div key={lIdx} className="flex flex-col gap-2.5 bg-white/60 p-6 rounded-[36px] border border-slate-200/50 items-center shadow-sm">
                  <div className="flex items-center justify-between w-full mb-2 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Camada Nível {layers.length - layer.index}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Ocupação: {layer.totalWidth} cm</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 w-full items-center">
                    {layer.slots.map((slot, sIdx) => (
                      <div 
                        key={sIdx}
                        className="flex gap-2 shrink-0 h-11 w-full justify-center"
                        style={{ maxWidth: `${(slot.width / maxWidth) * 100}%` }}
                      >
                        {slot.isPaired ? (
                          <>
                            <div className="h-full w-1/2 bg-blue-600 border-2 border-blue-800 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-2">
                              <span className="text-[8px] text-white font-black truncate w-full text-center">{slot.beams[0].bitola}</span>
                              <span className="text-[6px] text-white/40 font-bold">6M</span>
                            </div>
                            <div className="h-full w-1/2 bg-blue-600 border-2 border-blue-800 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-2">
                              <span className="text-[8px] text-white font-black truncate w-full text-center">{slot.beams[1]?.bitola || slot.beams[0].bitola}</span>
                              <span className="text-[6px] text-white/40 font-bold">6M</span>
                            </div>
                          </>
                        ) : (
                          <div className="h-full w-full bg-[#0033a0] border-2 border-[#00227a] rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-4">
                            <span className="text-[9px] text-white font-black tracking-widest uppercase truncate w-full text-center">{slot.beams[0].bitola}</span>
                            <span className="text-[6px] text-white/30 font-black tracking-[0.3em] uppercase">{slot.beams[0].length}M</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-slate-200 uppercase font-black italic tracking-[0.5em] gap-6">
                <LayoutGrid size={64} className="opacity-10" />
                Aguardando Dados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
