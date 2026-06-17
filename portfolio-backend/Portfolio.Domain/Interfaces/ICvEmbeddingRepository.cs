using System.Collections.Generic;
using System.Threading.Tasks;
using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Interfaces
{
    public interface ICvEmbeddingRepository : IGenericRepository<CvEmbedding>
    {
        Task<List<CvEmbedding>> SearchSimilarAsync(float[] queryEmbedding, int limit);
    }
}
