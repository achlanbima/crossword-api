'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Answer = use('App/Models/Answer')
const UserAnswer = use('App/Models/UserAnswer')
const UserCrossword = use('App/Models/UserCrossword')
const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with answers
 */
class AnswerController {
  /**
   * Show a list of all answers.
   * GET answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const answer = await Answer.query().with('crossword', c => c.select('id','name')).fetch()
    

    response.status(200).send({
      message: "Successfully retrieved crosswords",
      data: answer
    })
  }

  /**
   * Render a form to be used for creating a new answer.
   * GET answers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view, params }) {

    const users = await User.all()

    const userIds = users.rows.map(user => {
      return user.id
    })

    const {number,question,answer,is_clue,indexes,type} = request.all();
    const answers = await Answer.create({
      crossword_id: params.id,
      number,
      question,
      answer,
      is_clue,
      indexes,
      type
    })   

    await answers.users().attach(userIds)

    return response.status(200).send({message: "New Answers created", data:answers})
  }

  /**
   * Create/save a new answer.
   * POST answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

  }

  /**
   * Display a single answer.
   * GET answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    // const userLogin = (await auth.getUser()).id
    const answers = await Answer.query().where('crossword_id',params.id).fetch()
    // const userAnswers = await UserAnswer.query().where('user_id',1).fetch()
    
    
    let availableIndexes = []
    answers.rows.map((row, index) => {
      if(row.is_clue){
        row.is_clue = true  
      }else{
        row.is_clue = false  
      }
      row.indexes = row.indexes.split(' ')
      availableIndexes.push(row.indexes)
    })

    response.status(200).json({
      message: "Successfully retrieved answers with related crosswords",
      data: ({ answers, availableIndexes})
    })
  }

  /**
   * Render a form to update an existing answer.
   * GET answers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update answer details.
   * PUT or PATCH answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response , auth }) {
    const userId = await auth.getUser()
    const answers = await Answer.query().where('crossword_id',params.id).fetch()
    
    let userAnswer = request.only(['answers'])
    userAnswer = userAnswer.answers

    let answerIndex = [], answerId = [], rightAnswer = [], ownAnswer = [], finished 
    
    answers.rows.map(answer => {
      answerIndex.push((answer.indexes).split(' '))
      answerId.push(answer.id)
      rightAnswer.push(answer.answer)
      // console.log(answer.indexes.split(' '));
    })
    // console.log(userAnswer.answers);

    
    for(let i = 0; i < answerIndex.length; i++){
        let toSubmit = ""
        for(let j = 0; j < answerIndex[i].length; j++){
            for(let k = 0; k < userAnswer.length; k++){
                if(answerIndex[i][j] == k){
                    if(userAnswer[k]!=null){
                        toSubmit+=userAnswer[k]
                      }else{
                        toSubmit+=" "
                      }
                }
              }
            }
            
      await UserAnswer.query().where('user_id',userId.id).andWhere('answer_id',answerId[i]).update({answer:toSubmit})
      // console.log(toSubmit);
    }
    
    
    const answerFromUser = await Answer.query().where('crossword_id',params.id).with('user_answers', ua => ua.where('user_id',userId.id)).fetch()
    
    answerFromUser.rows.map( a => {
      a.$relations.user_answers.rows.map( rel => {
        // console.log(rel.answer);
        ownAnswer.push(rel.answer)
      })
    })
    
    for(let i = 0; i < rightAnswer.length; i++){
      if(rightAnswer[i]!=ownAnswer[i]){
        finished = false
        break;
      }else{
        finished = true
      }
    }
    if(finished){
      await UserCrossword.query().where('user_id',userId.id).andWhere('crossword_id',params.id).update({is_finished:true})
    }else{
      await UserCrossword.query().where('user_id',userId.id).andWhere('crossword_id',params.id).update({is_finished:false})
    }      
    response.status(200).send({
      message: "Successfully submitted answers",
      data:{ownAnswer, finished}
    })
  }

  /**
   * Delete a answer with id.
   * DELETE answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AnswerController
