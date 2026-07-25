'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-3">Keregaya</h1>
        <p className="text-neutral-400 text-lg mb-10">
          Reality check sebelum checkout.
        </p>

        <p className="text-neutral-300 mb-10 leading-relaxed">
          Mau checkout sesuatu? Jangan buru-buru. Kasih tau dulu barangnya apa,
          Keregaya bakal jujur — kadang halus, kadang nggak — soal apakah ini
          keputusan yang masuk akal atau cuma gaya-gayaan doang.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/check')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 transition"
          >
            Cek Barang yang Mau Dibeli
          </button>
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg px-6 py-3 transition"
          >
            Setup / Update Profil Keuangan
          </button>
          <button
            onClick={() => router.push('/history')}
            className="w-full text-neutral-400 hover:text-neutral-200 font-medium px-6 py-2 transition"
          >
            Lihat Riwayat
          </button>
        </div>
      </div>
    </div>
  )
}