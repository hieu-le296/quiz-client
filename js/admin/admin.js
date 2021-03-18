import { client } from '../client.js';
import { ui } from './ui.js';

const API_URL = 'http://localhost:5000/api/admin/questions';

class Questions {
  constructor() {
    client
      .get(`${API_URL}`)
      .then((data) => ui.showAllQuestions(data.questions))
      .catch((err) =>
        ui.showAlert('Could not connect to server', 'alert alert-danger')
      );
  }
}

class App {
  constructor() {
    new Questions();
    this.questionId = document.querySelector('#id');
    this.modal = document.querySelector('#myModal');
    this.addBtn = document.querySelector('#addBtn');
    this.createBtn = document.querySelector('#create');
    this.updateBtn = document.querySelector('#update');
    // Get the <span> element that closes the modal
    this.span = document.getElementsByClassName('close')[0];

    this.numberOfOptions = 2;

    this.numberOfOptionsOnUpdate = 0;
  }

  loadEvents() {
    // When user clicks, open the modal
    this.addBtn.addEventListener('click', () => this.openModal());
    // When the user clicks on <span> (x), close the modal
    this.span.addEventListener('click', () => this.closeModal());
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (e) => this.closeModalByIcon(e));

    // Edit a question by icon
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.showEditQuestion(e));

    // Delete a question by icon
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.deleteQuestionByIcon(e));

    this.createBtn.addEventListener('click', () => this.addQuestion());

    this.updateBtn.addEventListener('click', () => this.updateQuestion());
  }

  openModal() {
    this.modal.style.display = 'block';
    this.addBtn.style.zIndex = -1;
    ui.showModal();

    document
      .querySelector('.input-group')
      .addEventListener('click', (e) => this.handleEventOnModal(e, 'add'));
  }

  closeModal() {
    this.modal.style.display = 'none';
    ui.clearModal();
    this.numberOfOptions = 2;
    this.numberOfOptionsOnUpdate = 0;

    this.addBtn.style.zIndex = 4;

    new Questions();
  }

  closeModalByIcon(e) {
    if (e.target == this.modal) {
      this.closeModal();
      ui.clearModal();
    }
  }

  handleEventOnModal(e, type) {
    if (e.target.parentElement.classList.contains('add-option')) {
      this.addOptions(type);
    }

    if (e.target.parentElement.classList.contains('delete')) {
      this.removeOptions(e, type);
    }

    e.stopPropagation();
  }

  addOptions(type) {
    if (type === 'add') {
      this.numberOfOptions++;
      ui.addOption(this.numberOfOptions);
    } else if (type === 'edit') {
      this.numberOfOptionsOnUpdate++;
      ui.addOption(this.numberOfOptionsOnUpdate);
    }
  }

  async removeOptions(e, type) {
    if (type === 'add') {
      ui.removeOption(e.target.parentElement.parentElement);
      this.numberOfOptions--;
    } else if (type === 'edit') {
      if (confirm('Are you sure you want to delete this option?')) {
        this.numberOfOptionsOnUpdate--;

        const optionTextArea = e.target.parentElement.previousElementSibling;
        const optionID = optionTextArea.id;
        try {
          const result = await client.delete(`${API_URL}/options/${optionID}`);

          ui.showModalAlert(result.message, 'alert alert-success');
          ui.removeOption(e.target.parentElement.parentElement);
        } catch (error) {
          ui.showModalAlert(
            'Could not connect to server',
            'alert alert-danger'
          );
        }
      }
    }
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

  async showEditQuestion(e) {
    e.preventDefault();

    if (e.target.parentElement.classList.contains('edit')) {
      const id = parseInt(e.target.parentElement.dataset.id);
      const data = await client.get(`${API_URL}/${id}`);

      this.modal.style.display = 'block';
      this.addBtn.style.zIndex = -1;

      ui.showUpdateModal(data.question[0], id);

      // Set the number of options on update to add/remove the option dynamically
      this.numberOfOptionsOnUpdate = data.question[0].optionIDs.length;

      document
        .querySelector('.input-group')
        .addEventListener('click', (event) =>
          this.handleEventOnModal(event, 'edit')
        );
    }
  }

  async updateQuestion() {
    const title = document.querySelector('#title').value;

    const optionNodes = document.querySelectorAll('.options');

    const options = [];
    const optionIDs = [];

    optionNodes.forEach((node) => {
      options.push(node.value);
      optionIDs.push(node.id);
    });

    const optionNumber = document.querySelector('input[name="answer"]:checked')
      .value;

    const question = { title, options, optionIDs, optionNumber };

    const id = document.querySelector('#id').value;

    try {
      const result = await client.put(`${API_URL}/${id}`, question);

      ui.showAlert(result.message, 'alert alert-success');
      this.closeModal();
      new Questions();
    } catch (error) {
      ui.showAlert('Could not connect to server', 'alert alert-danger');
      this.closeModal();
    }
  }

  async deleteQuestionByIcon(e) {
    e.preventDefault();
    if (e.target.parentElement.classList.contains('delete')) {
      // Get the id of the question
      const id = parseInt(e.target.parentElement.dataset.id);
      if (confirm('Are you sure you want to delete this option?')) {
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
