const API_URL = "http://www.boredapi.com/api/activity/";
const inputElement = document.getElementById("inputText");
const diplayElement = document.getElementById("sentenceDisplay");
const timer_text = document.getElementById("curr_timer");
const error_text = document.getElementById("curr_errors");
const accuracy_text = document.getElementById("curr_accuracy");
const score_text = document.getElementById("curr_score");
const overlay = document.getElementById("fullOverlay");
const overlaytext = document.getElementById("overlaytext");
const overlayresult = document.getElementById("overlaytext2");
const typingSound = new Audio("./audio/typingsound.mp3");
const correctSound = new Audio("./audio/correctsound.mp3");
const wrongSound = new Audio("./audio/wrongsound.mp3");

let IsGame = false;
let time_limit = 60;
let accuracy = 0;
let errors = 0;
let errorstate = [];
let scores = 0;
let first_countdown = 3;
let misstype = [];
let misstype_letter = [];
let word_count = 0;

//入力操作
inputElement.addEventListener("input", () => {
  let correct = true;
  typingSound.play();
  typingSound.currentTime = 0;
  const arrayAPI = diplayElement.querySelectorAll("span");
  const arrayValue = inputElement.value.split("");
  arrayAPI.forEach((charSpan, index) => {
    const input_char = arrayValue[index];
    //入力削除
    if (input_char == null) {
      charSpan.classList.remove("correct");
      charSpan.classList.remove("incorrect");
      correct = false;
    } else if (input_char === charSpan.innerText) {
      //入力一致
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
      adderror(index, 0);
    } else {
      //入力ミス
      charSpan.classList.remove("correct");
      charSpan.classList.add("incorrect");
      correct = false;
      wrongSound.play();
      wrongSound.currentTime = 0;
      misstype.push([charSpan.innerText, input_char]);
      misstype_letter.push(charSpan.innerText);
      adderror(index, 1);
    }
  });
  if (correct) {
    scores += 100;
    renderNewSentence();
    score_text.innerText = scores;
    correctSound.play();
    correctSound.currentTime = 0;
    let correct_char = [];
    arrayValue.forEach((v) => {
      if (v !== " ") {
        correct_char.push(v);
      }
    });

    word_count += correct_char.length;
    console.log(word_count);
  }
  //console.log(arrayValue);
});


function getAPI() {
  return fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data.activity);
}

function adderror(index, num) {
  if (num) {
    if (errorstate[index] != 1) {
      errors += 1;
      error_text.innerText = errors;
    }
    errorstate[index] = 1;
  } else if (errorstate[index] == -1) {
    errorstate[index] = 0;
  }
}

//非同期処理
async function renderNewSentence() {
  // 実行完了まで待つ非同期関数を定義
  const sentence = await getAPI(); // 呼び出した文字列を格納
  diplayElement.innerHTML = ""; //一度要素内を空にする
  errorstate = [];
  sentence.split("").forEach((char) => {
    errorstate.push(-1);
    const charSpan = document.createElement("span"); //spanタグの作成
    charSpan.innerText = char; //spanタグ内のテキストにchar文字を挿入
    diplayElement.appendChild(charSpan);
  });
  inputElement.value = null;
}

function updateTimer() {
  if (time_limit > 0) {
    time_limit--;
    timer_text.innerText = time_limit + "s";
  } else {
    finishGame();
  }
}

function startGame() {
  if (!IsGame) {
    inputElement.disabled = true; //
    overlaytoggle();
    startTimer();
    loadmsg();
    resetValues();
    renderNewSentence();
    IsGame = true;
    timer = setInterval(updateTimer, 1000);
  }
}

function finishGame() {
  let l = [];
  l = errorstate.filter((v) => {
    return v == 0;
  });
  console.log(l);
  word_count += l.length;
  console.log(word_count);

  clearInterval(timer);
  IsGame = false;
  inputElement.disabled = true;
  overlaytoggle();
  resultDisplay();
  restartButton();

  //console.log(misstype);
}

//リスタートボタン
function resetValues() {
  inputElement.innerHTML = "";
  error_text.innerText = 0;
  score_text.innerText = 0;
  first_countdown = 3;
  time_limit = 60;
  errors = 0;
  timer_text.innerText = time_limit;
}
function ableinput() {
  inputElement.disabled = false;
}

function loadmsg() {
  overlaytext.innerText = "Loading...";
}

function overlaytoggle() {
  overlay.classList.toggle("click");
  overlaytext.classList.toggle("clickedtext");
}

function startTimer() {
  stimer = setInterval(countdown, 1000);
}

function countdown() {
  if (first_countdown > 0) {
    overlaytext.innerText = first_countdown;
    first_countdown--;
    time_limit = 5;
  } else if (first_countdown == 0) {
    overlaytext.innerText = "Start!";
    first_countdown--;
    time_limit = 5;
  } else {
    overlaytext.innerText = "...";
    finishStimer();
    overlaytoggle();
    time_limit = 5;
    inputElement.disabled = false;
  }
}

function resultDisplay() {
  overlaytext.innerText = "Finish!";
  let score_result = document.createElement("h3");
  let error_result = document.createElement("h3");
  let misstype_result = document.createElement("h3");
  let WPM_result = document.createElement("h3");
  let s = new Set(misstype_letter);
  let ans = [];
  s.forEach((v) => ans.push(v));
  let new_array = misstype.filter(function (i) {
    if (!this[i[1]]) {
      return (this[i[1]] = true);
    }
  });
  WPM_result.innerHTML = "WPM :" + word_count ;
  score_result.innerHTML = "Score : " + score_text.innerText;
  error_result.innerHTML = "Error : " + error_text.innerText;
  misstype_result.innerHTML = "Misstype : " + ans.join(" ");

  overlaytext.appendChild(WPM_result);
  overlaytext.appendChild(score_result);
  overlaytext.appendChild(error_result);
  overlaytext.appendChild(misstype_result);
}

function restartButton() {
  let btn = document.createElement("button");
  btn.innerHTML = "restart";
  btn.style.cssText = "font-weight:700;"
    + "font-size: 1.6rem;"
    + "line-height: 1.5;"
    + "position: relative;"
    + "display: inline-block;"
    + "padding: 0.4rem 1.6rem;"
    + "cursor: pointer;"
    + "webkit-user-select: none;"
    + "moz-user-select: none;"
    + "ms-user-select: none;"
    + "user-select: none;"
    + "webkit-transition: all 0.3s;"
    + "transition: all 0.3s;"
    + "text-align: center;"
    + "vertical-align: middle;"
    + "text-decoration: none;"
    + "letter-spacing: 0.1em;"
    + "color: #F0FFF0;"
    + "border-radius: 1.0rem;"
    +"background-color:#4B0082;";
  overlaytext.appendChild(btn);
  overlaytext.querySelector("button").addEventListener("click", () => {
    window.location.reload();
  });
}

function finishStimer() {
  clearInterval(stimer);
}
