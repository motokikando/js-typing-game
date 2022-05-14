const API_URL = 'https://www.boredapi.com/api/activity/'
const inputElement = document.getElementById('inputSentence')
const diplayElement = document.getElementById('sentenceDisplay')









function getAPI(){
    fetch(API_URL)
    .then(response => response.json())
    .then(data => data.activity)
}

//非同期処理
async function renderNewSentence(){
    // 実行完了まで待つ非同期関数を定義
    const sentence = await getAPI() // 呼び出した文字列を格納
    sentence.split('').forEach( char => {
        const charSpan = document.createElement('span') //spanタグの作成
        charSpan.innerText = char //spanタグ内のテキストにchar文字を挿入
    })
    inputElement.value = null
}