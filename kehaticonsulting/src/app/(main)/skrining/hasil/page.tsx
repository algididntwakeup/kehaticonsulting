'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { dass21Questions } from '@/lib/mockData';

// ─── DASS-21 Scoring Thresholds ─────────────────────────────────────────────
// Skala DASS-21: skor dikalikan 2 lalu dibandingkan dengan threshold standar
// Depression: Normal 0-9, Mild 10-13, Moderate 14-20, Severe 21-27, Extremely Severe 28+
// Anxiety:    Normal 0-7, Mild 8-9, Moderate 10-14, Severe 15-19, Extremely Severe 20+
// Stress:     Normal 0-14, Mild 15-18, Moderate 19-25, Severe 26-33, Extremely Severe 34+

function classifyDass(rawScore: number, type: 'depression' | 'anxiety' | 'stress') {
  const score = rawScore * 2; // DASS-21 dikali 2 untuk mendapat skor setara DASS-42
  if (type === 'depression') {
    if (score <= 9)  return { level: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    if (score <= 13) return { level: 'Ringan', color: 'text-lime-700', bg: 'bg-lime-100' };
    if (score <= 20) return { level: 'Sedang', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    if (score <= 27) return { level: 'Parah', color: 'text-orange-700', bg: 'bg-orange-100' };
    return { level: 'Sangat Parah', color: 'text-red-700', bg: 'bg-red-100' };
  }
  if (type === 'anxiety') {
    if (score <= 7)  return { level: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    if (score <= 9)  return { level: 'Ringan', color: 'text-lime-700', bg: 'bg-lime-100' };
    if (score <= 14) return { level: 'Sedang', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    if (score <= 19) return { level: 'Parah', color: 'text-orange-700', bg: 'bg-orange-100' };
    return { level: 'Sangat Parah', color: 'text-red-700', bg: 'bg-red-100' };
  }
  // stress
  if (score <= 14) return { level: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
  if (score <= 18) return { level: 'Ringan', color: 'text-lime-700', bg: 'bg-lime-100' };
  if (score <= 25) return { level: 'Sedang', color: 'text-yellow-700', bg: 'bg-yellow-100' };
  if (score <= 33) return { level: 'Parah', color: 'text-orange-700', bg: 'bg-orange-100' };
  return { level: 'Sangat Parah', color: 'text-red-700', bg: 'bg-red-100' };
}

function getOverallRisiko(depressionRaw: number, anxietyRaw: number, stressRaw: number): 'rendah' | 'sedang' | 'tinggi' {
  const depScore = depressionRaw * 2;
  const anxScore = anxietyRaw * 2;
  const strScore = stressRaw * 2;

  const isTinggi = depScore >= 21 || anxScore >= 15 || strScore >= 26;
  const isSedang = depScore >= 14 || anxScore >= 10 || strScore >= 19;

  if (isTinggi) return 'tinggi';
  if (isSedang) return 'sedang';
  return 'rendah';
}

export default function HasilSkriningPage() {
  const [scores, setScores] = useState<{
    depression: number; anxiety: number; stress: number; total: number;
  } | null>(null);
  const [level, setLevel] = useState<'rendah' | 'sedang' | 'tinggi'>('rendah');
  const [fromSession, setFromSession] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('skrining_answers');
    if (!raw) return;

    const answers: Record<number, number> = JSON.parse(raw);

    let depression = 0, anxiety = 0, stress = 0;
    dass21Questions.forEach(q => {
      const skor = answers[q.nomor] ?? 0;
      if (q.kategori === 'depression') depression += skor;
      else if (q.kategori === 'anxiety') anxiety += skor;
      else if (q.kategori === 'stress') stress += skor;
    });

    const total = depression + anxiety + stress;
    setScores({ depression, anxiety, stress, total });
    setLevel(getOverallRisiko(depression, anxiety, stress));
    setFromSession(true);
  }, []);

  const risikoConfig = {
    rendah: {
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badgeBg: 'bg-green-100 text-green-800',
      iconBg: 'bg-green-100 text-green-700',
      icon: 'sentiment_very_satisfied',
      gradient: 'from-green-500 to-emerald-600',
      label: 'RENDAH',
      title: 'Kondisi Anda Baik!',
      desc: 'Hasil skrining menunjukkan kondisi psikologis Anda dalam kategori sehat. Tetap pertahankan kebiasaan positif dan jaga kesehatan mental Anda.',
      action: 'Booking Konseling Lanjutan',
      actionHref: '/booking',
      actionIcon: 'calendar_month',
      actionColor: 'bg-green-600 hover:bg-green-700',
      recommendations: [
        'Pertahankan pola tidur yang teratur (7–9 jam per malam)',
        'Rutin berolahraga minimal 30 menit per hari',
        'Jaga keseimbangan antara kerja dan istirahat',
        'Tetap terhubung dengan keluarga dan rekan dekat',
      ],
    },
    sedang: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badgeBg: 'bg-yellow-100 text-yellow-800',
      iconBg: 'bg-yellow-100 text-yellow-700',
      icon: 'sentiment_neutral',
      gradient: 'from-yellow-500 to-orange-500',
      label: 'SEDANG',
      title: 'Perlu Perhatian',
      desc: 'Hasil skrining menunjukkan kondisi psikologis Anda memerlukan perhatian. Disarankan untuk segera melakukan sesi konseling dengan psikolog kami.',
      action: 'Booking Konseling Sekarang',
      actionHref: '/booking',
      actionIcon: 'calendar_month',
      actionColor: 'bg-[#135bec] hover:bg-[#0e45b5]',
      recommendations: [
        'Segera lakukan booking sesi konseling dengan psikolog',
        'Ceritakan perasaan Anda kepada orang yang dipercaya',
        'Hindari beban kerja yang berlebihan untuk sementara',
        'Praktikkan teknik relaksasi dan mindfulness setiap hari',
      ],
    },
    tinggi: {
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-100 text-red-800',
      iconBg: 'bg-red-100 text-red-700',
      icon: 'sentiment_very_dissatisfied',
      gradient: 'from-red-500 to-rose-600',
      label: 'TINGGI',
      title: 'Perlu Penanganan Segera',
      desc: 'Hasil skrining menunjukkan kondisi psikologis Anda memerlukan perhatian serius. Tim psikolog kami akan segera menghubungi Anda. Jangan hadapi ini sendiri.',
      action: null,
      actionHref: null,
      actionIcon: null,
      actionColor: null,
      recommendations: [
        'Tim konselor KEHATI akan segera menghubungi Anda dalam 1×24 jam',
        'Jangan ragu untuk menghubungi hotline SDM sekarang',
        'Ceritakan kondisi Anda kepada seseorang yang paling Anda percaya',
        'Hindari mengambil keputusan besar dalam kondisi ini',
      ],
    },
  };

  const config = risikoConfig[level];

  // Jika belum ada data dari sessionStorage, tampilkan total skor berdasarkan mock
  const totalSkor = scores?.total ?? 14;
  const maxSkor = 63; // 21 pertanyaan × skor max 3

  const subScores = scores ? [
    { label: 'Depresi', raw: scores.depression, type: 'depression' as const, maxRaw: 21, icon: 'mood_bad', color: 'bg-purple-500' },
    { label: 'Kecemasan', raw: scores.anxiety, type: 'anxiety' as const, maxRaw: 21, icon: 'psychology_alt', color: 'bg-orange-500' },
    { label: 'Stres', raw: scores.stress, type: 'stress' as const, maxRaw: 21, icon: 'warning', color: 'bg-blue-500' },
  ] : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Result Card */}
      <div className={`bg-white rounded-2xl border ${config.border} shadow-sm overflow-hidden`}>
        {/* Top gradient bar */}
        <div className={`h-2 bg-gradient-to-r ${config.gradient}`}></div>

        <div className="p-8">
          {/* Icon + Label */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.iconBg}`}>
              <span className="material-symbols-outlined text-[36px]">{config.icon}</span>
            </div>
            <div>
              <p className="text-sm text-[#616f89] font-medium">Tingkat Risiko</p>
              <span className={`inline-block text-lg font-black px-3 py-0.5 rounded-lg ${config.badgeBg}`}>
                {config.label}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#111318] mb-2">{config.title}</h1>
          <p className="text-[#616f89] text-sm leading-relaxed mb-8">{config.desc}</p>

          {/* Score display */}
          <div className={`flex items-center gap-6 p-5 rounded-xl ${config.bg} border ${config.border} mb-6`}>
            <div className="text-center shrink-0">
              <p className="text-4xl font-black text-[#111318]">{totalSkor}</p>
              <p className="text-xs text-[#616f89] mt-1">dari {maxSkor}</p>
              <p className="text-xs text-[#616f89]">Total Skor</p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner mb-2">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000`}
                  style={{ width: `${Math.min((totalSkor / maxSkor) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-[#616f89]">
                <span>Rendah</span>
                <span>Sedang</span>
                <span>Tinggi</span>
              </div>
            </div>
          </div>

          {/* Sub-score breakdown — only if computed from real answers */}
          {fromSession && subScores.length > 0 && (
            <div className="mb-8 bg-[#f6f6f8] rounded-xl p-5">
              <h2 className="text-sm font-bold text-[#111318] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#135bec]">bar_chart</span>
                Rincian Per Dimensi
              </h2>
              <div className="flex flex-col gap-4">
                {subScores.map(sub => {
                  const classification = classifyDass(sub.raw, sub.type);
                  const pct = Math.round((sub.raw / sub.maxRaw) * 100);
                  return (
                    <div key={sub.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-[#111318]">{sub.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#616f89]">{sub.raw} / {sub.maxRaw}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${classification.bg} ${classification.color}`}>
                            {classification.level}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full ${sub.color} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-[#f6f6f8] rounded-xl mb-8">
            <span className="material-symbols-outlined text-[20px] text-yellow-600">pending</span>
            <div>
              <p className="text-sm font-bold text-[#111318]">Status Validasi: Menunggu</p>
              <p className="text-xs text-[#616f89]">Konselor akan meninjau hasil Anda dalam 1×24 jam</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-[#111318] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#135bec]">lightbulb</span>
              Rekomendasi Tindak Lanjut
            </h2>
            <div className="flex flex-col gap-3">
              {config.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ebf1fd] text-[#135bec] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-[#616f89]">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* High risk: emergency contact */}
          {level === 'tinggi' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                Kontak Darurat
              </p>
              <div className="flex flex-col gap-1.5 text-sm text-red-600">
                <p>📞 Hotline Psikologi SDM: <strong>(022) 7202-1000 ext. 5679</strong></p>
                <p>📧 Email: <strong>darurat@poldajabar.go.id</strong></p>
                <p>🚨 Anda juga dapat langsung menghadap ke Biro SDM Lt.3</p>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            {config.action && config.actionHref && (
              <Link href={config.actionHref}>
                <button className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold shadow-md transition-all active:scale-[0.98] ${config.actionColor}`}>
                  <span className="material-symbols-outlined text-[20px]">{config.actionIcon}</span>
                  {config.action}
                </button>
              </Link>
            )}
            <Link href="/dashboard">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#dbdfe6] text-[#616f89] font-semibold hover:bg-[#f6f6f8] hover:text-[#111318] transition-all text-sm">
                <span className="material-symbols-outlined text-[18px]">home</span>
                Kembali ke Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="mt-5 p-4 bg-white rounded-xl border border-[#dbdfe6] flex items-start gap-3">
        <span className="material-symbols-outlined text-[20px] text-[#135bec] mt-0.5 shrink-0">info</span>
        <p className="text-xs text-[#616f89] leading-relaxed">
          Hasil skrining ini bersifat <strong>rahasia</strong> dan hanya dapat diakses oleh Anda dan konselor yang ditunjuk. Data ini tidak akan dibagikan tanpa seizin Anda.
        </p>
      </div>
    </div>
  );
}
