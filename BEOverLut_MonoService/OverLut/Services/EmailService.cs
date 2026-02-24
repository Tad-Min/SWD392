using Services.Interface;

namespace Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            // TODO: Configure SMTP settings in appsettings.json and implement actual email sending
            // For now, this is a placeholder implementation
            Console.WriteLine($"[EmailService] Sending email to: {to}, Subject: {subject}, Body: {body}");
            await Task.CompletedTask;
        }
    }
}
