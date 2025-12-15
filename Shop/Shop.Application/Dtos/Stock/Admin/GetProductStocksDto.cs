namespace Shop.Application.Dtos.Stock.Admin
{
    public class GetProductStocksDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<GetStocksDto> Stocks { get; set; } = new List<GetStocksDto>();
    }
}
