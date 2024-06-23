// modulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

// modulos internos
const fs = require('fs');
 
console.log('Iniciamos o Accounts');

operation()

function operation(){
    inquirer
        .prompt([
            {
                type:"list",
                name:"action",
                message:"O que você deseja fazer?",
                choices:['Criar conta','Consulta saldo','Depositar','Sacar','Sair',]

            },
        ]).then((answer) =>{

            const action = answer['action']

            if(action === 'Criar conta'){
                createAcconunt()
            }

            else if( action === "Consulta saldo"){
                getAccountBalance()
            }

            else if(action === "Depositar"){
                deposit()
            }

            else if(action === "Sacar"){
                widthdraw()
            }

            else if(action === "Sair"){
                console.log(chalk.bgBlue.black('Obrigado por usar o Account!'))

                process.exit()

            }



        }).catch((err) => console.log(err))
}

// creat an acconunt

function createAcconunt(){ 

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

    buildAccount()

}

function buildAccount(){
    inquirer.prompt([
        {
            name:'AccountName',
            menssage:'Digite um nome para a sua conta: '
        }
]).then(answer =>{
    
    const AccountNames = answer['AccountName']

    console.info(AccountNames)

    if(!fs.existsSync('Accounts')){
        fs.mkdirSync('Accounts')
    }

    if(fs.existsSync(`Accounts/${AccountNames}.json`)){

        console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))

        buildAccount()
        return
    }

    fs.writeFileSync(`Accounts/${AccountNames}.json` , '{"balance": 0}', (err) =>{
        console.log(err)
    } )

    console.log(chalk.green('Parabéns, a sua conta foi criada!'))
    operation()

}).catch(err => console.log(err))
}

// add an amount to user account

function deposit(){

    inquirer.prompt([{
        name:'AccountName',
        message:'Qual o nome da sua conta?'
    }])
    .then((answer)=>{

        const AccountName = answer['AccountName']

        if(!checkAccount(AccountName)){
            return deposit()
        }

        inquirer.prompt([{
            name:'amount',
            message:'Quantos deseja deposita?',
        }]).then((answer) =>{

            const amount = answer['amount']

            addAmount(AccountName, amount)
            operation()





        }).catch(err => console.log(err))

    })
    .catch(err => console.log(err))


}

function checkAccount(AccountName){

    if(!fs.existsSync(`accounts/${AccountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true

}

function addAmount(AccountName,amount){

    const Accoundata = getAccount(AccountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente mais tarde!'))
        return deposit()
    }

    Accoundata.balance = parseFloat(amount) + parseFloat(Accoundata.balance)

    fs.writeFileSync(

        `Accounts/${AccountName}.json`,

        JSON.stringify(Accoundata),

        function (err){
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))

    console.log(chalk.bgGreenBright.white(`Novo Saldo: R$${Accoundata.balance}  `))
    
}


function getAccount(AccountName){

    const accountJSON = fs.readFileSync(`Accounts/${AccountName}.json`,{
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

// show account balace

function getAccountBalance(){
    inquirer.prompt([{
        name:'AccountName',
        message:'Qual o nome da sua conta?'
    }]).then((answer)=>{

        const AccountName = answer['AccountName']

        if(!checkAccount(AccountName)){
            return getAccountBalance()
        }

        const Accoundata = getAccount(AccountName)

        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${Accoundata.balance}`))

        operation()


    }).catch(err => console.log(err))
}


// widthdraw an amount from user account

function widthdraw(){
    inquirer.prompt([{
        name:"AccountName",
        message: "Qual o nome da sua conta?"
    }]).then((answer)=>{

        const AccountName = answer['AccountName']

        if(!checkAccount(AccountName)){
            return widthdraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quantos você deseja sacar???'
        }]).then((answer)=>{
            const amount = answer['amount']

            removeAmount(AccountName,amount)

        }).catch(err => console.log(err))


    }).catch(err => console.log(err))
}


function removeAmount(AccountName,amount){

    const Accoundata = getAccount(AccountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))

        return widthdraw()
    }
    
    if(Accoundata.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponivel!'))

        return widthdraw()
    }

    Accoundata.balance = parseFloat(Accoundata.balance) - parseFloat(amount)

    fs.writeFileSync(
        `Accounts/${AccountName}.json`,
        JSON.stringify(Accoundata),
        function (err){
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
    
    console.log(chalk.bgGreenBright.white(`Novo Saldo: R$${Accoundata.balance}  `))

    operation()

}