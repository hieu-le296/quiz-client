import { client } from '../client.js';
import { ui } from './ui.js';

// Virtual Server to test API
const API_URL = 'https://quizisfun.tk/api/questions';

const quiz = document.getElementById('quiz');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const loading = document.getElementById('loading');


const answers = [];



loading.style.display = 'block';
quiz.style.display = 'none';

const app = async () => {
  try {
    const data = await client.get(`${API_URL}`);

    loading.style.display = 'none';
    ui.quiz.style.display = 'block';
    
    if (data) {
      // Set the number of answers based on the length of the questions
      answers.length = data.questions.length;

      ui.showQuestion(data.questions);

      nextBtn.addEventListener('click', () => goNextQuestion(data.questions));

      prevBtn.addEventListener('click', () => goPrevQuestion(data.questions));
    } else {
      console.log('Something went wrong');
    }
  } catch (error) {
    ui.showMessage('Could not connect to server', 'text-danger');
    loading.style.display = 'block';
  }
};

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

        // Get the previous selection
        currentQuestion = ui.getCurrentQuestionIndex();
        answer = answers[currentQuestion];
        ui.selectAnswer(answer);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function submitQuiz(questions) {
  if (confirm('Are you sure you want to submit the quiz?')) {
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

    loading.style.display = 'block';
    quiz.style.display = 'none';

    setTimeout(() => {
      ui.showMessage(message, 'text-info');

      ui.showAllQuestions(questions, answers, correctAnswers);
      ui.showAnswers(answers, correctAnswers);

      loading.style.display = 'none';
    }, 2000)

   
  }
}

setTimeout(() => {
 app();
}, 2000)