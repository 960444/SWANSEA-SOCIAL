import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from '.././helpers/dbErrorHandler'
import { useReducer } from 'react'

//Create a new user
const create = async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Registration succesful!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//List all users
const list = async (req,res) => {
    try {
        const users = await User.find().select('name email course year updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
    
}

//Retrieve a user by id
const userById = async (req,res,next, id) => {
    try {
        let user = await User.findById(id)
        if(!user) {
            return res.status('400').json(
                {error: 'User does not exist'}
            )
        } else {
            req.profile = user
            next()
        }
    } catch (err) {
        return res.status('400').json(
            {error: 'Could not retrieve user'}
        )
    }
}

//Display a user by ID
const read = (req,res) => {
    //Removing sensitive information
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

//Edit a user
const update = async (req,res) => {
    try {
        let user = req.profile
        //Apply changes
        user = extend(user, req.body)
        user.update = Date.now()
        await user.save()
        //Remove sensitive information
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch(err) {
        res.status('400').json(
            {error: errorHandler.getErrorMessage(err)}
        )
    }
}

const remove = async (req,res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        res.json(deletedUser)
    } catch (err) {
        res.status('400').json(
            {error: errorHandler.getErrorMessage(err)}
        )
    }
}

export default {create, list, userById, read, update, remove}