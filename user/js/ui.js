class UI {
  constructor() {
    this.quiz = document.querySelector('#quiz');
    this.show = document.querySelector('#show');
    this.btnGroup = document.querySelector('.group');
    this.nextBtn = document.querySelector('#next');
    this.prevBtn = document.querySelector('#prev');
    this.currentQuestion = 0;
  }

  showQuestion(questions) {
    if (this.currentQuestion === 0) {
      this.disablePrevBtn();
    } else {
      this.enablePrevBtn();
    }

    if (this.currentQuestion === questions.length - 1) {
      this.showSubmitBtn();
    }
    const div = document.createElement('div');
    div.className = 'question-div';
    const ul = document.createElement('ul');

    let current = questions[this.currentQuestion];

    const questionNumber = document.createElement('h5');
    questionNumber.className = 'float-start';
    questionNumber.textContent = `Question ${this.currentQuestion + 1}:`;

    const title = document.createElement('textarea');
    title.className = 'card-title form-control';
    title.id = 'title';
    title.setAttribute('readonly', true);
    title.textContent = current.title;

    div.appendChild(questionNumber);
    div.appendChild(title);

    let options = '';

    current.options.forEach((option, index) => {
      options = `
        <li>
            <input type="radio" name="answer" id="${index + 1}" class="answer">
            <label for="${index + 1}" id="${index + 1}_text">${option}</label>
        </li>`;

      ul.innerHTML += options;
    });

    div.appendChild(ul);

    this.show.insertBefore(div, this.btnGroup);

    const titleText = document.getElementById('title');
    titleText.style.height = titleText.scrollHeight + 'px';
  }

  setCurrentQuestion(currentQuestion) {
    this.currentQuestion = currentQuestion;
  }

  showNextQuestion(questions) {
    this.currentQuestion++;

    if (this.currentQuestion < questions.length) {
      this.clearDiv();
      this.showQuestion(questions);
    }
  }

  showPrevQuestion(questions) {
    this.currentQuestion--;
    if (this.currentQuestion >= 0) {
      this.clearDiv();
      this.enableNextBtn();
      this.showQuestion(questions);
    }
  }

  checkSelected() {
    const answerEls = document.querySelectorAll('.answer');
    let check = false;

    answerEls.forEach((answerEl) => {
      if (answerEl.checked) {
        check = true;
      }
    });
    return check;
  }

  getSelected() {
    const answerEls = document.querySelectorAll('.answer');

    let answer;

    answerEls.forEach((answerEl) => {
      if (answerEl.checked) {
        answer = answerEl.id;
      }
    });

    return parseInt(answer);
  }

  getCurrentQuestionIndex() {
    return this.currentQuestion;
  }

  selectAnswer(id) {
    const answerEls = document.querySelectorAll('.answer');
    if (id) {
      id = id.toString();
    }
    answerEls.forEach((answerEl) => {
      if (answerEl.id === id) {
        answerEl.checked = true;
      }
    });
  }

  showMessage(message, className) {
    this.quiz.style.display = 'block';
    this.clearDiv();
    this.show.innerHTML = `
    <div>
        <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="Back to landing page" href="../../index.html"><em class="fas fa-arrow-left"></em></a>
    </div>
    <h2 class="text-center ${className}">${message}</h2>
    `;
  }

  showAllQuestions(questions) {
    questions.forEach((question, number) => {
      const card = document.createElement('div');
      card.className = 'card mt-3 mb-3';
      const card_body = document.createElement('div');
      card_body.className = 'card-body';

      card.appendChild(card_body);

      const div = document.createElement('div');
      div.id = `question_${number + 1}`;
      const ul = document.createElement('ul');

      const questionNumber = document.createElement('h5');
      questionNumber.className = 'float-start';
      questionNumber.textContent = `Question ${number + 1}:`;

      const title = document.createElement('textarea');
      title.className = 'card-title textarea-title form-control';
      title.id = 'title';
      title.setAttribute('readonly', true);
      title.textContent = question.title;

      div.appendChild(questionNumber);
      div.appendChild(title);

      let options = '';

      question.options.forEach((option, index) => {
        options = `
          <li>
              <label class="answer" id="${index + 1}">${option}</label>
          </li>
          `;

        ul.innerHTML += options;
      });

      div.appendChild(ul);

      card_body.appendChild(div);

      this.quiz.appendChild(card);
    });

    const titles = document.querySelectorAll('.textarea-title');
    titles.forEach((element) => {
      element.style.height = element.scrollHeight + 'px';
    });
  }

  showAnswers(answers, correctAnswers) {
    let i, div, answerEls, id;
    for (i = 0; i < answers.length; i++) {
      div = document.getElementById(`question_${i + 1}`);

      answerEls = div.childNodes[2].querySelectorAll('.answer');

      id = answers[i];

      answerEls.forEach((answerEl) => {
        if (answerEl.id == id) {
          answerEl.style.color = 'red';
        }
      });
    }

    for (i = 0; i < correctAnswers.length; i++) {
      div = document.getElementById(`question_${i + 1}`);

      answerEls = div.childNodes[2].querySelectorAll('.answer');

      id = correctAnswers[i];

      answerEls.forEach((answerEl) => {
        if (answerEl.id == id) {
          answerEl.style.color = 'green';
        }
      });
    }
  }

  enablePrevBtn() {
    this.prevBtn.style.display = 'block';
  }

  disablePrevBtn() {
    this.prevBtn.style.display = 'none';
  }

  enableNextBtn() {
    const submitBtn = document.querySelector('#submit');
    if (submitBtn) {
      submitBtn.remove();
    }

    this.nextBtn.style.display = 'block';
  }

  showSubmitBtn() {
    this.nextBtn.style.display = 'none';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.id = 'submit';

    this.prevBtn.insertAdjacentElement('afterend', submitBtn);
  }

  showAlert(message, className) {
    // Clear any previous alert
    this.clearAlert();

    const div = document.createElement('div');
    // Add classes
    div.className = className;
    // Add text
    div.appendChild(document.createTextNode(message));

    // Get parent
    const card = document.querySelector('.card');

    //  Insert alert div
    card.insertBefore(div, this.show);

    // Timeout
    setTimeout(() => {
      this.clearAlert();
    }, 2000);
  }

  // Clear Alert
  clearAlert() {
    const currentAlert = document.querySelector('.alert');
    if (currentAlert) {
      currentAlert.remove();
    }
  }

  clearDiv() {
    const question_div = document.querySelector('.question-div');
    if (question_div) {
      question_div.remove();
    }
  }
}

export const ui = new UI();
