using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutStorageEntiy;
using DAOs;
using DAOs.OverlutStorage;
using Repositories.Interface.OverlutStorage;

namespace Repositories.OverlutStorage
{
    public class FileChunkRepository : IFileChunkRepository
    {
        private readonly OverlutDbStorageContext _db;
        private readonly FileChunkDAO _fileChunkDAO;

        public FileChunkRepository(OverlutDbStorageContext db)
        {
            _db = db;
            _fileChunkDAO = new FileChunkDAO(db);
        }
        public async Task<IEnumerable<FileChunk>?> GetAllFileChunks() => await _fileChunkDAO.GetAllFileChunks();
        public async Task<FileChunk?> GetFileChunkById(Guid chunkId) => await _fileChunkDAO.GetFileChunkById(chunkId);
        public async Task<FileChunk?> CreateFileChunk(FileChunk fileChunk) => await _fileChunkDAO.CreateFileChunk(fileChunk);
        public async Task<bool> UpdateFileChunk(FileChunk fileChunk) => await _fileChunkDAO.UpdateFileChunk(fileChunk);
        public async Task<bool> DeleteFileChunk(Guid chunkId) => await _fileChunkDAO.DeleteFileChunk(chunkId);
    }
}
