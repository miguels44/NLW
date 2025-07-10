const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

//minha chave: AIzaSyCGcnI-yBfJ_WzeQ-8lYV_TDtvnXJOKzvc
const askAI = async (question, game, apiKey) => {
    const model = 'gemini-2.5-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `Olá, tenho esse jogo ${game} e queria saber ${question}`

    const contents = [{
        parts:[{
            text: pergunta
        }]
    }]

    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents
        })
    })
    const data = await response.json()
    console.log({ data })
    return
}

const sendForm = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == "" || game == "" || question == "") {
        alert('Todos os campos precisão ser preenchidos!')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Aguarde...'
    askButton.classList = 'loading'

    try{
        //parte de perguntar a IA
        await askAI(question, game, apiKey)
    }catch(error){
        console.log('Erro: ', error)
    }finally{
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }

}
form.addEventListener('submit', sendForm)
