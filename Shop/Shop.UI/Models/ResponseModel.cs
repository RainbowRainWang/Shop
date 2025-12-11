using Shop.UI.Constants;

// 有数据返回时
public class ResponseModel<T>
{
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public int Code { get; set; }

    // 成功响应
    public static ResponseModel<T> Success(T data, string message = Messages.OperationSuccess)
    {
        return new ResponseModel<T>
        {
            Message = message,
            Data = data,
            Code = StatusCodes.Status200OK
        };
    }

    // 失败响应
    public static ResponseModel<T> Error(string message = Messages.OperationFailed, int statusCode = StatusCodes.Status400BadRequest)
    {
        return new ResponseModel<T>
        {
            Message = message,
            Data = default,
            Code = statusCode
        };
    }
}

// 无数据返回时
public class ResponseModel
{
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }

    public static ResponseModel Success(string message = Messages.OperationSuccess)
    {
        return new ResponseModel
        {
            Message = message,
            StatusCode = StatusCodes.Status200OK
        };
    }

    public static ResponseModel Error(string message = Messages.OperationFailed, int statusCode = StatusCodes.Status400BadRequest)
    {
        return new ResponseModel
        {
            Message = message,
            StatusCode = statusCode
        };
    }
}