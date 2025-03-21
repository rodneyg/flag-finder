import './globals.css';

export const metadata = {
  title: 'FlagFinder',
  description: 'Predict relationship compatibility and find red flags.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}