import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'iGaming Affiliate Network - Premium iGaming Offers',
  description: 'Join the leading iGaming affiliate network. Access exclusive casino, sports betting, poker, and esports offers with top payouts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
