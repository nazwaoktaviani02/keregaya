'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ResultData {
  item_name: string
  price: number
  final_level: 'green' | 'yellow' | 'red'
  advice_text: string
  base_score: number
  penalty_paylater: boolean
  penalty_frequency: boolean
  penalty_want: boolean
}

const levelStyles = {
  green: {
    bg: 'bg-emerald-900/30',
    border: 'border-emerald-700',
    text: 'text-emerald-400',
    label: 'AMAN',
  },
  yellow: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-700',
    text: 'text-amber-400',
    label: 'PIKIR DULU',
  },
  red: {
    bg: 'bg-red-900/30',
    border: 'border-red-700',
    text: 'text-red-400',
    label: 'JANGAN',
  },
}

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchResult() {
      const { data, error } = await supabase
        .from('scoring_results')
        .select(`
          base_score,
          penalty_paylater,
          penalty_frequency,
          penalty_want,
          final_level,
          advice_text,
          purchase_requests (
            item_name,
            price
          )
        `)
        .eq('purchase_request_id', params.id)
        .single()

      if (error || !data) {
        setError('Hasil tidak ditemukan.')
        setLoading(false)
        return
      }

      const purchaseRequest = Array.isArray(data.purchase_requests)
        ? data.purchase_requests[0]
        : data.purchase_requests

      setResult({
        item_name: purchaseRequest.item_name,
        price: purchaseRequest.price,
        final_level: data.final_level,
        advice_text: data.advice_text,
        base_score: data.base_score,
        penalty_paylater: data.penalty_paylater,
        penalty_frequency: data.penalty_frequency,
        penalty_want: data.penalty_want,
      })
      setLoading(false)
    }

    fetchResult()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
        <p className="text-neutral-400">Menghitung...</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  const style = levelStyles[result.final_level]

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className={`rounded-2xl border ${style.bg} ${style.border} p-6 mb-6`}>
          <span className={`text-xs font-bold tracking-wider ${style.text}`}>
            {style.label}
          </span>
          <h1 className="text-xl font-bold mt-2 mb-1">{result.item_name}</h1>
          <p className="text-neutral-400 text-sm mb-4">
            Rp {result.price.toLocaleString('id-ID')}
          </p>
          <p className="text-lg leading-relaxed">{result.advice_text}</p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-4 text-sm text-neutral-400 space-y-1 mb-6">
          <p>Ini {result.base_score}% dari budget bebas kamu bulan ini.</p>
          {result.penalty_paylater && <p>⚠️ Pakai paylater — nambah beban bulan depan.</p>}
          {result.penalty_frequency && <p>⚠️ Kamu udah beli kategori ini beberapa kali bulan ini.</p>}
          {result.penalty_want && <p>⚠️ Ini "pengen", bukan "butuh".</p>}
        </div>

        <button
          onClick={() => router.push('/check')}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg px-4 py-2 transition"
        >
          Cek Barang Lain
        </button>
      </div>
    </div>
  )
}