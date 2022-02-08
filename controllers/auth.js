import User from '../models/user'
import bcrypt from 'bcrypt'
import { hashPassword, comparePassword } from '../utils/auth'

export const register = async (req, res) => {
  const {name, email, password} = req.body

  try {
    const hashedPassword = await hashPassword(password)
   
    const existing = await User.findOne({email}).exec()
    if(existing) return res.status(400).send('User already exist')

    const user =await new User({
        name, email, password: hashedPassword
    }).save()
    console.log('user', user);
  
    return res.send(user)
  } catch (error) {
      return res.send(error)
  }

}

export const login = async (req, res) => {
    const {password, email} = req.body
    try {
        const user = await User.findOne({email}).exec()
        if(!user) return res.status(400).send('No user found')
        const passwordOk = await comparePassword(password, user.password )

        if(passwordOk) {
            user.password= undefined
            return res.send(user)}else {
            res.status(403).send("Email or password error")
        }
    } catch (error) {
        console.log(error);
    }
}