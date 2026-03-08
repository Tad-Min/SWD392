using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class CategoryDTO
{
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "CategoryName is required")]
    [StringLength(100, ErrorMessage = "CategoryName cannot exceed 100 characters")]
    public string CategoryName { get; set; } = null!;
}
