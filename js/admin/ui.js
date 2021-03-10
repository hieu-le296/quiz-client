class UI {
  constructor() {
    this.quiz = document.querySelector('#quiz');
    this.show = document.querySelector('#show');
    this.questionId = document.querySelector('#id');
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
