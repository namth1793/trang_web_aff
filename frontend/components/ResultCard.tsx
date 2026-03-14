'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy, Check, ExternalLink, QrCode, Link2,
  MousePointerClick, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';

interface ResultCardProps {
  result: {
    id: number;
    originalUrl: string;
    affiliateUrl: string;
    shortCode: string;
    shortLink: string;
    clicks: number;
    cached?: boolean;
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${copiedField === field
          ? 'bg-green-100 text-green-600 border border-green-200'
          : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
        }
      `}
    >
      {copiedField === field ? (
        <><Check size={15} /> Đã copy</>
      ) : (
        <><Copy size={15} /> {label}</>
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Check size={20} className="bg-white/20 rounded-full p-0.5" />
            <span className="font-semibold">Tạo link thành công!</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <MousePointerClick size={14} />
            <span>{result.clicks} lượt click</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Short Link */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Link rút gọn (chia sẻ link này)
          </label>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
            <Link2 size={16} className="text-orange-500 shrink-0" />
            <span className="text-orange-700 font-semibold text-sm flex-1 truncate">
              {result.shortLink}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <CopyButton text={result.shortLink} field="short" label="Copy" />
              <a
                href={result.shortLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Affiliate Link */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Link Affiliate đầy đủ
          </label>
          <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            <span className="text-gray-600 text-sm flex-1 break-all leading-relaxed">
              {result.affiliateUrl}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
              <CopyButton text={result.affiliateUrl} field="affiliate" label="Copy" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
              ${showQR ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
            `}
          >
            <QrCode size={16} />
            {showQR ? 'Ẩn QR' : 'Tạo QR Code'}
          </button>

          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            {showOriginal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Link gốc
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="flex flex-col items-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
            <QRCodeSVG
              value={result.shortLink}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
              level="H"
              includeMargin
            />
            <p className="text-xs text-gray-500 mt-3">Quét mã QR để mở link</p>
            <button
              onClick={async () => {
                // Convert SVG QR to PNG and download
                const svg = document.querySelector('.qr-svg') as SVGElement;
                if (!svg) return;
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d')!;
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, 0, 0);
                  const link = document.createElement('a');
                  link.download = `qr-${result.shortCode}.png`;
                  link.href = canvas.toDataURL();
                  link.click();
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
              }}
              className="mt-2 text-xs text-orange-500 hover:text-orange-600 underline"
            >
              Tải QR Code
            </button>
          </div>
        )}

        {/* Original URL */}
        {showOriginal && (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500 mb-1 font-medium">Link gốc</p>
            <p className="text-gray-600 text-xs break-all">{result.originalUrl}</p>
          </div>
        )}

        {result.cached && (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
            <RefreshCw size={12} />
            Link này đã được tạo trước đó. Đang hiển thị kết quả đã lưu.
          </div>
        )}
      </div>
    </div>
  );
}
