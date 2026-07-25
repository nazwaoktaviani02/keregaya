'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ensureAnonymousSession } from '@/lib/supabase'

export default function OnboardingPage() {
  const router = useRouter()
  const [income, setIncome] = useState('')
  const [fixedExpenses, setFixedExpenses] = useState('')
  const [savingGoal, setSavingGoal] = useState('')
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

    const { error: insertError } = await supabase
      .from('income_profiles')
      .upsert({
        user_id: session.user.id,
        monthly_income: parseFloat(income),
        fixed_expenses: parseFloat(fixedExpenses),
        saving_goal: parseFloat(savingGoal),
      }, { onConflict: 'user_id'})

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Setup Profil Keuangan</h1>
        <p className="text-neutral-400 mb-6">
          Biar Keregaya bisa kasih reality check yang akurat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Income Bulanan</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="5000000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Pengeluaran Wajib (cicilan, kos, dll)</label>
            <input
              type="number"
              value={fixedExpenses}
              onChange={(e) => setFixedExpenses(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="2000000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Target Nabung</label>
            <input
              type="number"
              value={savingGoal}
              onChange={(e) => setSavingGoal(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="1000000"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Lanjut'}
          </button>
        </form>
      </div>
    </div>
  )
}