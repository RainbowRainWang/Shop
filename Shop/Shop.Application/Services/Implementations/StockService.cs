using Microsoft.EntityFrameworkCore;
using Shop.Application.Dtos.Stock;
using Shop.Application.Services.Interfaces;
using Shop.Database;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Implementations
{
    public class StockService : IStockService
    {
        private readonly ShopDbContext _shopDbContext;

        public StockService(ShopDbContext shopDbContext)
        {
            _shopDbContext = shopDbContext;
        }

        public async Task<IEnumerable<GetProductStocksDto>> GetProductStocksAsync()
        {
            return await _shopDbContext.Products
                .AsNoTracking()
                .Include(p => p.Stocks)
                .Select(p => new GetProductStocksDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Stocks = p.Stocks.Select(s => new GetStocksDto
                    {
                        Id = s.Id,
                        Description = s.Description,
                        Qty = s.Qty
                    })  
                })
                .ToListAsync();
        }

        public async Task<GetStocksDto?> CreateStockAsync(CreateStockDto stockDto)
        {
            // Check if the product exists
            if (!await _shopDbContext.Products.AsNoTracking().AnyAsync(p => p.Id == stockDto.ProductId))
            {
                return null;
            }

            Stock stock = new Stock
            {
                Description = stockDto.Description,
                Qty = stockDto.Qty,
                ProductId = stockDto.ProductId
            };

            _shopDbContext.Stocks.Add(stock);
            await _shopDbContext.SaveChangesAsync();

            return new GetStocksDto
            {
                Id = stock.Id,
                Description = stock.Description,
                Qty = stock.Qty
            };
        }

        public async Task<IEnumerable<UpdateStockDto>> UpdateStockAsync(IEnumerable<UpdateStockDto> stockDtos)
        {
            var stocks = new List<Stock>();

            foreach (var stockDto in stockDtos)
            {
                stocks.Add(new Stock
                {
                    Id = stockDto.Id,
                    Description = stockDto.Description,
                    Qty = stockDto.Qty,
                    ProductId = stockDto.ProductId
                });
            }

            _shopDbContext.Stocks.UpdateRange(stocks);
            await _shopDbContext.SaveChangesAsync();

            return stockDtos;
        }

        public async Task<int> DeleteStockAsync(int Id)
        {
            int result = -1;
            var stock = await _shopDbContext.Stocks.FindAsync(Id);

            if (stock != null)
            {
                _shopDbContext.Stocks.Remove(stock);
                result = await _shopDbContext.SaveChangesAsync();
            }

            return result;
        }
    }
}
