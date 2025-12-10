using Microsoft.AspNetCore.Mvc;
using Shop.UI.Constants;
using Shop.UI.Models;

namespace Shop.UI.Controllers.Admin
{
    public class BaseController : ControllerBase
    {
        public ActionResult<ResponseModel> Success(string message = Messages.OperationSuccess, object? data = null)
        {
            return Ok(new ResponseModel
            {
                Code = StatusCodes.Status200OK,
                Message = message,
                Data = data ?? new { }
            });
        }

        public ActionResult<ResponseModel> Fail(string message = Messages.OperationFailed, object? data = null)
        {
            return Ok(new ResponseModel
            {
                Code = StatusCodes.Status500InternalServerError,
                Message = message,
                Data = data ?? new { }
            });
        }
    }
}
