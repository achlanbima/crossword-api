'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Crossword = use('App/Models/Crossword')
const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with crosswords
 */
class CrosswordController {
  /**
   * Show a list of all crosswords.
   * GET crosswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    const userId = await auth.getUser()
    // console.log(userId.id);
    
    const crossword = await Crossword.query().with('user_crossword', uc => uc.where('user_id',userId.id)).fetch();
    const user = await User.query().select('id', 'username').where('id',userId.id).first()

    crossword.rows.map((cw) => {
      cw.$relations.user_crossword.rows.map((ucw) => {
        if(ucw.is_finished){
          ucw.is_finished = true
        }else{
          ucw.is_finished = false
        }
      })
    })

    

    response.status(200).json({
      message: "Successfully retrieved crosswords",
      data: crossword,
      userData : user
    })
  }

  /**
   * Render a form to be used for creating a new crossword.
   * GET crosswords/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    const users = await User.all()

    const userIds = users.rows.map(user => {
      return user.id
    })

    const {name,total_column} = request.only(['name','total_column'])

    const crossword = await Crossword.create({
      name,
      total_column
    })

    await crossword.users().attach(userIds)

    return response.status(200).send({message: "New Crosswords created", data:crossword})
  }

  /**
   * Create/save a new crossword.
   * POST crosswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single crossword.
   * GET crosswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing crossword.
   * GET crosswords/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update crossword details.
   * PUT or PATCH crosswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a crossword with id.
   * DELETE crosswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CrosswordController
