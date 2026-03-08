using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class ProductDTO
{
    public int ProductId { get; set; }

    [Required(ErrorMessage = "ProductName is required")]
    [StringLength(200, ErrorMessage = "ProductName cannot exceed 200 characters")]
    public string ProductName { get; set; } = null!;

    [Required(ErrorMessage = "CategoryId is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Unit is required")]
    [StringLength(50, ErrorMessage = "Unit cannot exceed 50 characters")]
    public string Unit { get; set; } = null!;
}
