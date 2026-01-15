
import React, { useState } from 'react';
import { Layer } from '../types';
import { ChevronDown, ChevronUp, Layers, Package, Ruler, Weight, AlertCircle, Info } from 'lucide-react';

interface Props {
  layers: Layer[];
}

export const LayerDetails: React.FC<Props> = ({ layers }) => {
  const [expandedLayers, setExpandedLayers] = useState<number[]>([]);

  const toggleLayer = (index: number) => {
    setExpandedLayers(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Exibimos da Camada Superior para a Base na lista para facilitar leitura de quem descarrega
  const displayLayers = [...layers].reverse();

  return (
    <div className="bg-white rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#0033a0] rounded-xl text-white shadow-lg shadow-blue-100">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Escaneamento por Camada</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Composição física do topo para a base (LIFO/Prioridade)</p>
          </div>
        </div>
        <button 
          onClick={() => setExpandedLayers(expandedLayers.length === layers.length ? [] : layers.map(l => l.index))}
          className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          {expandedLayers.length === layers.length ? 'Recolher Tudo' : 'Expandir Tudo'}
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {displayLayers.map((layer) => {
          const isExpanded = expandedLayers.includes(layer.index);
          const layerWeight = layer.slots.reduce((acc, s) => acc + s.weight, 0);
          const slotsWidth = layer.slots.reduce((acc, s) => acc + s.width, 0);
          const techSpacing = layer.totalWidth - slotsWidth;
          
          return (
            <div key={layer.index} className="transition-all">
              <button 
                onClick={() => toggleLayer(layer.index)}
                className={`w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left ${isExpanded ? 'bg-blue-50/20' : ''}`}
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center bg-slate-100 w-12 h-12 rounded-2xl group-hover:bg-white transition-colors">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Nível</span>
                    <span className="text-xl font-black text-slate-800 leading-none">
                      {layer.index + 1}
                    </span>
                  </div>
                  
                  <div className="h-8 w-px bg-slate-200"></div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                        <Package size={12} className="text-blue-500" /> Pegada Total
                      </span>
                      <span className="text-xs font-black text-slate-700">{layer.totalWidth.toFixed(0)} cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                        <Weight size={12} className="text-blue-500" /> Peso Nível
                      </span>
                      <span className="text-xs font-black text-slate-700">{(layerWeight * 1000).toFixed(0)} kg</span>
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                        <Ruler size={12} className="text-blue-500" /> Altura Feixes
                      </span>
                      <span className="text-xs font-black text-slate-700">{layer.maxHeight} cm</span>
                    </div>
                  </div>
                </div>

                <div className={`p-2 rounded-xl border transition-all ${isExpanded ? 'bg-slate-800 border-slate-700 text-white shadow-lg' : 'border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500'}`}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="bg-slate-50/50 p-8 pt-2">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-4">Bitola Comercial</th>
                          <th className="px-8 py-4">Comprimento</th>
                          <th className="px-8 py-4 text-center">Tipo</th>
                          <th className="px-8 py-4 text-right">Massa (Kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {layer.slots.map((slot, sIdx) => (
                          <tr key={sIdx} className="hover:bg-blue-50/30 transition-colors group/row">
                            <td className="px-8 py-5">
                              <span className="text-xs font-black text-slate-800">{slot.beams[0].bitola}</span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{slot.isPaired ? '6M + 6M' : slot.beams[0].length + 'M'}</span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${slot.isPaired ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {slot.isPaired ? 'Duo' : 'Solo'}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className="text-[10px] font-black text-slate-700">{(slot.weight * 1000).toFixed(0)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {techSpacing > 1 && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                        <Info size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-tighter leading-relaxed">
                          Espaçamento de Estabilidade: Aplicar folga técnica de {techSpacing.toFixed(1)}cm nesta camada para nivelamento da pirâmide superior.
                        </span>
                      </div>
                    )}
                    
                    {layer.heightDiff > 0 && (
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                        <AlertCircle size={16} className="text-amber-600" />
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">
                          Madeiramento de Nível: Utilizar calço adicional de {layer.heightDiff.toFixed(1)}cm nos feixes menores desta camada.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
