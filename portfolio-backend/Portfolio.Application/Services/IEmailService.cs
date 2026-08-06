using System;
using System.Threading.Tasks;

namespace Portfolio.Application.Services
{
    public interface IEmailService
    {
        Task SendContactNotificationAsync(string name, string email, string subject, string message, DateTime createdAt);
    }
}
