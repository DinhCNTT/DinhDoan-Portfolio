using System.Threading.Tasks;

namespace Portfolio.Application.Services
{
    public interface IGeminiService
    {
        Task<float[]> GenerateEmbeddingAsync(string text);
        Task<string> GenerateTextAsync(string systemPrompt, string userPrompt);
    }
}
