import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import Template from './../template'
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
app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.status(200).send(Template())
})



export default app