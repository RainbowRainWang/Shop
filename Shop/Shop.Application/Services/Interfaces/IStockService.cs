using Shop.Application.Dtos.Stock.Admin;

namespace Shop.Application.Services.Interfaces
{
    public interface IStockService
    {
        public Task<IEnumerable<GetProductStocksDto>> GetProductStocksAsync();
        public Task<GetStocksDto?> CreateStockAsync(CreateStockDto stockDto);
        public Task<IEnumerable<UpdateStockDto>> UpdateStockAsync(IEnumerable<UpdateStockDto> stockDtos);
        public Task<int> DeleteStockAsync(int Id);
    }
}
