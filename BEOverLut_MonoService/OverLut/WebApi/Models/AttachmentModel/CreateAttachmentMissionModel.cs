using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AttachmentModel
{
    public class CreateAttachmentMissionModel
    {
        [Required(ErrorMessage = "Must have MissionId")]
        public int MissionId { get; set; }

        [Required(ErrorMessage = "Must have FileSize")]
        public long FileSize { get; set; }

        [Required(ErrorMessage = "Must have FileType")]
        [StringLength(100)]
        public string FileType { get; set; } = null!;
    }
}
