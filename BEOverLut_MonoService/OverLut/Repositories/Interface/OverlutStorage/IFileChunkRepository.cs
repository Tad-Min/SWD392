using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutStorageEntiy;

namespace Repositories.Interface.OverlutStorage
{
    public interface IFileChunkRepository
    {
        Task<IEnumerable<FileChunk>?> GetAllFileChunks();
        Task<FileChunk?> GetFileChunkById(Guid chunkId);
        Task<FileChunk?> CreateFileChunk(FileChunk fileChunk);
        Task<bool> UpdateFileChunk(FileChunk fileChunk);
        Task<bool> DeleteFileChunk(Guid chunkId);
    }
}
