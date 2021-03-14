class UI {
  constructor() {
    this.quiz = document.querySelector('#quiz');
    this.show = document.querySelector('#show');
    this.modalBody = document.querySelector('.modal-body');
    this.submitDiv = document.querySelector('#submit-div');
    this.questionId = document.querySelector('#id');
  }

  showModal() {
    const div = document.createElement('div');

    div.id = 'question-div';

    div.innerHTML = `
    <textarea rows="1" class="form-control" placeholder="Enter a question"
    oninput="auto_height(this)"></textarea>

    <div class="input-group">
        <div class="mb-3 me-3 mt-3">
            <span class="input-group-text">
                <input class="form-check-input" type="radio" id="r1" value="1" name="answer" checked>
            </span>
            <textarea rows="1" class="form-control auto_height" placeholder=" Option 1"
                oninput="auto_height(this)"></textarea>
        </div>

        <div class="mb-3 me-3 mt-3">
            <span class="input-group-text">
                <input class="form-check-input" type="radio" id="r2" value="2" name="answer">
            </span>
            <textarea rows="1" class="form-control auto_height" placeholder=" Option 2"
                oninput="auto_height(this)"></textarea>
        </div>
        <a class="input-group-text mt-3" id="add-option" href="#"><em class="fas fa-plus"></em></a>
    </div>
    `;

    this.modalBody.insertBefore(div, this.submitDiv);
  }

  addOption(numberOfOptions) {
    const div = document.createElement('div');

    div.className = 'mb-3 me-3 mt-3';

    div.innerHTML = `
    <span class="input-group-text">
      <input class="form-check-input" type="radio" id="r${numberOfOptions}" value="${numberOfOptions}" name="answer">
    </span>
    <textarea rows="1" class="form-control auto_height" placeholder=" Option ${numberOfOptions}" oninput="auto_height(this)"></textarea> 
    <a href="#" class="float-end text-danger mt-3 delete"><em class="far fa-trash-alt"></em></a>
    `;

    // Get the input group
    const inputGroup = document.querySelector('.input-group');

    // Get the plus icon
    const addOptionBtn = document.querySelector('#add-option');

    // Add the option before the plus icon
    inputGroup.insertBefore(div, addOptionBtn);
  }

  clearModal() {
    const questionDiv = document.querySelector('#question-div');
    questionDiv.remove();
  }

  showAllQuestions(questions) {
    questions.forEach((question, counter) => {
      // Create a box
      const box = document.createElement('div');
      box.className = 'box mt-3';

      const box_body = document.createElement('div');
      box_body.className = 'box-body';

      // Create title
      const title = document.createElement('h2');
      title.className = 'box-title';
      title.textContent = `${question.title}`;

      // Create ul
      const ul = document.createElement('ul');
      let options = '';

      question.options.forEach((option, index) => {
        options = `
        <li>
          <input type="radio" name="answer_${counter + 1}" class="answer_${
          counter + 1
        }_${index + 1}">
          <label for="r${counter + 1}_${index + 1}">${option}</label>
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
        <a href="#" class="card-link delete" data-id="${question.questionID}">
            <em class="far fa-trash-alt"></em>
        </a>
      `;

      group_icon.innerHTML += a_tags;

      // Add title, options to box_body
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

        radioBtn.id = val;

        if (question.optionNumber == index + 1) {
          radioBtn.checked = true;
        }
      });
    });
  }
}

export const ui = new UI();
