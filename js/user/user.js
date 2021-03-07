import { client } from '../client.js';
import { ui } from './ui.js';

const API_URL = 'http://192.168.1.67:5000/api/questions';

const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');

(async () => {
  const data = await client.get(API_URL);

  if (data) {
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
      ui.showNextQuestion(questions);
    }
  } catch (error) {
    console.log(error);
  }
}

function goPrevQuestion(questions) {
  try {
    if (questions) {
      ui.showPrevQuestion(questions);
    }
  } catch (error) {
    console.log(error);
  }
}
