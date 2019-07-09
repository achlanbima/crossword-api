'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Answer = use('App/Models/Answer')
const UserAnswer = use('App/Models/UserAnswer')
const UserCrossword = use('App/Models/UserCrossword')

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
    

    response.status(200).json({
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
  async create ({ request, response, view }) {
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
  async show ({ params, request, response, view }) {
    const answers = await Answer.query().where('crossword_id',params.id).with('user_answers').fetch()
    // const userAnswers = await UserAnswer.query().where('user_id',1).fetch()

    answers.rows.map((row, index) => {
      if(row.is_clue){
        row.is_clue = true  
      }else{
        row.is_clue = false  
      }
      row.indexes = row.indexes.split(' ')  
    })


    response.status(200).json({
      message: "Successfully retrieved answers with related crosswords",
      data: ({answers})
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
  async update ({ params, request, response }) {
    const answers = await Answer.query().where('crossword_id',params.id).fetch()
    const userAnswer = ['G','A','J','A','H','','','','','','S','','','','','','','','','','','','','','']

    let answerIndex = [], answerId = [], rightAnswer = [], ownAnswer = [], finished 
    
    answers.rows.map(answer => {
      answerIndex.push((answer.indexes).split(' '))
      answerId.push(answer.id)
      rightAnswer.push(answer.answer)
      // console.log(answer.indexes.split(' '));
    })
    // console.log(rightAnswer);

    
    for(let i = 0; i < answerIndex.length; i++){
        let toSubmit = ""
        for(let j = 0; j < answerIndex[i].length; j++){
            for(let k = 0; k < userAnswer.length; k++){
                if(answerIndex[i][j] == k){
                    if(userAnswer[k]!=''){
                        toSubmit+=userAnswer[k]
                      }else{
                          toSubmit+=" "
                      }
                }
              }
            }
      await UserAnswer.query().where('user_id',"2").andWhere('answer_id',answerId[i]).update({answer:toSubmit})
    }
    
    const answerFromUser = await Answer.query().where('crossword_id',params.id).with('user_answers', ua => ua.where('user_id','2')).fetch()
    answerFromUser.rows.map( a => {
      a.$relations.user_answers.rows.map( rel => {
        console.log(rel.answer);
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
      await UserCrossword.query().where('user_id',"2").andWhere('crossword_id',params.id).update({is_finished:true})
    }else{
      await UserCrossword.query().where('user_id',"2").andWhere('crossword_id',params.id).update({is_finished:false})
    }      
    response.status(200).json({
      message: "Successfully updated answers with related crosswords",
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
