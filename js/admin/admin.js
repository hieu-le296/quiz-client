import { client } from '../client.js';
import { ui } from './ui.js';

const API_URL = 'http://localhost:5000/api/admin/questions';

class Questions {
  constructor() {
    client
      .get(`${API_URL}`)
      .then((data) => ui.showAllQuestions(data.questions))
      .catch((err) => console.log(err));
  }
}

class App {
  constructor() {
    new Questions();
    this.questionId = document.querySelector('#id');
    this.modal = document.querySelector('#myModal');
    this.addBtn = document.querySelector('#addBtn');
    this.submitBtn = document.querySelector('#submit');
    // Get the <span> element that closes the modal
    this.span = document.getElementsByClassName('close')[0];
  }

  loadEvents() {
    // When user clicks, open the modal
    this.addBtn.addEventListener('click', () => this.openModal());
    // When the user clicks on <span> (x), close the modal
    this.span.addEventListener('click', () => this.closeModal());
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (e) => this.closeModalByIcon(e));

    this.submitBtn.addEventListener('click', () => this.addQuestion());
  }

  openModal() {
    this.modal = document.querySelector('#myModal');

    this.modal.style.display = 'block';
    this.addBtn.style.zIndex = -1;
  }

  closeModal() {
    this.modal.style.display = 'none';
    this.addBtn.style.zIndex = 4;
  }

  closeModalByIcon(e) {
    if (e.target == this.modal) {
      this.closeModal();
    }
  }

  addQuestion() {
    console.log(this.addBtn);
  }
}

const app = new App();
app.loadEvents();
