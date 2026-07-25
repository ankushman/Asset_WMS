import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IotDevice {
  id: string;
  deviceCode: string;
  deviceType: 'RFID' | 'FORKLIFT_SENSOR' | 'GPS' | 'TEMP_HUMIDITY' | 'BATTERY' | 'DOCK_WEIGHT';
  warehouseName: string;
  batteryLevel: number;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  lastPing: string;
  telemetryData: string;
}

interface IotState {
  devices: IotDevice[];
  addDevice: (device: Omit<IotDevice, 'id' | 'lastPing'>) => void;
}

const INITIAL_DEVICES: IotDevice[] = [
  { id: 'iot-1', deviceCode: 'RFID-GATE-A1', deviceType: 'RFID', warehouseName: 'Mumbai Central Hub', batteryLevel: 98, status: 'ONLINE', lastPing: 'Just now', telemetryData: '142 Tags read / sec' },
  { id: 'iot-2', deviceCode: 'FRK-TELE-01', deviceType: 'FORKLIFT_SENSOR', warehouseName: 'Mumbai Central Hub', batteryLevel: 85, status: 'ONLINE', lastPing: '1 min ago', telemetryData: 'Speed: 4.2 km/h | Load: 1.8 Tons' },
  { id: 'iot-3', deviceCode: 'TEMP-COLD-ZONE', deviceType: 'TEMP_HUMIDITY', warehouseName: 'Delhi Logistics Park', batteryLevel: 92, status: 'ONLINE', lastPing: 'Just now', telemetryData: 'Temp: 4.2°C | Humidity: 62%' },
  { id: 'iot-4', deviceCode: 'GPS-TRK-9941', deviceType: 'GPS', warehouseName: 'Mumbai Central Hub', batteryLevel: 74, status: 'ONLINE', lastPing: 'Just now', telemetryData: 'Lat: 18.9220, Long: 72.8347 | Speed: 62 km/h' },
];

export const useIotStore = create<IotState>()(
  persist(
    (set) => ({
      devices: INITIAL_DEVICES,
      addDevice: (device) => set((state) => ({ devices: [{ ...device, id: `iot-${Date.now()}`, lastPing: 'Just now' }, ...state.devices] })),
    }),
    { name: 'ennea-iot-storage' }
  )
);
