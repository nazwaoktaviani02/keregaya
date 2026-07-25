'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ensureAnonymousSession } from '@/lib/supabase'
import { calculateScore } from '@/lib/scoring'

const categories = [
  { id: 1, name: 'fashion' },
  { id: 2, name: 'gadget' },
  { id: 3, name: 'hobi' },
  { id: 4, name: 'makanan' },
  { id: 5, name: 'lainnya' },
]

export default function CheckPage() {
  const router = useRouter()
  const [itemName, setItemName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('1')
  const [needOrWant, setNeedOrWant] = useState<'need' | 'want'>('need')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paylater'>('cash')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    const session = await ensureAnonymousSession()
    if (!session) {
      setError('Gagal membuat sesi. Coba lagi.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('income_profiles')
      .select('disposable_income')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (profileError || !profile) {
      setError('Profil keuangan belum ada. Isi dulu di /onboarding.')
      setLoading(false)
      return
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('category_id', parseInt(categoryId))
      .gte('created_at', startOfMonth.toISOString())

    const { data: purchaseRequest, error: insertError } = await supabase
      .from('purchase_requests')
      .insert({
        user_id: session.user.id,
        item_name: itemName,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        need_or_want: needOrWant,
        payment_method: paymentMethod,
      })
      .select()
      .single()

    if (insertError || !purchaseRequest) {
      setError(insertError?.message || 'Gagal menyimpan.')
      setLoading(false)
      return
    }

    const result = calculateScore({
      price: parseFloat(price),
      disposableIncome: profile.disposable_income,
      needOrWant,
      paymentMethod,
      categoryCountThisMonth: count || 0,
    })

    const { error: scoringError } = await supabase
      .from('scoring_results')
      .insert({
        purchase_request_id: purchaseRequest.id,
        base_score: result.baseScore,
        penalty_paylater: result.penaltyPaylater,
        penalty_frequency: result.penaltyFrequency,
        penalty_want: result.penaltyWant,
        final_level: result.finalLevel,
        advice_text: result.adviceText,
      })

    if (scoringError) {
      setError(scoringError.message)
      setLoading(false)
      return
    }

    router.push(`/result/${purchaseRequest.id}`)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Mau Beli Apa?</h1>
        <p className="text-neutral-400 mb-6">Jujur aja, kita cek dulu.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama Barang</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Sepatu baru"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Butuh atau Pengen?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNeedOrWant('need')}
                className={`flex-1 rounded-lg px-4 py-2 border ${needOrWant === 'need' ? 'bg-orange-500 border-orange-500' : 'bg-neutral-800 border-neutral-700'}`}
              >
                Butuh
              </button>
              <button
                type="button"
                onClick={() => setNeedOrWant('want')}
                className={`flex-1 rounded-lg px-4 py-2 border ${needOrWant === 'want' ? 'bg-orange-500 border-orange-500' : 'bg-neutral-800 border-neutral-700'}`}
              >
                Pengen
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Metode Bayar</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex-1 rounded-lg px-4 py-2 border ${paymentMethod === 'cash' ? 'bg-orange-500 border-orange-500' : 'bg-neutral-800 border-neutral-700'}`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paylater')}
                className={`flex-1 rounded-lg px-4 py-2 border ${paymentMethod === 'paylater' ? 'bg-orange-500 border-orange-500' : 'bg-neutral-800 border-neutral-700'}`}
              >
                Paylater
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50"
          >
            {loading ? 'Mengecek...' : 'Cek Sekarang'}
          </button>
        </form>
      </div>
    </div>
  )
}