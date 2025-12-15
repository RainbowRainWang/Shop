using Shop.Application.Dtos.Stock;

namespace Shop.Application.Dtos.Product
{
    public class GetProductStocksDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public IEnumerable<GetStockDto> Stocks { get; set; } = new List<GetStockDto>();
    }
}
