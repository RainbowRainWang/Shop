namespace Shop.Application.Dtos.Stock.Admin
{
    public class UpdateStockDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Qty { get; set; }
        public int ProductId { get; set; }
    }
}
