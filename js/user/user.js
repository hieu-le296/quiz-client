import { client } from '../client.js';
import { ui } from './ui.js';

// Virtual Server to test API
const API_URL = 'http://localhost:5000/api/questions';

const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

const answers = [];

(async () => {
  const data = await client.get(`${API_URL}`);

  if (data) {
    // Set the number of answers based on the length of the questions
    answers.length = data.questions.length;

    ui.showQuestion(data.questions);

    nextBtn.addEventListener('click', () => goNextQuestion(data.questions));

    prevBtn.addEventListener('click', () => goPrevQuestion(data.questions));
  } else {
    console.log('Something went wrong');
  }
})();

function goNextQuestion(questions) {
  try {
    if (questions) {
      let currentQuestion = ui.getCurrentQuestionIndex();
      let answer;

      // Check if previous selected
      if (ui.checkSelected()) {
        answer = ui.getSelected();
        answers[currentQuestion] = answer;
      } else {
        answer = answers[currentQuestion];
      }

      if (!isNaN(answer)) {
        ui.showNextQuestion(questions);
        currentQuestion = ui.getCurrentQuestionIndex();
        answer = answers[currentQuestion];
        ui.selectAnswer(answer);
      } else {
        answers[currentQuestion] = -1;
        ui.showNextQuestion(questions);
      }
    }
  } catch (error) {
    console.log(error);
  }

  const submitBtn = document.querySelector('#submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => submitQuiz(questions));
  }
}

function goPrevQuestion(questions) {
  try {
    if (questions) {
      let currentQuestion = ui.getCurrentQuestionIndex();
      let answer;
      // Check if previous selected
      if (ui.checkSelected()) {
        answer = ui.getSelected();
        answers[currentQuestion] = answer;
      } else {
        answer = answers[currentQuestion];
      }

      if (!isNaN(answer)) {
        ui.showPrevQuestion(questions);
        currentQuestion = ui.getCurrentQuestionIndex();
        answer = answers[currentQuestion];
        ui.selectAnswer(answer);
      } else {
        answers[currentQuestion] = -1;
        ui.showPrevQuestion(questions);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function submitQuiz(questions) {
  let answer = ui.getSelected();
  let currentQuestion = ui.getCurrentQuestionIndex();
  answers[currentQuestion] = answer;

  if (isNaN(answer)) {
    answers[currentQuestion] = -1;
  }
  const answerObj = { answers };

  // Check the answer with server
  const results = await client.post(`${API_URL}`, answerObj);

  const message = results.message;

  const answerString = results.correctAnswer;

  const correctAnswers = answerString.split(',').map(Number);

  ui.showScore(message);

  ui.showAllQuestions(questions, answers, correctAnswers);
  ui.showAnswers(answers, correctAnswers);
}
