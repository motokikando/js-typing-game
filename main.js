const API_URL = 'https://www.boredapi.com/api/activity/'
const inputElement= document.getElementById('inputText')
const diplayElement = document.getElementById('sentenceDisplay')
const timer_text = document.getElementById('curr_timer')
const error_text = document.getElementById('curr_errors')
const accuracy_text = document.getElementById('curr_accuracy')
const score_text = document.getElementById('curr_score')
const typingSound = new Audio("./audio/typingsound.mp3")
const correctSound = new Audio("./audio/correctsound.mp3")
const wrongSound = new Audio("./audio/wrongsound.mp3")

let time_limit = 10;
let accuracy = 0;
let errors = 0;
let scores = 0;


//入力操作
inputElement.addEventListener('input', () => {  //inputするたびにアロー関数{}内の処理が呼ばれる
    let correct = true
    let errors = 0
//入力音をつける
    typingSound.play();
    typingSound.currentTime = 0;

    //spanタグを全て取得してリストにする。
    const arrayAPI = diplayElement.querySelectorAll('span')
    console.log(arrayAPI)
    //split('')でinputElementに入力された文字列を分解し、配列として管理
    const arrayValue = inputElement.value.split('')  
/*↓arrayAPI(問題文をspanにしたもの)とarrayValue(入力した文字列をspanにしたもの)
比較し、合っているか確認する
*/
    arrayAPI.forEach((charSpan, index) => {
        const input_char = arrayValue[index] 
        if (input_char == null){   //何も入力されていない場合
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false
        } else if( input_char === charSpan.innerText){ //入力一致
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        } else { //入力ミス
            charSpan.classList.remove('correct')
            charSpan.classList.add('incorrect')
            correct = false
            errors += 1
            error_text.innerText = errors
            wrongSound.play();
            wrongSound.currentTime = 0;
        }
    })
    if (correct){
        scores += 1
        renderNewSentence()
        score_text.innerText = scores
        correctSound.play();
        correctSound.currentTime = 0;
    }
})

function getAPI(){
    return fetch(API_URL)
    .then(response => response.json())
    .then(data => data.activity)
}

//非同期処理
async function renderNewSentence(){
    // 実行完了まで待つ非同期関数を定義
    const sentence = await getAPI() // 呼び出した文字列を格納
    diplayElement.innerHTML = '' //一度要素内を空にする
    sentence.split('').forEach( char => {
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
    resetValues();
    renderNewSentence();
    timer = setInterval(updateTimer, 1000);
}

function finishGame(){
    clearInterval(timer)
    inputElement.disabled = true
    diplayElement.innerText = "Finish"

}

//リスタートボタン 
function resetValues(){
    inputElement.disabled = false
    inputElement.innerHTML = ""
    error_text.innerText = 0
    score_text.innerText = 0

    time_limit = 30
    timer_text.innerText = time_limit

}
