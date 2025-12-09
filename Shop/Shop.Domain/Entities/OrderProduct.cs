namespace Shop.Domain.Entities
{
    public class OrderProduct
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = new Product();

        public int OrderId { get; set; }
        public Order Order { get; set; } = new Order();
    }
}
