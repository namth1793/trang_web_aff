import Converter from '@/components/Converter';
import { ShoppingBag, TrendingUp, Link2, Zap, Copy, MousePointerClick, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">ShopeeAff</span>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            Admin
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          <Zap size={14} />
          Tạo link affiliate Shopee miễn phí
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Shopee{' '}
          <span className="text-gradient">Affiliate</span>{' '}
          Link Converter
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Dán link sản phẩm Shopee vào bên dưới để tạo link tiếp thị liên kết và kiếm hoa hồng khi có người mua hàng qua link của bạn.
        </p>
      </section>

      {/* Main Converter */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <Converter />
      </section>

      {/* Hướng dẫn */}
      <section className="max-w-2xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-bold">?</span>
            Hướng dẫn nhận mã Shopee
          </h2>
          <ol className="space-y-5">
            {[
              {
                step: 1,
                icon: <Copy size={18} className="text-orange-500" />,
                title: 'Sau khi tạo link, nhấn Copy Link',
                desc: 'Dán link sản phẩm Shopee vào ô bên trên, nhấn "Tạo link affiliate", sau đó nhấn nút Copy Link để sao chép.',
                tip: null
              },
              {
                step: 2,
                icon: <MousePointerClick size={18} className="text-orange-500" />,
                title: 'Dán link dưới bình luận bài đăng này',
                desc: 'Vào bài đăng trên Facebook bên dưới, bình luận và dán link vừa copy vào phần bình luận của bài.',
                tip: null
              },
              {
                step: 3,
                icon: <Link2 size={18} className="text-orange-500" />,
                title: 'Click vào link để mở Shopee & nhận mã',
                desc: 'Nhấn vào link trong bình luận để mở Shopee. Bạn sẽ nhận được mã giảm giá từ chương trình Affiliate Shopee.',
                tip: '💡 Mã sẽ xuất hiện trong ứng dụng Shopee sau khi bạn mở link.'
              }
            ].map(({ step, icon, title, desc, tip }) => (
              <li key={step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                    {icon}
                    {title}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  {tip && (
                    <p className="mt-2 text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-block">
                      {tip}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* Link bài đăng Facebook */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <a
              href="https://web.facebook.com/share/g/1AR7igk8Ni/?mibextid=wwXIfr&_rdc=1&_rdr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl px-5 py-4 transition-all"
            >
              <div className="shrink-0 w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-800">Xem bài đăng để bình luận</p>
                <p className="text-xs text-blue-500 mt-0.5">Nhấn vào đây → Bình luận link của bạn</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="text-blue-400 group-hover:translate-x-1 transition-transform shrink-0">
                <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Nhóm Facebook */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <a
          href="https://web.facebook.com/share/g/1AR7igk8Ni/?mibextid=wwXIfr&_rdc=1&_rdr"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-3xl p-6 shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5"
        >
          <div className="shrink-0 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Users size={15} className="text-blue-200" />
              <span className="text-blue-200 text-xs font-medium uppercase tracking-wide">Nhóm Facebook</span>
            </div>
            <p className="text-white font-bold text-lg leading-tight">
              Tham gia nhóm gom order China giá rẻ
            </p>
            <p className="text-blue-200 text-sm mt-0.5">
              Hàng China chất lượng, giá tốt nhất — cập nhật deal mỗi ngày
            </p>
          </div>
          <div className="shrink-0 w-9 h-9 bg-white/20 group-hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
            </svg>
          </div>
        </a>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Link2 className="text-orange-500" size={24} />,
              title: 'Rút gọn link',
              desc: 'Tự động rút gọn link affiliate thành link ngắn dễ chia sẻ'
            },
            {
              icon: <TrendingUp className="text-orange-500" size={24} />,
              title: 'Theo dõi clicks',
              desc: 'Xem thống kê số lượt click trên từng link đã tạo'
            },
            {
              icon: <Zap className="text-orange-500" size={24} />,
              title: 'Tức thì & Miễn phí',
              desc: 'Chuyển đổi link ngay lập tức, không cần đăng ký tài khoản'
            }
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>© 2024 ShopeeAff · Công cụ tạo link tiếp thị liên kết Shopee</p>
          <p className="mt-1">Không thuộc về Shopee. Shopee là thương hiệu của Sea Limited.</p>
        </div>
      </footer>
    </div>
  );
}
