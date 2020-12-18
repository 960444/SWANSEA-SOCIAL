import mongoose from 'mongoose'
import config from '../config/config'

const uri = config.mongoUri

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(uri, { 
            useNewUrlParser: true, 
            useCreateIndex: true, 
            useUnifiedTopology: true 
        }).then(() => {
            console.log('Database connection succesful')
        }).catch(err => {
            console.error('Database connection failed')
        })
    }

}

export default Database