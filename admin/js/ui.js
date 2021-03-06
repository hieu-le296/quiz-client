class UI {
  constructor() {
    this.quiz = document.querySelector('#quiz');
    this.show = document.querySelector('#show');
    this.modalTitle = document.querySelector('#modal-title');
    this.modalBody = document.querySelector('.modal-body');
    this.createBtn = document.querySelector('#create');
    this.updateBtn = document.querySelector('#update');
    this.submitDiv = document.querySelector('#submit-div');
    this.questionId = document.querySelector('#id');
  }

  showInstructions() {
    const div = document.createElement('div');

    div.id = 'question-div';

    this.modalTitle.textContent = 'Instructions';

    div.innerHTML = `
    <div>
      This instruction shows you how to use the functions of this page.
    </div>
    <hr>
    <div>
      <h4>Add a question: </h4>
      Simply click on the floating button on the right corner. Fill in the question information in all textareas. The added question will be added to the database and dynamically populated.
    </div>
    <hr>
    <div>
      <h4>Edit: </h4>
      Click on the update icon to edit the question. Once edited, the question will be updated in the database and dynamically shown.
    </div>
    <hr>
    <div>
      <h4>Delete: </h4>
      Click on the remove icon or delete button to remove the question from the database.
    </div>
    <hr>
    <div>
      <h4>Delete All: </h4>
      A delete button is the trash icon appearing in the end of the page if there are more than 2 questions created.
    </div>
    <hr>
    <div>
      <h4>Set question status: </h4>
      You can enable or disable the question. Once disabled, the question will not be shown in user page.
    </div>

    `;
    this.updateBtn.style.display = 'none';
    this.createBtn.style.display = 'none';
    this.modalBody.appendChild(div);
  }

  showModal() {
    const div = document.createElement('div');

    div.id = 'question-div';

    this.modalTitle.textContent = 'Add Question';

    div.innerHTML = `
    <textarea rows="1" class="form-control" id='title' placeholder="Enter a question"
    oninput="auto_height(this)"></textarea>

    <div class="input-group">
        <div class="mb-3 me-3 mt-3">
            <span class="input-group-text">
                <input class="form-check-input" type="radio" id="r1" value="1" name="answer" checked>
            </span>
            <textarea rows="1" class="form-control auto_height options" placeholder=" Option 1"
                oninput="auto_height(this)"></textarea>
        </div>

        <div class="mb-3 me-3 mt-3">
            <span class="input-group-text">
                <input class="form-check-input" type="radio" id="r2" value="2" name="answer">
            </span>
            <textarea rows="1" class="form-control auto_height options" placeholder=" Option 2"
                oninput="auto_height(this)"></textarea>
        </div>
        <a class="input-group-text mt-3 add-option" id="add-option" href="#"><em class="fas fa-plus"></em></a>
    </div>
    `;
    this.updateBtn.style.display = 'none';
    this.createBtn.style.display = 'block';
    this.modalBody.insertBefore(div, this.submitDiv);
  }

  addOption(numberOfOptions) {
    const div = document.createElement('div');

    div.className = 'mb-3 me-3 mt-3';

    div.innerHTML = `
    <span class="input-group-text">
      <input class="form-check-input" type="radio" id="r${numberOfOptions}" value="${numberOfOptions}" name="answer">
    </span>
    <textarea rows="1" class="form-control auto_height options" placeholder=" Option ${numberOfOptions}" oninput="auto_height(this)"></textarea> 
    <a href="#" class="float-end text-danger mt-3 delete"><em class="far fa-trash-alt"></em></a>
    `;

    // Get the input group
    const inputGroup = document.querySelector('.input-group');

    // Get the plus icon
    const addOptionBtn = document.querySelector('#add-option');

    // Add the option before the plus icon
    inputGroup.insertBefore(div, addOptionBtn);
  }

  removeOption(target) {
    target.remove();
  }

  showAllQuestions(questions) {
    // Clear any previous questions
    this.clearScreen();

    if (questions.length == 0) {
      this.showNoQuestionMessage();
    } else {
      const message = document.getElementById('no-question');
      if (message) {
        message.remove();
      }
      questions.forEach((question, counter) => {
        // Create a box
        const box = document.createElement('div');
        box.className = 'box mt-3';

        const box_body = document.createElement('div');
        box_body.className = 'box-body';

        // Question number
        const questionNumber = document.createElement('h5');
        questionNumber.className = 'float-start';
        questionNumber.textContent = `Question ${counter + 1}:`;

        // Create enable switch to toggle question visible to user
        const enableQuiz = document.createElement('div');
        enableQuiz.className = 'form-check form-switch float-end';
        enableQuiz.dataset.id = question.questionID;

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.id = `question_${counter + 1}`;
        checkbox.className = 'form-check-input';

        const labelCheckbox = document.createElement('label');
        labelCheckbox.className = 'form-check-label';
        labelCheckbox.htmlFor = `question_${counter + 1}`;

        if (question.isEnabled == 1) {
          checkbox.checked = true;
          checkbox.value = 1;
          labelCheckbox.textContent = 'Enabled';
        } else {
          checkbox.checked = false;
          checkbox.value = 0;
          labelCheckbox.textContent = 'Disabled';
        }

        enableQuiz.appendChild(checkbox);
        enableQuiz.appendChild(labelCheckbox);

        // Create title
        const title = document.createElement('textarea');
        title.className = 'textarea-title box-title form-control';
        title.textContent = `${question.title}`;
        title.setAttribute('readonly', true);

        // // Create ul
        const ul = document.createElement('ul');
        ul.className = 'list-group';
        let options = '';

        question.options.forEach((option, index) => {
          options = `
        <li class="list-group-item">
          <input type="radio" name="answer_${counter + 1}" class="answer_${
            counter + 1
          }_${index + 1}">
          <label class="option-content" for="r${counter + 1}_${
            index + 1
          }">${option}</label>
        </li>
        `;
          ul.innerHTML += options;
        });

        // Create group icons
        const group_icon = document.createElement('div');
        group_icon.className = 'float-end';

        let a_tags = `
        <a href="#" class="card-link edit" data-id="${question.questionID}">
            <em class="far fa-edit"></em>
        </a>
        <a href="#" class="card-link text-danger delete" data-id="${question.questionID}">
            <em class="far fa-trash-alt"></em>
        </a>
      `;

        group_icon.innerHTML += a_tags;

        // Add title, enable question,  options to box_body
        box_body.appendChild(questionNumber);
        box_body.appendChild(enableQuiz);
        box_body.appendChild(title);
        box_body.appendChild(ul);
        box_body.appendChild(group_icon);

        // Add box_body to the parent box
        box.appendChild(box_body);

        // Add box to quiz screen
        this.quiz.appendChild(box);

        // Add option IDs to options and check the answer from option number
        question.optionIDs.forEach((val, index) => {
          const radioBtn = document.querySelector(
            `.answer_${counter + 1}_${index + 1}`
          );

          if (question.optionNumber == index + 1) {
            radioBtn.checked = true;
          }
        });

        const titles = document.querySelectorAll('.textarea-title');
        titles.forEach((element) => {
          element.style.height = element.scrollHeight + 'px';
        });
      });

      if (this.quiz.childElementCount >= 2) {
        this.addDeleteAllButton();
      }
    }
  }

  showUpdateModal(question, id) {
    const div = document.createElement('div');

    div.id = 'question-div';

    this.modalTitle.textContent = 'Update the Question';

    const hiddenTag = document.createElement('input');
    hiddenTag.setAttribute('type', 'hidden');
    hiddenTag.id = 'id';

    hiddenTag.value = id;

    div.appendChild(hiddenTag);

    let title = `
      <textarea rows="1" class="form-control" id='title' placeholder="Enter a question" oninput="auto_height(this)">${question.title}</textarea>`;

    div.innerHTML += title;

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    let options = '';
    question.options.forEach((option, index) => {
      if (index + 1 > 2) {
        options += `
          <div class="mb-3 me-3 mt-3">
              <span class="input-group-text">
                  <input class="form-check-input" type="radio" name="answer" value="${
                    index + 1
                  }" id="r${index + 1}">
              </span>
              <textarea rows="1" class="form-control auto_height options op${
                index + 1
              }" placeholder=" Option ${index + 1}"
                  oninput="auto_height(this)">${option}</textarea>
                  <a href="#" class="float-end text-danger mt-3 delete"><em class="far fa-trash-alt"></em></a>
          </div>`;
      } else {
        options += `
        <div class="mb-3 me-3 mt-3">
            <span class="input-group-text">
                <input class="form-check-input" type="radio" name="answer" value="${
                  index + 1
                }" id="r${index + 1}">
            </span>
            <textarea rows="1" class="form-control auto_height options op${
              index + 1
            }" placeholder=" Option ${index + 1}"
                oninput="auto_height(this)">${option}</textarea>
        </div>`;
      }
    });
    inputGroup.innerHTML += options;

    inputGroup.innerHTML += `<a class="input-group-text mt-3 add-option" id="add-option" href="#"><em class="fas fa-plus"></em></a>`;

    div.appendChild(inputGroup);

    this.createBtn.style.display = 'none';
    this.updateBtn.style.display = 'block';
    this.modalBody.insertBefore(div, this.submitDiv);

    // check the answer from option number
    question.optionIDs.forEach((val, index) => {
      const textArea = document.querySelector(`.op${index + 1}`);
      // Add option id to texteara id
      textArea.id = val;

      // Check the correct answer then check radio button
      const radioBtn = document.querySelector(`#r${index + 1}`);
      if (question.optionNumber == index + 1) {
        radioBtn.checked = true;
      }
    });

    const titleText = document.getElementById('title');
    titleText.style.height = titleText.scrollHeight + 'px';
  }

  clearModal() {
    const questionDiv = document.querySelector('#question-div');
    if (questionDiv) {
      questionDiv.remove();
    }
  }

  showNoQuestionMessage() {
    // Create title
    const title = document.createElement('h5');
    title.className = 'text-center';
    title.id = 'no-question';
    title.style.color = '#8d55c2';
    title.innerHTML =
      'There are no questions here. Add a question now &#x1F61C';

    const admin_div = document.querySelector('.box-body-admin');
    admin_div.appendChild(title);
  }

  addDeleteAllButton() {
    // Add a delete All Button
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtn';
    deleteBtn.className = 'mt-3 btn-danger';
    deleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
    this.quiz.appendChild(deleteBtn);
  }

  clearScreen() {
    while (this.quiz.firstChild) {
      this.quiz.removeChild(this.quiz.firstChild);
    }
  }

  showAlert(message, className) {
    // Clear any previous alert
    this.clearAlert();

    const div = document.createElement('div');
    // Add classes
    div.className = className;
    div.role = 'alert';
    // Add text
    div.appendChild(document.createTextNode(message));

    // get admin div
    const admin_div = document.querySelector('.box-body-admin');

    admin_div.appendChild(div);

    // Timeout
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  showModalAlert(messages, className) {
    // Clear any previous alert
    this.clearAlert();

    const div = document.createElement('div');
    // Add classes
    div.className = className;
    div.role = 'alert';
    if (typeof messages === 'string' || messages instanceof String) {
      div.innerHTML += `<p>${messages}.</p>`;
    } else {
      // Add text
      let newArr = new Set(messages);
      for (let message of newArr.values()) {
        div.innerHTML += `<p>${message}.</p>`;
      }
    }

    // get question div
    const question_div = document.querySelector('#question-div');

    this.modalBody.insertBefore(div, question_div);

    // Timeout
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  // Clear Alert
  clearAlert() {
    const currentAlert = document.querySelector('.alert');
    if (currentAlert) {
      currentAlert.remove();
    }
  }
}

export const ui = new UI();
