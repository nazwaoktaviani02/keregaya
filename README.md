KEREGAYA - Reality Check Sebelum Checkout

Jujur aja — pernah checkout sesuatu terus 5 menit kemudian nyesel? Iya, Keregaya buat kaum yang sering kena situasi kayak gitu. Ini bukan aplikasi budgeting yang boring, tapi lebih ke temen yang berani bilang "eh yakin?" pas kamu mau checkout barang yang sebenernya cuma FOMO doang.

Masukin income, pengeluaran wajib, sama target nabung. Terus tiap kali mau beli sesuatu, tanya Keregaya dulu. Dia bakal hitung angkanya, terus kasih tau — kadang halus, kadang nggak — apakah ini keputusan yang masuk akal, atau cuma nafsu sesaat yang bakal disesali pas tanggal tua.

## Kenapa ini dibuat
Karena banyak dari kita (termasuk yang bikin app ini) beli barang bukan karena butuh, tapi karena pengen. Ditambah paylater yang bikin belanja kerasa gratis padahal enggak — itu tagihan cuma ditunda, bukan dihapus. Keregaya nggak nge-judge gaya hidup siapa pun, tapi dia jujur soal apa yang bakal kejadian ke dompet kalau lanjut checkout.

## Yang bisa dilakuin
- **Input profil keuangan** — income, pengeluaran wajib, target nabung, sekali doang, nggak ribet
- **Scoring engine** — ngitung berapa persen harga barang itu dari budget bebas bulan ini, plus penalti tambahan kalau:
  - Bayar pake paylater/kredit
  - Udah beli kategori yang sama berkali-kali bulan ini
  - Ini "pengen" doang, bukan "butuh"
- **Hasil traffic light** — 🟢 aman / 🟡 mikir dulu / 🔴 jangan — plus kalimat yang kadang jleb, kadang santuy, tapi selalu jujur
- **History log** — biar keliatan sendiri pola belanjanya, siapa tau kaget

## Dibangun pake apa

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Next.js API routes (serverless, nggak pake server terpisah)
- **Database**: Supabase (PostgreSQL) + Row Level Security biar data user aman
- **Hosting**: Vercel
