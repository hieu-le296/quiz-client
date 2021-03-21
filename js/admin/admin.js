import { client } from '../client.js';
import { ui } from './ui.js';

// const API_URL = 'https://quizisfun.tk/api/admin/questions';
const API_URL = 'http://localhost:5600/api/admin/questions';

class Questions {
  constructor() {
    this.loading = document.getElementById('loading');
    client
      .get(`${API_URL}`)
      .then((data) => ui.showAllQuestions(data.questions))
      .catch((err) => {
        const title = document.querySelector('.box-title');
        title.textContent = 'Could not connect to server';
        title.style.color = 'red';
        this.loading.style.display = 'block';
      });
  }
}

class App {
  constructor() {
    this.loading = document.getElementById('loading');
    this.loading.style.display = 'none';

    new Questions();
    this.modal = document.querySelector('#myModal');
    this.instruction = document.querySelector('#instruction');
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

    this.instruction.addEventListener('click', () => this.openInstruction());

    // Set question status
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.setQuestionStatus(e));

    // Edit a question by icon
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.showEditQuestion(e));

    // Delete a question by icon
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.deleteQuestionByIcon(e));

    // Delete all questions
    document
      .querySelector('#quiz')
      .addEventListener('click', (e) => this.deleteAllQuestions(e));

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

  openInstruction() {
    this.modal.style.display = 'block';
    this.addBtn.style.zIndex = -1;
    ui.showInstructions();
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
          this.loading.style.display = 'block';
        }
      }
    }
  }

  async addQuestion() {
    const title = document.querySelector('#title').value.trim();

    const optionNodes = document.querySelectorAll('.options');

    const options = [];

    optionNodes.forEach((node) => {
      options.push(node.value.trim());
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
      this.loading.style.display = 'block';
    }
  }

  async setQuestionStatus(e) {
    e.stopPropagation();

    if (e.target.parentElement.classList.contains('form-switch')) {
      const checkbox = e.target.parentElement.childNodes[0];
      const label = e.target.parentElement.childNodes[1];

      if (checkbox.value == 0) {
        checkbox.value = 1;
        label.textContent = 'Enabled';
        // new Questions();
      } else if (checkbox.value == 1) {
        checkbox.checkbox = false;
        checkbox.value = 0;
        label.textContent = 'Disabled';
      }

      const isEnabled = checkbox.value;

      const obj = { isEnabled };

      const id = e.target.parentElement.dataset.id;

      try {
        await client.put(`${API_URL}/status/${id}`, obj);
        new Questions();
      } catch (error) {
        ui.showAlert('Could not connect to server', 'alert alert-danger');
        this.closeModal();
        this.loading.style.display = 'block';
      }
    }
  }

  async showEditQuestion(e) {
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
    e.stopPropagation();
  }

  async updateQuestion() {
    const title = document.querySelector('#title').value.trim();

    const optionNodes = document.querySelectorAll('.options');

    const options = [];
    const optionIDs = [];

    optionNodes.forEach((node) => {
      options.push(node.value.trim());
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
      this.loading.style.display = 'block';
    }
  }

  async deleteQuestionByIcon(e) {
    if (e.target.parentElement.classList.contains('delete')) {
      // Get the id of the question
      const id = parseInt(e.target.parentElement.dataset.id);
      if (confirm('Are you sure you want to delete this question?')) {
        try {
          const result = await client.delete(`${API_URL}/${id}`);
          if (result.success) {
            ui.showAlert(result.message, 'alert alert-danger');
            new Questions();
          }
        } catch (error) {
          ui.showAlert('Could not connect to server', 'alert alert-danger');
          this.loading.style.display = 'block';
        }
      }
    }
    e.stopPropagation();
  }

  async deleteAllQuestions(e) {
    if (e.target.parentElement.id == 'deleteBtn') {
      if (confirm('Are you sure you want to delete all questions?')) {
        try {
          const result = await client.delete(`${API_URL}`);
          if (result.success) {
            ui.showAlert(result.message, 'alert alert-danger');
            new Questions();
          }
        } catch (error) {
          ui.showAlert('Could not connect to server', 'alert alert-danger');
          this.loading.style.display = 'block';
        }
      }
    }
    e.stopPropagation();
  }
}

const loading = document.getElementById('loading');

loading.style.display = 'block';

setTimeout(() => {
  const app = new App();
  app.loadEvents();
}, 100);
