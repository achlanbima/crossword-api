'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    response.status(error.status).send({status:error.status,message:error.message,name:error.name})
    if(error.name == 'InvalidJwtToken'){
      response.status(error.status).send({status:error.status, message:"Token Salah"})
    }
    if(error.name == 'UserNotFoundException'){
      response.status(error.status).send({status:error.status, message:"Email/Password Salah"})
    }
    if(error.name == 'PasswordMisMatchException'){
      response.status(error.status).send({status:error.status, message:"Password Salah"})
    }
    if(error.name == 'HttpException'){
      response.status(error.status).send({status:error.status, message:"Gagal mengambil data dari server"})
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
