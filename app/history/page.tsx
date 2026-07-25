'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ensureAnonymousSession } from '@/lib/supabase'

interface HistoryItem {
  id: string
  item_name: string
  price: number
  created_at: string
  final_level: 'green' | 'yellow' | 'red'
  advice_text: string
}

const levelDot = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
}

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      const session = await ensureAnonymousSession()
      if (!session) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('purchase_requests')
        .select(`
          id,
          item_name,
          price,
          created_at,
          scoring_results (
            final_level,
            advice_text
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error || !data) {
        setLoading(false)
        return
      }

      const formatted: HistoryItem[] = data.map((row: any) => {
        const scoring = Array.isArray(row.scoring_results)
          ? row.scoring_results[0]
          : row.scoring_results

        return {
          id: row.id,
          item_name: row.item_name,
          price: row.price,
          created_at: row.created_at,
          final_level: scoring?.final_level ?? 'green',
          advice_text: scoring?.advice_text ?? '',
        }
      })

      setItems(formatted)
      setLoading(false)
    }

    fetchHistory()
  }, [])

  const greenCount = items.filter((i) => i.final_level === 'green').length
  const yellowCount = items.filter((i) => i.final_level === 'yellow').length
  const redCount = items.filter((i) => i.final_level === 'red').length

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-4 py-10">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-1">Riwayat</h1>
        <p className="text-neutral-400 mb-6">Ini pola belanja kamu sejauh ini.</p>

        {!loading && items.length > 0 && (
          <div className="flex gap-2 mb-6">
            <div className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-center">
              <p className="text-emerald-400 font-bold">{greenCount}</p>
              <p className="text-xs text-neutral-400">Aman</p>
            </div>
            <div className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-center">
              <p className="text-amber-400 font-bold">{yellowCount}</p>
              <p className="text-xs text-neutral-400">Mikir Dulu</p>
            </div>
            <div className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-center">
              <p className="text-red-400 font-bold">{redCount}</p>
              <p className="text-xs text-neutral-400">Jangan</p>
            </div>
          </div>
        )}

        {loading && <p className="text-neutral-400">Memuat...</p>}

        {!loading && items.length === 0 && (
          <p className="text-neutral-400">
            Belum ada riwayat. Yuk cek barang pertama kamu.
          </p>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/result/${item.id}`)}
              className="w-full text-left bg-neutral-800 hover:bg-neutral-700 rounded-xl px-4 py-3 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{item.item_name}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${levelDot[item.final_level]}`} />
              </div>
              <p className="text-sm text-neutral-400 mb-1">
                Rp {item.price.toLocaleString('id-ID')} ·{' '}
                {new Date(item.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
              <p className="text-sm text-neutral-300 line-clamp-1">{item.advice_text}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/check')}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition"
        >
          Cek Barang Lain
        </button>
      </div>
    </div>
  )
}