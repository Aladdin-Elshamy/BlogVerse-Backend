const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
async function register(req,res) {
    try {
        const user = req.body
        if(!isNaN(user.name)){
            res.status(401).send('Registration failed: username must be string');
        }
        const hash = await bcrypt.hash(user.password,2) 
        const newUser = await User.create({...user,password:hash})
        let token = jwt.sign({password:hash,email:user.email},"secret")
        res.status(201).send({
            token,
            message:"user created successfully"
        })
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors)
                .map(err => err.message)
                .join(', ');
            
            console.log('Validation Errors:', errorMessages);
            res.status(400).send({
                message: 'Validation failed',
                errors: errorMessages
            });
        } else {
            console.error('Registration Error:', error);
            res.status(401).send('Registration failed');
        }
    }
}
async function login(req,res) {
    try{
        
        const user = req.body
        const hash = await bcrypt.hash(user.password,2) 
        const findUser = await User.findOne({email:user.email})
        console.log(user,findUser);
        
        if(!findUser){
            return res.status(401).send('invalid credentials');
        }
        const match = await bcrypt.compare(user.password,findUser.password)
        if(match) {
            let token = jwt.sign({password:hash,email:user.email},"secret")
            res.status(201).send({
                token,
                message:"user logged in successfully"
            })
        } else {
            res.status(401).send('invalid credentials');
        }
    } catch(e) {
        console.error(e)
        res.status(401).send('invalid credentials');
    }
    
}

async function getAllUsers(req,res) {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        console.error(e)
        res.status(401).send('not available');
    }
}
async function deleteUser(req,res) {
    try{
        const {email} = req.body
        const deleteUser = await User.deleteOne({username:email})
        res.status(201).send(deleteUser)
    }catch(e){
        console.error(e)
        res.status(401).send('user not found');
    }
    
}
async function editUser(req,res) {
    try{
        const {email,editValue} = req.body
        const user = await User.findOne({username:editValue})
        if(user){
            res.status(400).send('user already exist');
        }else{

            const updatedEmail = await User.updateOne({username:email},{$set:{username:editValue}})
            
            res.status(200).send({
                message:"user was edited successfully", user: await User.findOne({username:editValue})
            })
        }
    }catch(e){
        console.error(e)
        res.status(401).send('user not found');
    }
    
}
module.exports = {register,login,getAllUsers,deleteUser,editUser}