//Configurando o servidor 
const express = require("express")
const server = express()

//Configurar Servidor  para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar Body do formulário
server.use(express.urlencoded({ extended: true}))

//Configurar a conexão com o BAnco de Dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'a1l2o3n4e5',
    host: 'localhost',
    port: 5432,
    database: 'hemocenter'
})

//Configurando a Template Engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express : server,
    noCache : true,
})

//Configurar Apresentação da página
server.get("/", function (req, res) {
    db.query("select * from donors", function(err, result) {
        if (err) return res.send('Erro de Banco de dados.')

        const donors = result.rows
        return res.render('index.html', { donors })
    })
    
})

server.post("/", function (req, res) {
    //Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send('Todos os campos são obrigatórios!')
    }

    // Coloca valores dentro do banco de dados
    const query = `
    insert into donors ("name", "email", "blood") 
    values ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send('Erro no banco de dados.')

        // fluxo ideal
        return res.redirect("/")
    } )
})


//Ligar o servidor e permitir o acesso na porta 2704
server.listen(2704, function(){
    console.log('Iniciei o servidor!')
})