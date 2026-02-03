using BusinessObject.OverlutStorageEntiy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DAOs;

public partial class OverlutDbStorageContext : DbContext
{
    public OverlutDbStorageContext()
    {
    }

    public OverlutDbStorageContext(DbContextOptions<OverlutDbStorageContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attachment> Attachments { get; set; }

    public virtual DbSet<FileChunk> FileChunks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("overlutstoragedb");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasKey(e => e.AttachmentId).HasName("PK__Attachme__442C64DEC54E9027");

            entity.Property(e => e.AttachmentId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("AttachmentID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsComplete).HasDefaultValue(false);
        });

        modelBuilder.Entity<FileChunk>(entity =>
        {
            entity.HasKey(e => e.ChunkId)
                .HasName("PK__FileChun__FBFF9D2188399683")
                .IsClustered(false);

            entity.HasIndex(e => new { e.AttachmentId, e.SequenceNumber }, "CIX_Chunks_Blob_Order").IsClustered();

            entity.Property(e => e.ChunkId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("ChunkID");
            entity.Property(e => e.AttachmentId).HasColumnName("AttachmentID");

            entity.HasOne(d => d.Attachment).WithMany(p => p.FileChunks)
                .HasForeignKey(d => d.AttachmentId)
                .HasConstraintName("FK_FileChunks_Attachments");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
