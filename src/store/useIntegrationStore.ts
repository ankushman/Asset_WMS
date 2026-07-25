import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IntegrationConnector {
  id: string;
  systemName: string; // SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365, Salesforce CRM, Power BI
  category: 'ERP' | 'CRM' | 'BI' | 'LOGISTICS' | 'MAPS';
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  apiEndpoint: string;
  syncFrequency: string;
  lastSyncAt: string;
}

interface IntegrationState {
  connectors: IntegrationConnector[];
  toggleStatus: (id: string) => void;
}

const INITIAL_CONNECTORS: IntegrationConnector[] = [
  { id: 'conn-1', systemName: 'SAP S/4HANA Enterprise ERP', category: 'ERP', status: 'CONNECTED', apiEndpoint: 'https://sap-api.ennea-sangkaj.com/v1/so-grn', syncFrequency: 'Real-Time Webhook', lastSyncAt: '2 mins ago' },
  { id: 'conn-2', systemName: 'Oracle ERP Cloud Financials', category: 'ERP', status: 'CONNECTED', apiEndpoint: 'https://oracle-cloud.ennea-sangkaj.com/api/ledger', syncFrequency: '15 mins', lastSyncAt: '8 mins ago' },
  { id: 'conn-3', systemName: 'Microsoft Dynamics 365 Supply Chain', category: 'ERP', status: 'CONNECTED', apiEndpoint: 'https://dynamics365.ennea-sangkaj.com/api/wms', syncFrequency: 'Hourly Batch', lastSyncAt: '22 mins ago' },
  { id: 'conn-4', systemName: 'Salesforce Enterprise CRM', category: 'CRM', status: 'CONNECTED', apiEndpoint: 'https://salesforce.ennea-sangkaj.com/services/data/v58.0', syncFrequency: 'Real-Time', lastSyncAt: 'Just now' },
  { id: 'conn-5', systemName: 'Microsoft Power BI Embedded', category: 'BI', status: 'CONNECTED', apiEndpoint: 'https://api.powerbi.com/v1.0/myorg/reports', syncFrequency: 'Live Dataset', lastSyncAt: 'Just now' },
];

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set) => ({
      connectors: INITIAL_CONNECTORS,
      toggleStatus: (id) =>
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id ? { ...c, status: c.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED', lastSyncAt: 'Just now' } : c
          ),
        })),
    }),
    { name: 'ennea-integration-storage' }
  )
);
