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

    this.numberOfOptions = 2;
  }

  loadEvents() {
    // When user clicks, open the modal
    this.addBtn.addEventListener('click', () => this.openModal());
    // When the user clicks on <span> (x), close the modal
    this.span.addEventListener('click', () => this.closeModal());
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (e) => this.closeModalByIcon(e));

    this.submitBtn.addEventListener('click', () => this.addQuestion());

    // Delete a question by icon
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.deleteQuestionByIcon(e));
  }

  openModal() {
    this.modal = document.querySelector('#myModal');
    this.modal.style.display = 'block';
    this.addBtn.style.zIndex = -1;
    ui.showModal();

    const addOptionBtn = document.querySelector('#add-option');
    if (addOptionBtn) {
      addOptionBtn.addEventListener('click', () => this.addOptions());
    }
  }

  closeModal() {
    this.modal.style.display = 'none';
    ui.clearModal();
    this.addBtn.style.zIndex = 4;
  }

  closeModalByIcon(e) {
    if (e.target == this.modal) {
      this.closeModal();
      ui.clearModal();
    }
  }

  addOptions() {
    this.numberOfOptions++;
    ui.addOption(this.numberOfOptions);
  }

  async addQuestion() {
    const title = document.querySelector('#title').value;

    const optionNodes = document.querySelectorAll('.options');

    const options = [];

    optionNodes.forEach((node) => {
      options.push(node.value);
    });

    const optionNumber = document.querySelector('input[name="answer"]:checked')
      .value;

    const question = { title, options, optionNumber };

    try {
      const addQuestion = await client.post(`${API_URL}`, question);

      if (addQuestion.success) {
        this.closeModal();
        ui.showAlert(addQuestion.message, 'mt-3 alert alert-success');
        new Questions();
      } else {
        ui.showModalAlert(addQuestion.message, 'mt-3 alert alert-danger');
      }
    } catch (error) {
      ui.showModalAlert(
        'Could not connect to server!',
        'mt-3 alert alert-danger'
      );
    }
  }

  async deleteQuestionByIcon(e) {
    e.preventDefault();
    if (e.target.parentElement.classList.contains('delete')) {
      // Get the id of the question
      const id = parseInt(e.target.parentElement.dataset.id);
      if (confirm('Are you sure')) {
        try {
          const result = await client.delete(`${API_URL}/${id}`);
          if (result.success) {
            ui.showAlert(result.message, 'alert alert-success');
            new Questions();
          }
        } catch (error) {
          ui.showAlert('Could not connect to server', 'alert alert-danger');
        }
      }
    }
  }
}

const app = new App();
app.loadEvents();
