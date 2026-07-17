import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AeroTurbineSpare',
  description:
    'AeroTurbineSpare privacy policy. How we collect, use, and protect your personal data for gas turbine parts procurement. GDPR compliant. Data controller: AeroTurbineSpare, Inc., Doral, FL.',
  openGraph: {
    title: 'Privacy Policy | AeroTurbineSpare',
    description:
      'AeroTurbineSpare privacy policy for gas turbine parts procurement platform.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
