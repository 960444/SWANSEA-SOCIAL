import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import Template from './../template'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

//Init application
const app = express()

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(compression())
app.use(helmet())
app.use(cors())

//Routes
app.use('/', authRoutes)
app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.status(200).send(Template())
})

app.use((err, res) => {
    if(err.name === "UnauthorizedError") {
        res.status(401).json({"error": err.name + ": " + err.message})
    } else if (err) {
        res.status(400).json({"error": err.name + ": " + err.message})
    }
})

export default app

