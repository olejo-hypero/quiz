import { arrayQuestions } from './answers.js';

/*
1. Метод для рендера вопроса - showQuestion
2. Метод нажатия по кнопке Дальше - nextQuestion
3. Метод проверки на правильность ответа - checkQuestion
4. Метод для выбора ответа - selectAnswer
5. Метод для вывода результатов - finish
6. Метод для начала заново - restart

доп. работа
1. Добавить таймер
2. Добавить progress bar
*/

class Quiz {
  constructor(id, questions) {
    this.quiz = document.querySelector(`#${id}`);
    this.questions = questions;
    this.answers = this.quiz.querySelector('.quiz-answers');
    this.button = this.quiz.querySelector('.quiz-button');
    this.score = 0;
    this.answerIndex = 0;
    this.timeValue = 15;
    this.counterTime;
    this.counterLine;
    this.#init();
  }
  #init() {
    // this.renderSettings();
    this.showQuestion();
    this.nextQuestion();
    this.selectAnswer();
    this.timer(this.timeValue);
  }
  // renderSettings() {
  //   const settingsWrapper = this.quiz.querySelector('.quiz-settings');
  //   const catNames = [...new Set(this.questions.map(cat => cat.category_name))];
  //   const select = document.createElement('select');
  //   const options = catNames
  //     .map(item => {
  //       return `<option value="${item}"></option>`;
  //     })
  //     .join('');
  //   select.innerHTML = options;
  //   console.log(select);
  //   settingsWrapper.insertAdjacentElement('afterbegin', select);
  // }
  showQuestion() {
    const title = this.quiz.querySelector('.quiz-title');
    const step = this.quiz.querySelector('.quiz-step');
    const score = this.quiz.querySelector('.quiz-score');
    step.textContent = `
			${this.answerIndex + 1} / ${this.questions.length}
		`;
    score.textContent = this.score;
    title.textContent = arrayQuestions[this.answerIndex].title;
    this.answers.innerHTML = arrayQuestions[this.answerIndex].answers
      .map((item, index) => {
        return `
				<div class="quiz-answer" data-answer="${index + 1}">${item.answer}</div>
			`;
      })
      .join('');
    this.progressline(this.timeValue);
    this.button.classList.add('hidden');
  }
  nextQuestion() {
    this.button.addEventListener(
      'click',
      function () {
        if (this.answerIndex < this.questions.length - 1) {
          [...this.quiz.querySelector('.quiz-answers').children].forEach(item => {
            if (item.classList.contains('selected')) {
              this.answerIndex += 1;
              this.showQuestion();
              this.timer(this.timeValue);
            }
          });
        } else {
          this.finish();
        }
      }.bind(this),
    );
  }
  selectAnswer() {
    this.quiz.addEventListener(
      'click',
      function (e) {
        const self = e.target;
        if (!self.classList.contains('quiz-answer')) return;
        clearInterval(this.counterTime);
        clearInterval(this.counterLine);
        self.classList.add('selected');
        this.button.classList.remove('hidden');
        this.checkAnswer(self);
        [...this.answers.children].forEach(answer => {
          answer.classList.add('disabled');
        });
      }.bind(this),
    );
  }
  checkAnswer(answer) {
    const index = +answer.dataset.answer;
    const correctAnswer = +arrayQuestions[this.answerIndex].answers.findIndex(answer => answer.correct === true) + 1;
    if (index === correctAnswer) {
      this.score += 1;
      answer.classList.add('corrected');
    } else {
      this.quiz.querySelector('.quiz-answers').children[correctAnswer - 1].classList.add('corrected');
      answer.classList.add('incorrected');
    }
  }
  timer(time) {
    const timer = this.quiz.querySelector('.quiz-timer span');
    timer.textContent = this.timeValue;
    this.counterTime = setInterval(() => {
      time--;
      timer.textContent = time;
      if (time === 3) this.music('./music/countdown.mp3');
      if (time < 0) {
        clearInterval(this.counterTime);
        timer.textContent = 0;
        if (this.answerIndex < this.questions.length - 1) {
          this.answerIndex++;
          this.showQuestion();
          this.timer(this.timeValue);
        } else {
          this.finish();
        }
      }
    }, 1000);
  }
  progressline(time) {
    const progressLine = this.quiz.querySelector('.quiz-progressline');
    progressLine.style.width = '100%';
    this.counterLine = setInterval(() => {
      time--;
      const percentage = (time / this.timeValue) * 100;
      progressLine.style.width = `${percentage}%`;
      if (time < 0) clearInterval(this.counterLine);
    }, 1000);
  }
  music(url) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play();
  }
  finish() {
    const percent = (this.score * 100) / this.questions.length;
    let total = '';
    if (this.score === this.questions.length) {
      total = 'Отлично, вы ответили на все вопросы верно';
    } else if (percent >= 50 && percent <= 70) {
      total = 'Неплохо!';
    } else {
      total = 'Плохо, попробуйте еще раз';
    }
    const HTML = `
		<div class="finish-quiz">
			<div class="finish-score">${this.score} ${decline(this.score, 'очко', 'очка', 'очков')}</div>
			<div class="finish-text">Вы ответили на ${this.score} ${decline(this.score, 'вопрос', 'вопроса', 'вопросов')}</div>
      <div class="finish-total">Ваша оценка: <span>${total}</span></div>
      <div class="btn restart-quiz">Начать заново</div>
		</div>
			`;
    this.quiz.innerHTML = HTML;
    const restartBtn = this.quiz.querySelector('.restart-quiz');
    restartBtn.addEventListener('click', () => this.restart());
  }
  restart() {
    location.reload();
  }
}
function decline(num, one, two, five) {
  let n = Math.abs(num);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}
new Quiz('quiz-1', arrayQuestions);
