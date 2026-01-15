
import React, { useState } from 'react';
import { BEAM_CATALOG } from '../constants';
import { LoadItem } from '../types';
import { PlusCircle, Info, ChevronRight } from 'lucide-react';

interface Props {
  onAdd: (item: LoadItem) => void;
}

export const BeamSelector: React.FC<Props> = ({ onAdd }) => {
  const [selectedBeamId, setSelectedBeamId] = useState(BEAM_CATALOG[0].id);
  const [length, setLength] = useState<6 | 12>(12);
  const [priority, setPriority] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  };

  const handleAdd = () => {
    const beam = BEAM_CATALOG.find(b => b.id === selectedBeamId);
    if (!beam) return;

    onAdd({
      id: generateId(),
      beamId: selectedBeamId,
      bitola: beam.bitola,
      length,
      priority: priority || 1,
      quantity: quantity || 1
    });

    setQuantity(1);
  };

  const handleNumericInput = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setter(0);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) setter(num);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
        <PlusCircle size={18} className="text-blue-600" /> 
        Gestão de Itens
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Catálogo Master Gerdau</label>
          <select 
            value={selectedBeamId}
            onChange={(e) => setSelectedBeamId(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer shadow-sm"
          >
            {BEAM_CATALOG.map(beam => (
              <option key={beam.id} value={beam.id}>
                {beam.bitola} — {beam.width}x{beam.height}cm
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Longitude</label>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setLength(6)}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${length === 6 ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                6m
              </button>
              <button 
                onClick={() => setLength(12)}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${length === 12 ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                12m
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Quantidade</label>
            <input 
              type="number" 
              min="1" 
              value={quantity === 0 ? '' : quantity}
              onFocus={handleFocus}
              onChange={handleNumericInput(setQuantity)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
              placeholder="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest flex items-center justify-between">
            Prioridade de Entrega
            <span className="text-[8px] font-bold text-blue-400">P1 Topo | P10 Base</span>
          </label>
          <input 
            type="number" 
            min="1" 
            max="10"
            value={priority === 0 ? '' : priority}
            onFocus={handleFocus}
            onChange={handleNumericInput(setPriority)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
            placeholder="1"
          />
        </div>

        <button 
          onClick={handleAdd}
          className="w-full py-5 bg-[#0033a0] hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[20px] shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
        >
          Incluir no Plano de Carga
          <ChevronRight size={16} />
        </button>

        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-900/60 font-semibold leading-relaxed">
            Feixes de 6m são emparelhados automaticamente para conformidade técnica longitudinal de 12m.
          </p>
        </div>
      </div>
    </div>
  );
};
