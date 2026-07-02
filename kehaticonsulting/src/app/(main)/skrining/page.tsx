'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dass21Questions, dassOptions } from '@/lib/mockData';

export default function SkriningPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = intro, 1-21 = questions, 22 = submitting
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const totalQ = dass21Questions.length;
  const currentQ = step > 0 && step <= totalQ ? dass21Questions[step - 1] : null;
  const progress = step > 0 ? ((step - 1) / totalQ) * 100 : 0;
  const allAnswered = Object.keys(answers).length === totalQ;

  const handleAnswer = (nomor: number, skor: number) => {
    setAnswers(prev => ({ ...prev, [nomor]: skor }));
  };

  const handleNext = () => {
    if (step <= totalQ) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    // Simpan jawaban ke sessionStorage agar halaman hasil bisa menghitungnya
    sessionStorage.setItem('skrining_answers', JSON.stringify(answers));
    setSubmitting(false);
    router.push('/skrining/hasil');
  };

  // Intro Screen
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <div className="bg-white rounded-2xl border border-[#dbdfe6] shadow-sm overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[#135bec] to-[#0e45b5]"></div>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#ebf1fd] text-[#135bec] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">psychology</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111318]">Skrining Kesehatan Mental</h1>
                <p className="text-[#616f89] text-sm">Instrumen DASS-21 — Depression Anxiety Stress Scales</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-[#111318] text-sm leading-relaxed">
                Skrining ini menggunakan instrumen <strong>DASS-21</strong> yang terdiri dari <strong>21 pertanyaan</strong> untuk mengukur kondisi psikologis Anda dalam 1 minggu terakhir.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: 'timer', label: '±10 menit', sub: 'Estimasi waktu' },
                  { icon: 'quiz', label: '21 Pertanyaan', sub: 'Skala 0–3' },
                  { icon: 'lock', label: 'Rahasia', sub: 'Data Anda aman' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center p-4 bg-[#f6f6f8] rounded-xl text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#135bec] mb-2">{item.icon}</span>
                    <p className="font-bold text-[#111318] text-sm">{item.label}</p>
                    <p className="text-xs text-[#616f89]">{item.sub}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-[#135bec]/20 rounded-xl text-sm text-[#111318]">
                <p className="font-semibold text-[#135bec] mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  Petunjuk Pengisian
                </p>
                <p className="text-[#616f89] leading-relaxed">
                  Bacalah setiap pernyataan dan pilih jawaban yang paling sesuai dengan kondisi Anda <strong>selama satu minggu terakhir</strong>. Tidak ada jawaban benar atau salah. Jawablah dengan jujur.
                </p>
              </div>
            </div>

            <button onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
              <span>Mulai Skrining</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <p className="text-center text-xs text-[#616f89] mt-4">
              Hasil skrining bersifat rahasia dan hanya dapat diakses oleh Anda dan konselor yang bertugas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  if (currentQ && step <= totalQ) {
    const currentAnswer = answers[currentQ.nomor];
    const isAnswered = currentAnswer !== undefined;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-[#111318]">Pertanyaan {step} dari {totalQ}</span>
            <span className="text-[#616f89]">{Math.round(progress)}% selesai</span>
          </div>
          <div className="w-full h-2.5 bg-[#dbdfe6] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#135bec] to-[#0e45b5] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            currentQ.kategori === 'depression' ? 'bg-purple-100 text-purple-700' :
            currentQ.kategori === 'anxiety' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {currentQ.kategori === 'depression' ? 'Depresi' : currentQ.kategori === 'anxiety' ? 'Kecemasan' : 'Stres'}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-[#dbdfe6] shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-[#111318] mb-8 leading-relaxed">{currentQ.text}</h2>

          <div className="flex flex-col gap-3">
            {dassOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(currentQ.nomor, opt.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                  currentAnswer === opt.value
                    ? 'border-[#135bec] bg-[#ebf1fd] text-[#135bec]'
                    : 'border-[#dbdfe6] bg-white text-[#111318] hover:border-[#135bec]/50 hover:bg-[#f6f6f8]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  currentAnswer === opt.value
                    ? 'border-[#135bec] bg-[#135bec] text-white'
                    : 'border-[#dbdfe6] text-[#616f89]'
                }`}>
                  {opt.value}
                </div>
                <span className="font-semibold">{opt.label}</span>
                {currentAnswer === opt.value && (
                  <span className="ml-auto material-symbols-outlined text-[#135bec] text-[20px]">check_circle</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button onClick={handlePrev}
            className="flex items-center gap-2 px-5 py-3 border border-[#dbdfe6] text-[#616f89] hover:border-[#135bec] hover:text-[#135bec] rounded-xl text-sm font-semibold transition-all">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Sebelumnya
          </button>
          <div className="flex-1"></div>
          {step < totalQ ? (
            <button onClick={handleNext} disabled={!isAnswered}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                isAnswered
                  ? 'bg-[#135bec] text-white hover:bg-[#0e45b5] shadow-sm shadow-blue-500/20 hover:shadow-md active:scale-[0.98]'
                  : 'bg-[#dbdfe6] text-[#616f89] cursor-not-allowed'
              }`}>
              Selanjutnya
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!allAnswered || submitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                allAnswered && !submitting
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm active:scale-[0.98]'
                  : 'bg-[#dbdfe6] text-[#616f89] cursor-not-allowed'
              }`}>
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Memproses...</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">send</span> Kirim Skrining</>
              )}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 mt-6 justify-center">
          {dass21Questions.map(q => (
            <button key={q.nomor} onClick={() => setStep(q.nomor)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                q.nomor === step ? 'bg-[#135bec] text-white scale-110' :
                answers[q.nomor] !== undefined ? 'bg-[#ebf1fd] text-[#135bec] border border-[#135bec]/30' :
                'bg-[#f6f6f8] text-[#616f89]'
              }`}>
              {q.nomor}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
