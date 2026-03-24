using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.VolunteerModel;

public class ReceiveOfferModel
{
    [Required(ErrorMessage = "WarehouseId là bắt buộc.")]
    public int WarehouseId { get; set; }

    [Required(ErrorMessage = "ProductId là bắt buộc.")]
    public int ProductId { get; set; }
}
