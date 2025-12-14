using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos.Stock;
using Shop.Application.Services.Interfaces;
using Shop.UI.Constants;
using Shop.UI.Filters;

namespace Shop.UI.Areas.Admin.Controllers
{
    [Route("admin/stocks")]
    [TypeFilter<ApiExceptionFilter>]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        // GET: admin/stocks
        [HttpGet]
        public async Task<ResponseModel<IEnumerable<GetProductStocksDto>>> GetProductStocksAsync()
        {
            var productStocks = await _stockService.GetProductStocksAsync();
            return ResponseModel<IEnumerable<GetProductStocksDto>>.Success(productStocks);
        }

        // POST: admin/stocks
        [HttpPost]
        public async Task<ResponseModel<GetStocksDto?>> PostStockAsync([FromBody] CreateStockDto stockDto)
        {
            var stock = await _stockService.CreateStockAsync(stockDto);

            // Check if the product exists
            if (stock == null)
            {
                return ResponseModel<GetStocksDto?>.Error(Messages.ProductNotExists, StatusCodes.Status404NotFound);
            }

            return ResponseModel<GetStocksDto?>.Success(stock);
        }

        // PUT: admin/stocks
        [HttpPut]
        public async Task<ResponseModel<IEnumerable<UpdateStockDto>>> PutStockAsync([FromBody] IEnumerable<UpdateStockDto> stockDtos)
        {
            var stocks = await _stockService.UpdateStockAsync(stockDtos);
            return ResponseModel<IEnumerable<UpdateStockDto>>.Success(stocks);
        }

        // DELETE: admin/stocks/{id}
        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteStockAsync([FromRoute] int id)
        {
            var result = await _stockService.DeleteStockAsync(id);

            if (result <= 0)
            {
                return ResponseModel.Error(Messages.DataNotFound, StatusCodes.Status404NotFound);
            }

            return ResponseModel.Success();
        }
    }
}
