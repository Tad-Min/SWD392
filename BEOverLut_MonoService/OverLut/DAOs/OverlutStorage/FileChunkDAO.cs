using BusinessObject.OverlutStorageEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.OverlutStorage;

public class FileChunkDAO
{
    public static async Task<IEnumerable<FileChunk>> GetAllFileChunks()
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            return await db.FileChunks.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-GetAllFileChunks: {ex.Message}");
            return new List<FileChunk>();
        }
    }

    public static async Task<FileChunk?> GetFileChunkById(Guid chunkId)
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            return await db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == chunkId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-GetFileChunkById: {ex.Message}");
            return null;
        }
    }

    public static async Task<FileChunk?> CreateFileChunk(FileChunk fileChunk)
    {
        try
        {
            if (fileChunk == null)
                throw new ArgumentNullException(nameof(fileChunk));

            using var db = new OverlutDbStorageContext();
            await db.FileChunks.AddAsync(fileChunk);
            await db.SaveChangesAsync();
            return fileChunk;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-CreateFileChunk: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateFileChunk(FileChunk fileChunk)
    {
        try
        {
            if (fileChunk == null)
                throw new ArgumentNullException(nameof(fileChunk));

            using var db = new OverlutDbStorageContext();
            var existingChunk = await db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == fileChunk.ChunkId);
            if (existingChunk == null) return false;

            existingChunk.SequenceNumber = fileChunk.SequenceNumber;
            existingChunk.Data = fileChunk.Data;

            db.FileChunks.Update(existingChunk);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-UpdateFileChunk: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteFileChunk(Guid chunkId)
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            var fileChunk = await db.FileChunks.FirstOrDefaultAsync(x => x.ChunkId == chunkId);
            if (fileChunk == null) return false;

            db.FileChunks.Remove(fileChunk);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FileChunkDAO-DeleteFileChunk: {ex.Message}");
            return false;
        }
    }
}
