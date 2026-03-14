'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart2, Link2, MousePointerClick, Calendar,
  Trash2, ExternalLink, RefreshCw, LogOut, ChevronLeft, ChevronRight,
  Settings, Save, Check
} from 'lucide-react';

interface Link {
  id: number;
  original_url: string;
  affiliate_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

interface Stats {
  totalLinks: number;
  totalClicks: number;
  todayClicks: number;
  todayLinks: number;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Settings
  const [affiliateId, setAffiliateId] = useState('');
  const [smtt, setSmtt] = useState('0.0.9');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const headers = { 'Content-Type': 'application/json', 'x-admin-token': token };

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/stats`, { headers });
    if (res.ok) setStats(await res.json());
  }, [token]);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/links?page=${page}&limit=15`, { headers });
    if (res.ok) {
      const data = await res.json();
      setLinks(data.links);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, token]);

  const fetchSettings = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/settings`, { headers });
    if (res.ok) {
      const data = await res.json();
      setAffiliateId(data.shopee_affiliate_id || '');
      setSmtt(data.shopee_smtt || '0.0.9');
    }
  }, [token]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const res = await fetch(`${API_URL}/api/admin/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ shopee_affiliate_id: affiliateId, shopee_smtt: smtt })
    });
    setSavingSettings(false);
    if (res.ok) {
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 2000);
    }
  };

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchLinks(); }, [fetchLinks]);
  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa link này?')) return;
    setDeleteId(id);
    const res = await fetch(`${API_URL}/api/admin/links/${id}`, {
      method: 'DELETE',
      headers
    });
    if (res.ok) {
      fetchLinks();
      fetchStats();
    }
    setDeleteId(null);
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/admin/logout`, { method: 'POST', headers });
    onLogout();
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">ShopeeAff</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchStats(); fetchLinks(); }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Tổng links', value: stats.totalLinks, icon: <Link2 size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
              { label: 'Tổng clicks', value: stats.totalClicks, icon: <MousePointerClick size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
              { label: 'Links hôm nay', value: stats.todayLinks, icon: <Calendar size={20} className="text-green-500" />, bg: 'bg-green-50' },
              { label: 'Clicks hôm nay', value: stats.todayClicks, icon: <BarChart2 size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Affiliate Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
              <Settings size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Cài đặt Shopee Affiliate</h2>
              <p className="text-xs text-gray-500">Đăng ký tại affiliate.shopee.vn → lấy Affiliate ID (af_id)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Shopee Affiliate ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={affiliateId}
                onChange={e => setAffiliateId(e.target.value)}
                placeholder="Ví dụ: 12345678"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white outline-none text-sm transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Lấy tại: affiliate.shopee.vn → Dashboard → Công cụ → af_id
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SMTT Parameter
              </label>
              <input
                type="text"
                value={smtt}
                onChange={e => setSmtt(e.target.value)}
                placeholder="0.0.9"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white outline-none text-sm transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Mặc định: 0.0.9 (không cần thay đổi)
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings || !affiliateId}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${savedSettings
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                }
              `}
            >
              {savedSettings ? (
                <><Check size={15} /> Đã lưu!</>
              ) : savingSettings ? (
                <><RefreshCw size={15} className="animate-spin" /> Đang lưu...</>
              ) : (
                <><Save size={15} /> Lưu cài đặt</>
              )}
            </button>
            {affiliateId && (
              <span className="text-xs text-gray-400">
                Link sẽ có dạng: shopee.vn/...?smtt={smtt}&af_id={affiliateId}
              </span>
            )}
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Danh sách links ({total})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Link rút gọn</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Link gốc</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                      Đang tải...
                    </td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Chưa có link nào
                    </td>
                  </tr>
                ) : links.map(link => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-orange-600 font-medium">
                          /r/{link.short_code}
                        </span>
                        <a
                          href={`${BASE_URL}/r/${link.short_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-xs max-w-xs block truncate" title={link.original_url}>
                        {link.original_url}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">
                        <MousePointerClick size={11} />
                        {link.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(link.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={deleteId === link.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
