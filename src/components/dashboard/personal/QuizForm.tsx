'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Question = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
};

type Props = {
  quizId: string;
};

export default function QuizForm({ quizId }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        await axios.post(`/quiz-attempt/start/${quizId}`); // otomatis buat attempt
        const res = await axios.get(`/question/${quizId}`);
        setQuestions(res.data);
      } catch (err) {
        console.error('Gagal ambil kuis:', err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/quiz-attempt/start/${quizId}`);
      const quizAttemptId = res.data.id;
      setAttemptId(quizAttemptId);

      const formattedAnswers = Object.entries(answers).map(([question_id, option_id]) => ({
        question_id,
        option_id,
      }));

      await axios.post(`/quiz-attempt/submit/${quizAttemptId}`, {
        answers: formattedAnswers,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Gagal mengirim jawaban:', err);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Terima kasih!</h2>
        <p>Jawaban Anda telah dikirim. Silakan lihat hasilnya di bagian hasil kuis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Kuis Ergonomi</h2>
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.text}</p>
          <div className="space-y-1">
            {q.options.map((opt) => (
              <label key={opt.id} className="block">
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={answers[q.id] === opt.id}
                  onChange={() => handleChange(q.id, opt.id)}
                  className="mr-2"
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={handleSubmit}>Kirim Jawaban</Button>
    </div>
  );
}
