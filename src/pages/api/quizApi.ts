import axios from 'axios';
const BASE_URL = 'https://ergocheck.site';

export const getAllQuizzes = async (token: string) => {
  return axios.get(`${BASE_URL}/quiz/get-quiz`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createQuiz = async (token: string, data: any) => {
  return axios.post(`${BASE_URL}/quiz/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateQuiz = async (token: string, quizId: string, data: any) => {
  return axios.put(`${BASE_URL}/quiz/${quizId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteQuiz = async (token: string, quizId: string) => {
  return axios.delete(`${BASE_URL}/quiz/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
