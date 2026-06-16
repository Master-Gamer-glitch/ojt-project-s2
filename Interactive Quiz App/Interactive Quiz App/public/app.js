import { questions } from './questions.js';

let currentQuestionIndex = 0;
let score = 0;

// Get elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const feedbackMessage = document.getElementById('feedback-message');
const scoreTracker = document.getElementById('score-tracker');
const questionTracker = document.getElementById('question-tracker');

// Add events
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextClick);

function startQuiz() {
  startScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  quizScreen.classList.add('active');
  
  currentQuestionIndex = 0;
  score = 0;
  scoreTracker.innerText = score;
  
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  questionTracker.innerText = currentQuestionIndex + 1;
  
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;
  
  // Create answer buttons
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answersContainer.appendChild(button);
  });
}

function resetState() {
  nextBtn.style.display = 'none';
  feedbackMessage.style.display = 'none';
  answersContainer.innerHTML = ''; // Clear previous buttons
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  
  // Update score and feedback
  if (isCorrect) {
    score++;
    scoreTracker.innerText = score;
    feedbackMessage.innerText = 'Correct!';
    feedbackMessage.style.color = '#00ff00'; // Green text
  } else {
    feedbackMessage.innerText = 'Incorrect!';
    feedbackMessage.style.color = '#ff0000'; // Red text
  }
  feedbackMessage.style.display = 'block';

  // Highlight correct/wrong answers and disable all buttons
  Array.from(answersContainer.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add('correct');
    } else {
      button.classList.add('wrong');
    }
    button.disabled = true;
  });

  // Show Next or Results button
  nextBtn.style.display = 'block';
  if (currentQuestionIndex + 1 < questions.length) {
    nextBtn.innerText = 'Next Question';
  } else {
    nextBtn.innerText = 'See Results';
  }
}

function handleNextClick() {
  if (currentQuestionIndex + 1 < questions.length) {
    currentQuestionIndex++;
    setNextQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');
  
  document.getElementById('final-score').innerText = score;
  document.getElementById('total-questions').innerText = questions.length;
  
  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById('final-percentage').innerText = percentage + '%';
}
