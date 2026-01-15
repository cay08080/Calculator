
export interface Beam {
  id: string;
  bitola: string;
  height: number; // in cm
  width: number;  // in cm
  weight12m: number; // weight for a 12m beam in Tons
}

export interface LoadItem {
  id: string;
  beamId: string;
  bitola: string;
  length: 6 | 12;
  priority: number; // 1 is highest priority (top of load)
  quantity: number;
}

export interface ProcessedSlot {
  width: number;
  height: number;
  weight: number; // in Tons
  priority: number;
  beams: {
    bitola: string;
    length: number;
    weight: number;
  }[];
  isPaired: boolean;
}

export interface Layer {
  index: number;
  slots: ProcessedSlot[];
  totalWidth: number;
  maxHeight: number;
  minHeight: number;
  heightDiff: number;
  priority: number;
}

export interface CalculationResult {
  layers: Layer[];
  totalWeight: number; // in Tons
  totalHeight: number; // in cm
  maxWidthUsed: number; // in cm
  errors: string[];
  warnings: string[];
  engineeringNotes: string[];
}

export enum VehicleType {
  CARRETA = 'CARRETA',
  VAGAO_VALE = 'VAGAO_VALE',
  VAGAO_MRS = 'VAGAO_MRS'
}

export interface Config {
  vehicleType: VehicleType;
  maxWidth: number;
  woodHeight: number; // Calço height in cm
  fixedGap: number | null;
}
