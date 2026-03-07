using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace WebApi.Models.AttachmentModel
{
    public class FileChunkUploadModel
    {
        [Required(ErrorMessage = "Must have AttachmentId")]
        public Guid AttachmentId { get; set; }

        [Required]
        public int SequenceNumber { get; set; }

        [Required(ErrorMessage = "Must have chunk data")]
        public IFormFile FileChunk { get; set; } = null!;

        public bool IsLastChunk { get; set; }
    }
}
