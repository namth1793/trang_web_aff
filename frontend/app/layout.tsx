import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopee Affiliate Link Converter - Tạo link tiếp thị liên kết',
  description: 'Chuyển đổi link Shopee thành link affiliate để kiếm hoa hồng. Nhanh chóng, miễn phí.',
  keywords: 'shopee affiliate, link tiếp thị liên kết, shopee commission, convert link shopee',
  openGraph: {
    title: 'Shopee Affiliate Link Converter',
    description: 'Chuyển đổi link Shopee thành link affiliate',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
