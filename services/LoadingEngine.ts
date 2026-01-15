
import { 
  Beam, 
  LoadItem, 
  Config, 
  CalculationResult, 
  ProcessedSlot, 
  Layer 
} from '../types';
import { BEAM_CATALOG } from '../constants';

export class LoadingEngine {
  private static MAX_SHIM_HEIGHT = 10; 

  static calculate(items: LoadItem[], config: Config): CalculationResult {
    if (items.length === 0) {
      return { layers: [], totalWeight: 0, totalHeight: 0, maxWidthUsed: 0, errors: [], warnings: [], engineeringNotes: [] };
    }

    const engineeringNotes: string[] = ["Iniciando processamento de física de carga v7.0"];
    const warnings: string[] = [];
    const errors: string[] = [];
    const gap = config.fixedGap || 0;

    // 1. POOL GLOBAL: A ordem de seleção é TOTALMENTE ignorada.
    let pool = this.flattenItemsToSlots(items);
    
    // 2. TENTATIVA 1: PRIORIDADE LIFO (Base P10 -> Topo P1)
    // Ordenamos apenas por Prioridade para ver se a geometria natural funciona
    pool.sort((a, b) => b.priority - a.priority);

    let layers = this.buildLayers(pool, config, gap);

    // 3. VALIDAÇÃO DE PIRÂMIDE E AJUSTE DE ESPAÇAMENTO
    // Percorremos de baixo para cima garantindo que a camada superior nunca seja maior que a inferior
    let priorityViolated = false;
    
    for (let i = 1; i < layers.length; i++) {
      const currentLayer = layers[i];
      const baseLayer = layers[i-1];

      if (currentLayer.totalWidth > baseLayer.totalWidth) {
        const diff = currentLayer.totalWidth - baseLayer.totalWidth;
        
        // Tentativa de "Espaçamento Técnico" na base para evitar violar a prioridade
        if (baseLayer.totalWidth + diff <= config.maxWidth) {
          baseLayer.totalWidth += diff;
          engineeringNotes.push(`Nível ${baseLayer.index + 1}: Aplicado espaçamento técnico de ${diff.toFixed(1)}cm para sustentar camada superior.`);
        } else {
          // Se não cabe espaçamento, precisamos violar a prioridade para salvar a carga
          priorityViolated = true;
          break;
        }
      }
    }

    // 4. SE A PRIORIDADE FOI VIOLADA: REORDENAMENTO ESTRUTURAL (POR LARGURA)
    if (priorityViolated) {
      warnings.push("⚠️ PRIORIDADE VIOLADA: A ordem de entrega (LIFO) foi alterada automaticamente para garantir a ESTABILIDADE e SEGURANÇA. Itens largos foram movidos para a base.");
      engineeringNotes.push("Decisão de Segurança: Geometria de pirâmide não comportou LIFO. Reordenado por largura decrescente.");
      
      // Novo sorteio: Largura decrescente (Soberania Geométrica)
      pool.sort((a, b) => {
        if (b.width !== a.width) return b.width - a.width;
        return b.priority - a.priority; // Desempate por prioridade
      });
      
      layers = this.buildLayers(pool, config, gap);
      
      // Após reordenar por largura, a pirâmide é natural, mas aplicamos novo check de micro-ajustes se necessário
      for (let i = 1; i < layers.length; i++) {
        if (layers[i].totalWidth > layers[i-1].totalWidth) {
          const diff = layers[i].totalWidth - layers[i-1].totalWidth;
          layers[i-1].totalWidth += diff;
        }
      }
    }

    // 5. CONSOLIDAÇÃO FINAL
    let totalWeight = 0;
    let totalHeight = 0;
    let maxWidthUsed = 0;

    layers.forEach((layer) => {
      totalWeight += layer.slots.reduce((s, slot) => s + slot.weight, 0);
      totalHeight += layer.maxHeight + config.woodHeight;
      if (layer.totalWidth > maxWidthUsed) maxWidthUsed = layer.totalWidth;
    });

    return {
      layers,
      totalWeight,
      totalHeight,
      maxWidthUsed,
      errors,
      warnings,
      engineeringNotes
    };
  }

  private static buildLayers(pool: ProcessedSlot[], config: Config, gap: number): Layer[] {
    let layers: Layer[] = [];
    let remainingPool = [...pool];

    while (remainingPool.length > 0) {
      let currentLayerSlots: ProcessedSlot[] = [];
      let currentWidth = 0;
      let i = 0;

      while (i < remainingPool.length) {
        const slot = remainingPool[i];
        const slotWidthWithGap = currentLayerSlots.length === 0 ? slot.width : slot.width + gap;

        const fitsWidth = (currentWidth + slotWidthWithGap) <= config.maxWidth;
        
        let fitsHeight = true;
        if (currentLayerSlots.length > 0) {
          const maxHeight = Math.max(...currentLayerSlots.map(s => s.height), slot.height);
          const minHeight = Math.min(...currentLayerSlots.map(s => s.height), slot.height);
          if (maxHeight - minHeight > this.MAX_SHIM_HEIGHT) fitsHeight = false;
        }

        if (fitsWidth && fitsHeight) {
          currentLayerSlots.push(slot);
          currentWidth += slotWidthWithGap;
          remainingPool.splice(i, 1);
        } else {
          i++;
        }
      }

      if (currentLayerSlots.length > 0) {
        layers.push(this.createLayer(layers.length, currentLayerSlots));
      } else {
        const item = remainingPool.shift()!;
        layers.push(this.createLayer(layers.length, [item]));
      }
    }

    return layers;
  }

  private static flattenItemsToSlots(items: LoadItem[]): ProcessedSlot[] {
    const slots: ProcessedSlot[] = [];
    
    items.filter(i => i.length === 12).forEach(item => {
      const beam = BEAM_CATALOG.find(b => b.id === item.beamId)!;
      for (let i = 0; i < item.quantity; i++) {
        slots.push({
          width: beam.width,
          height: beam.height,
          weight: beam.weight12m,
          priority: item.priority,
          isPaired: false,
          beams: [{ bitola: beam.bitola, length: 12, weight: beam.weight12m }]
        });
      }
    });

    const items6m = items.filter(i => i.length === 6);
    const grouped6m: Record<string, LoadItem[]> = {};
    items6m.forEach(item => {
      const key = `${item.priority}_${item.beamId}`;
      if (!grouped6m[key]) grouped6m[key] = [];
      grouped6m[key].push(item);
    });

    for (const key in grouped6m) {
      const group = grouped6m[key];
      const beam = BEAM_CATALOG.find(b => b.id === group[0].beamId)!;
      let totalQty = group.reduce((sum, item) => sum + item.quantity, 0);

      while (totalQty >= 2) {
        slots.push({
          width: beam.width,
          height: beam.height,
          weight: beam.weight12m,
          priority: group[0].priority,
          isPaired: true,
          beams: [
            { bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 },
            { bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 }
          ]
        });
        totalQty -= 2;
      }

      if (totalQty === 1) {
        slots.push({
          width: beam.width,
          height: beam.height,
          weight: beam.weight12m / 2,
          priority: group[0].priority,
          isPaired: false,
          beams: [{ bitola: beam.bitola, length: 6, weight: beam.weight12m / 2 }]
        });
      }
    }

    return slots;
  }

  private static createLayer(index: number, slots: ProcessedSlot[]): Layer {
    const totalWidth = slots.reduce((acc, s) => acc + s.width, 0);
    const heights = slots.map(s => s.height);
    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);

    return {
      index,
      slots,
      totalWidth,
      maxHeight,
      minHeight,
      heightDiff: maxHeight - minHeight,
      priority: slots.length > 0 ? Math.min(...slots.map(s => s.priority)) : 1
    };
  }
}
