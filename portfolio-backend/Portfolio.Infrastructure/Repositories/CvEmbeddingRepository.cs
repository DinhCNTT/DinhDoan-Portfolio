using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Interfaces;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories
{
    public class CvEmbeddingRepository : GenericRepository<CvEmbedding>, ICvEmbeddingRepository
    {
        public CvEmbeddingRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<CvEmbedding>> SearchSimilarAsync(float[] queryEmbedding, int limit)
        {
            // Perform Cosine Distance search on the Vector embeddings
            // Requires Npgsql.EntityFrameworkCore.PostgreSQL + Pgvector.EntityFrameworkCore
            return await _context.CvEmbeddings
                .OrderBy(c => c.Embedding!.CosineDistance(new Pgvector.Vector(queryEmbedding)))
                .Take(limit)
                .ToListAsync();
        }
    }
}
