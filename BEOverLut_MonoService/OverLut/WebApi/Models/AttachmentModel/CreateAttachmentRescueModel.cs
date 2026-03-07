using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AttachmentModel
{
    public class CreateAttachmentRescueModel
    {
        [Required(ErrorMessage = "Must have RescueRequestId")]
        public int RescueRequestId { get; set; }

        [Required(ErrorMessage = "Must have FileSize")]
        public long FileSize { get; set; }

        [Required(ErrorMessage = "Must have FileType")]
        [StringLength(100)]
        public string FileType { get; set; } = null!;
    }
}
