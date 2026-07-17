import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Excess Turbine Parts Inventory | AeroTurbineSpare',
  description:
    'Sell your surplus gas turbine spare parts to AeroTurbineSpare. GE, Siemens, Rolls-Royce, Solar Turbines components. Fast evaluation, competitive pricing, worldwide logistics. ISO 9001 & AS9120 certified buyer.',
  keywords: [
    'sell turbine parts', 'excess turbine inventory',
    'surplus aerospace parts buyer', 'sell GE turbine parts',
    'sell Siemens components', 'turbine parts liquidation',
  ],
  openGraph: {
    title: 'Sell Excess Turbine Parts | AeroTurbineSpare',
    description:
      'Sell surplus gas turbine spare parts. Fast evaluation and competitive pricing.',
  },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
