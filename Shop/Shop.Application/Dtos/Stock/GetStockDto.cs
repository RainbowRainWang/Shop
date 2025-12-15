namespace Shop.Application.Dtos.Stock
{
    public class GetStockDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool InStock { get; set; }
    }
}
