using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutStorageEntiy;

namespace Services
{
    internal interface IAttachmentStorageService
    {
        Task<byte[]?> GetAttachmentbyId(Guid id);
    }
}
