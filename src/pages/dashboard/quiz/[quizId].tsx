'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Layout from '@/components/layout/Layout';
import ProgressBar from '@/components/dashboard/shared/ProgressBar';
import QuestionCard from '@/components/quiz/QuestionCard';
import Button from '@/components/buttons/Button';
import TextButton from '@/components/buttons/TextButton';

const questions = [
  {
    question: 'Bagaimana posisi duduk Anda saat bekerja?',
    image: '/images/quiz/sitting.png',
    options: [
      { label: 'Tegak dan nyaman', value: 'a' },
      { label: 'Membungkuk', value: 'b' },
    ],
  },
  {
    question: 'Seberapa sering Anda melakukan peregangan?',
    image: '/images/quiz/stretching.png',
    options: [
      { label: 'Setiap 1 jam', value: 'a' },
      { label: 'Jarang atau tidak pernah', value: 'b' },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Submit atau redirect
      router.push('/dashboard/quiz/result');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <Layout>
      <div className='min-h-screen p-6 md:p-10 bg-white'>
        <div className='max-w-2xl mx-auto space-y-6'>
          <ProgressBar total={questions.length} completed={step} />

          <QuestionCard
            question={questions[step].question}
            image={questions[step].image}
            options={questions[step].options}
            selectedAnswer={answers[step] || null}
            onSelect={handleSelect}
          />

          <div className='flex justify-between pt-4'>
            <TextButton
              disabled={step === 0}
              onClick={handleBack}
            >
              Kembali
            </TextButton>

            <Button
              onClick={handleNext}
              disabled={!answers[step]}
            >
              {step === questions.length - 1 ? 'Selesai' : 'Lanjut'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
