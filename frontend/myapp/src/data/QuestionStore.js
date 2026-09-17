// questionStore.js - Shared legal question data layer
// Used by Askquestion.js to save submissions and Adminpage.js to review them.

const STORE_KEY = "law4u_questions";

function persist(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

export function getQuestions() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addQuestion(question) {
  const list = getQuestions();
  const nextId = list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1;
  const newQuestion = {
    id: nextId,
    read: false,
    status: "open",
    createdAt: new Date().toISOString(),
    ...question,
  };
  persist([newQuestion, ...list]);
  return newQuestion;
}

export function markQuestionAsRead(id) {
  persist(getQuestions().map((question) => (
    question.id === id ? { ...question, read: true } : question
  )));
}

export function deleteQuestion(id) {
  persist(getQuestions().filter((question) => question.id !== id));
}
