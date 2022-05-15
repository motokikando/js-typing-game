const API_URL = 'https://www.boredapi.com/api/activity/'
const inputElement= document.getElementById('inputText')
const diplayElement = document.getElementById('sentenceDisplay')




//入力操作
inputElement.addEventListener('input', () => {
    let correct = true
    //spanタグを全て取得してリストにする。
    const arrayAPI = diplayElement.querySelectorAll('span')
    console.log(arrayAPI)
    //split('')で入力した文字列を配列として管理
    const arrayValue = inputElement.value.split('')
    //arrayAPIの文字とarrayValueの判定
    arrayAPI.forEach((charSpan, index) => {
        const input_char = arrayValue[index]
        if (input_char == null){
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
        }
    })
    if (correct){renderNewSentence()}
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


renderNewSentence()