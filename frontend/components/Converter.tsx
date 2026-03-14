'use client';

import { useState, useRef } from 'react';
import ResultCard from './ResultCard';
import { Link2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface ConvertResult {
  id: number;
  originalUrl: string;
  affiliateUrl: string;
  shortCode: string;
  shortLink: string;
  clicks: number;
  cached?: boolean;
}

export default function Converter() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ConvertResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Vui lòng nhập link Shopee.');
      inputRef.current?.focus();
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/links/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConvert();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError('');
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mt-4">
      {/* Converter Box */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Link2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Chuyển đổi link</h2>
            <p className="text-xs text-gray-500">Chỉ hỗ trợ link từ shopee.vn</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Dán link Shopee vào đây... (vd: https://shopee.vn/...)"
            className={`w-full px-4 py-4 pr-24 rounded-2xl border-2 text-gray-800 placeholder-gray-400 text-sm outline-none transition-all
              ${error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white'}
            `}
          />
          <button
            onClick={handlePaste}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500 font-medium hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Dán link
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all text-sm
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-[0.98]'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              Tạo link affiliate
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Example */}
        {!result && !loading && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Ví dụ: https://shopee.vn/Tên-sản-phẩm-i.12345678.987654321
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
