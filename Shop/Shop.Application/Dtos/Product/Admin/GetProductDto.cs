namespace Shop.Application.Dtos.Product.Admin
{
    public class GetProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }
}
