using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Services;

namespace Portfolio.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendContactNotificationAsync(string name, string email, string subject, string message, DateTime createdAt)
        {
            var section = _configuration.GetSection("EmailSettings");
            var smtpServer = section["SmtpServer"] ?? "smtp.gmail.com";
            
            var portStr = section["Port"];
            var port = int.TryParse(portStr, out int parsedPort) ? parsedPort : 587;
            
            var senderEmail = section["SenderEmail"];
            var senderPassword = section["SenderPassword"];
            var receiverEmail = section["ReceiverEmail"] ?? "dinhcm123321@gmail.com";
            
            var sslStr = section["EnableSsl"];
            var enableSsl = !bool.TryParse(sslStr, out bool parsedSsl) || parsedSsl; // defaults to true

            if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(senderPassword))
            {
                _logger.LogWarning("[EMAIL_SERVICE] EmailSettings:SenderEmail or SenderPassword is not configured. Email notification skipped.");
                return;
            }

            try
            {
                using var mail = new MailMessage();
                mail.From = new MailAddress(senderEmail, section["SenderName"] ?? "Portfolio Web");
                mail.To.Add(receiverEmail);
                mail.Subject = $"[PORTFOLIO CONTACT] {subject ?? "Đề nghị liên hệ mới"} - {name}";
                
                mail.Body = $@"
                    <h3>Đề nghị liên hệ mới từ Portfolio của bạn</h3>
                    <hr />
                    <p><strong>Họ và tên:</strong> {name}</p>
                    <p><strong>Email liên hệ:</strong> <a href='mailto:{email}'>{email}</a></p>
                    <p><strong>Tiêu đề:</strong> {subject ?? "Không có tiêu đề"}</p>
                    <p><strong>Thời gian gửi:</strong> {createdAt.ToLocalTime():yyyy-MM-dd HH:mm:ss}</p>
                    <br />
                    <p><strong>Nội dung chi tiết:</strong></p>
                    <div style='background-color: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7; white-space: pre-wrap;'>
                        {message}
                    </div>
                ";
                mail.IsBodyHtml = true;

                using var smtp = new SmtpClient(smtpServer, port);
                smtp.Credentials = new NetworkCredential(senderEmail, senderPassword);
                smtp.EnableSsl = enableSsl;

                await smtp.SendMailAsync(mail);
                _logger.LogInformation($"[EMAIL_SERVICE] Notification email sent successfully to {receiverEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EMAIL_SERVICE] Failed to send email: {ex.Message}");
            }
        }
    }
}
