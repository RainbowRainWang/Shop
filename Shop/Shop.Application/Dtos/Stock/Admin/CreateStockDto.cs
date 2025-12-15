namespace Shop.Application.Dtos.Stock.Admin
{
    public class CreateStockDto
    {
        public string Description { get; set; } = string.Empty;
        public int Qty { get; set; }
        public int ProductId { get; set; }
    }
}
