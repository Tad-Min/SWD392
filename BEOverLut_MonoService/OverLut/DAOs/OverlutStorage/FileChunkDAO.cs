using BusinessObject.OverlutStorageEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.OverlutStorage;

public class FileChunkDAO
{
    private readonly OverlutDbStorageContext _db;

    public FileChunkDAO(OverlutDbStorageContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<FileChunk>?> GetAllFileChunks()
    {
        try
        {
            return await _db.FileChunks.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-GetAllFileChunks: {ex.Message}");
            return null;
        }
    }

    public async Task<FileChunk?> GetFileChunkById(Guid chunkId)
    {
        try
        {
            return await _db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == chunkId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-GetFileChunkById: {ex.Message}");
            return null;
        }
    }

    public async Task<FileChunk?> CreateFileChunk(FileChunk fileChunk)
    {
        try
        {
            if (fileChunk == null)
                throw new ArgumentNullException(nameof(fileChunk));

            await _db.FileChunks.AddAsync(fileChunk);
            await _db.SaveChangesAsync();
            return fileChunk;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-CreateFileChunk: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateFileChunk(FileChunk fileChunk)
    {
        try
        {
            if (fileChunk == null)
                throw new ArgumentNullException(nameof(fileChunk));

            var existingChunk = await _db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == fileChunk.ChunkId);
            if (existingChunk == null) return false;

            existingChunk.SequenceNumber = fileChunk.SequenceNumber;
            existingChunk.Data = fileChunk.Data;

            _db.FileChunks.Update(existingChunk);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-UpdateFileChunk: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteFileChunk(Guid chunkId)
    {
        try
        {
            using var _db = new OverlutDbStorageContext();
            var fileChunk = await _db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == chunkId);
            if (fileChunk == null) return false;

            _db.FileChunks.Remove(fileChunk);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-DeleteFileChunk: {ex.Message}");
            return false;
        }
    }
}
