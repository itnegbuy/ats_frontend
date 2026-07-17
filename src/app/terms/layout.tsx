import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | AeroTurbineSpare',
  description:
    'AeroTurbineSpare terms and conditions for gas turbine spare parts procurement, RFQ submissions, and platform use. Texas law governs. Export control compliance.',
  openGraph: {
    title: 'Terms & Conditions | AeroTurbineSpare',
    description:
      'AeroTurbineSpare terms and conditions for gas turbine parts procurement platform.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
