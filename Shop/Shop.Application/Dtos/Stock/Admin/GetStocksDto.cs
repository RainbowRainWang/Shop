namespace Shop.Application.Dtos.Stock.Admin
{
    public class GetStocksDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Qty { get; set; }
    }
}
