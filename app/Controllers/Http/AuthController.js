'use strict'

const User = use('App/Models/User')
const Crossword = use('App/Models/Crossword')
const Answer = use('App/Models/Answer')
const { validate } = use('Validator')

class AuthController {

  async register({request, response}) {
    const crosswords = await Crossword.all()
    const answers = await Answer.all()

    // let data = []
    const crosswordIds = crosswords.rows.map(crossword => {
      return crossword.id
    })

    const answerIds = answers.rows.map(answer => {
      return answer.id
    })

    
    
    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required',
      username: 'required|unique:users'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      if(validation._errorMessages[0].validation == "email"){
        return response.status(500).send({message:"email format required!"})  
      }else if(validation._errorMessages[0].validation == "required"){
        return response.status(500).send({message: `${validation._errorMessages[0].field} required`})
      }else if(validation._errorMessages[0].validation == "unique"){
        return response.status(500).send({message: `${validation._errorMessages[0].field} already used`})
      }
    }

    const {username,email,password} = request.only([
      'username',
      'email',
      'password'
    ])

    const user = await User.create({
      username,
      email,
      password
    })

    await user.crosswords().attach(crosswordIds)
    await user.answers().attach(answerIds)

    user.crosswords = await user.crosswords().fetch()
    user.answers = await user.answers().fetch()

    return response.status(200).send({message: "Register Success", data:user})
  }

}

module.exports = AuthController
