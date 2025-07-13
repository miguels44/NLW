const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) =>{
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

// AIzaSyBjJBbgPW7XAdUVGKTMCSXlFvMj9F5Tr3A
const askAI = async (question, game, apiKey) => {
    const model = 'gemini-2.5-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const query = `
        ## Especialidade
        Você é um assistente meta, especialista, no jogo ${game}

        ## Tarefa
        Você precisa responder o usuário com base em todo o seu conhecimento em torno do jogo, ou seja, duvidas gerais, builds, dicas, ou qualquer outra coisa relacionada ao jogo.

        ## Regra
        - Se você não souber a resposta, apenas responda com 'Não sei.'. Não tente inventar uma resposta.
        - Se a pergunta do usuário não estiver relacionada diretamente ao jogo selecinado, responda com 'Essa pergunta não tem relação com este jogo.'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual do jogo, baseada na data atual, para dar uma resposta coerente.
        - Nunca responda sobre qualquer coisa que você não tenha certeza se está ou não no patch atual.
        - Apenas responda coisas relacionadas às DLC's quando o usuário pedir, caso contrário, mantenha-se no jogo base(sem nenhuma DLC).

        ## Resposta
        - Nunca enrole ou adicione coisas desnecessárias nas respostas, seja direto e conciso. 
        - Responda em markdown.
        - Não precisa fazer saudções ou despedidas nas respostas. Apenas responda o usuário.

        -------
        Aqui está a pergunta do usuário: ${question}
    `

    const contents = [{
        role : 'user',
        parts:[{
            text: query
        }]
    }]
    const tools = [{
        google_search:{}
    }]

    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    askButton.disabled = true
    askButton.textContent = 'Aguarde...'
    askButton.classList = 'loading'

    try{
        const text = await askAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    }catch(error){
        console.log('Erro: ', error)
    }finally{
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }

}
form.addEventListener('submit', sendForm)
