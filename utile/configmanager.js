import fs from 'fs'

import path from 'path'

// path for config setup

console.log('initialzing the config path')
const configPath = 'config.json'
const premiumPath = "db.json"

//load config at startup

let config = {}

if (fs.existsSync(configPath)){
    console.log('config file found...trying to read...')
    try {

        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        console.log('config file read successful !')
    } catch (e){

        console.log('error while reading the config file...verify config.json.')