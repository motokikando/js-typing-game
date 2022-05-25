const API_URL = 'https://www.boredapi.com/api/activity/'
const inputElement= document.getElementById('inputText')
const diplayElement = document.getElementById('sentenceDisplay')
const timer_text = document.getElementById('curr_timer')
const error_text = document.getElementById('curr_errors')
const accuracy_text = document.getElementById('curr_accuracy')
const score_text = document.getElementById('curr_score')
const overlay = document.getElementById("fullOverlay")
const overlaytext = document.getElementById("overlaytext")
const overlayresult = document.getElementById("overlaytext2")
const typingSound = new Audio("./audio/typingsound.mp3")
const correctSound = new Audio("./audio/correctsound.mp3")
const wrongSound = new Audio("./audio/wrongsound.mp3")


let IsGame = false;

let time_limit = 10;
let accuracy = 0;
let errors = 0;
let errorstate = [];
let scores = 0;
let first_countdown = 3;

let misstype = [];

document.addEventListener('keypress', setcarsol);

function setcarsol(){
    inputElement.focus();
    inputElement.setSelectionRange(-1,-1);
}

//入力操作
inputElement.addEventListener('input', () => {
    let correct = true
    typingSound.play();
    typingSound.currentTime = 0;

    const arrayAPI = diplayElement.querySelectorAll('span')
    const arrayValue = inputElement.value.split('')
    arrayAPI.forEach((charSpan, index) => {
        const input_char = arrayValue[index]
        if (input_char == null){
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false
        } else if( input_char === charSpan.innerText){ //入力一致
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
            adderror(index,0)
        } else { //入力ミス
            charSpan.classList.remove('correct')
            charSpan.classList.add('incorrect')
            correct = false
            wrongSound.play();
            wrongSound.currentTime = 0;
            // misstype.push([charSpan.innerText,input_char])
            // adderror(index,1);
        }
    })
    if (correct){
        scores += 1
        renderNewSentence()
        score_text.innerText = scores
        correctSound.play();
        correctSound.currentTime = 0;
    }
    console.log(errorstate);
})

function getAPI(){
    return fetch(API_URL)
    .then(response => response.json())
    .then(data => data.activity)
}

function adderror(index,num){
    if(num){
        if(errorstate[index]!=1){
            errors+=1
            error_text.innerText = errors;
        }
        errorstate[index]=1;
    }else if(errorstate[index]==-1){
        errorstate[index]=0;
    }
}

//非同期処理
async function renderNewSentence(){
    // 実行完了まで待つ非同期関数を定義
    const sentence = await getAPI() // 呼び出した文字列を格納
    diplayElement.innerHTML = '' //一度要素内を空にする
    errorstate = [];
    sentence.split('').forEach( char => {
        errorstate.push(-1);
        const charSpan = document.createElement('span') //spanタグの作成
        charSpan.innerText = char //spanタグ内のテキストにchar文字を挿入
        diplayElement.appendChild(charSpan)
    })
    inputElement.value = null
}


function updateTimer(){
    if (time_limit > 0 ){
        time_limit--;
        timer_text.innerText = time_limit + "s";
    }
    else {finishGame()}
}

function startGame(){
    if(!IsGame){
        inputElement.disabled = true;
        overlaytoggle();
        startTimer();
        loadmsg();
        resetValues();
        renderNewSentence();
        IsGame = true;
        timer = setInterval(updateTimer, 1000);
    }
}

function finishGame(){
    clearInterval(timer)
    IsGame = false;
    inputElement.disabled = true
    diplayElement.innerText = "Finish"
    let new_array = misstype.filter(function (i) {
        if (!this[i[1]]) {
            return this[i[1]] = true;
        }
    });
    console.log(new_array);
    console.log(misstype)
}


//リスタートボタン
function resetValues(){
    inputElement.innerHTML = ""
    error_text.innerText = 0
    score_text.innerText = 0
    first_countdown = 5
    time_limit = 30
    errors = 0
    timer_text.innerText = time_limit
}
function ableinput(){
    inputElement.disabled = false;
}

function loadmsg(){
    overlaytext.innerText = ("Loading...");
}

function overlaytoggle(){
    overlay.classList.toggle("click");
    overlaytext.classList.toggle("clickedtext");
}

function startTimer(){
    stimer = setInterval(countdown, 1000);
}

function countdown(){
    if(first_countdown>0){
        overlaytext.innerText = first_countdown;
        first_countdown--;
        time_limit=31;
    }else if(first_countdown==0){
        overlaytext.innerText = "Start!";
        first_countdown--;
        time_limit=31;
    }else{
        overlaytext.innerText = "";
        finishStimer();
        overlaytoggle();
        time_limit=31;
        inputElement.disabled = false;
    }
}

function resultDisplay(){

}

function finishStimer(){
    clearInterval(stimer);
}