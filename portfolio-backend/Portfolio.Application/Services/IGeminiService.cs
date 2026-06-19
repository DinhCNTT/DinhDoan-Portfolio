using System.Collections.Generic;
using System.Threading.Tasks;

namespace Portfolio.Application.Services
{
    public interface IGeminiService
    {
        Task<float[]> GenerateEmbeddingAsync(string text);
        Task<string> GenerateTextAsync(string systemPrompt, string userPrompt);
        IAsyncEnumerable<string> StreamTextAsync(string systemPrompt, string userPrompt);
    }
}

