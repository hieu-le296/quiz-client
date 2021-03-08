class UI {
  constructor() {
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
    div.id = 'question-div';
    const ul = document.createElement('ul');

    let current = questions[this.currentQuestion];

    let title = '';

    title += `<h3 class="card-title" id="title">Question ${
      this.currentQuestion + 1
    }: ${current.title}</h3>`;

    div.innerHTML = title;

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

    answerEls.forEach((answerEl) => {
      if (answerEl.id == id) {
        answerEl.checked = true;
      }
    });
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
    submitBtn.className = 'btn-warning';

    this.prevBtn.insertAdjacentElement('afterend', submitBtn);
  }

  clearDiv() {
    document.querySelector('#question-div').remove();
  }
}

export const ui = new UI();
