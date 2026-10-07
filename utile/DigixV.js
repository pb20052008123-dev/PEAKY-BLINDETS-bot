import readline from 'readline'

export default async function deployAsPremium(){

    const key = "D07895461fdgdrq3ez8aaeqQ"

    const  rl = readline.createInterface({

        input: process.stdin,

        output: process.stdout,
    })
return new Promise((resolve) => {


    rl.question(' Do you have password for an admin Purchase? y/n ?', (response) => {

        response = response.toLowerCase()
        rl.close()

        if (response == 'y'){
            rl.question('please type the password here ', (password) => {
                rl.close()
                if (password === key){