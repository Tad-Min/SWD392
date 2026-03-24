using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Services.Interface;

namespace Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly string? _smtpHost;
        private readonly int _smtpPort;
        private readonly string? _smtpUser;
        private readonly string? _smtpPass;
        private readonly string _fromAddress;
        private readonly string _fromName;
        private readonly bool _smtpConfigured;

        public EmailService(IConfiguration config)
        {
            _config = config;
            _smtpHost = config["Email:Host"];
            _smtpPort = int.TryParse(config["Email:Port"], out var port) ? port : 587;
            _smtpUser = config["Email:User"];
            _smtpPass = config["Email:Pass"];
            _fromAddress = config["Email:From"] ?? "noreply@overlut.vn";
            _fromName = config["Email:FromName"] ?? "OverLut System";
            _smtpConfigured = !string.IsNullOrWhiteSpace(_smtpHost) && !string.IsNullOrWhiteSpace(_smtpUser);
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            if (!_smtpConfigured)
            {
                Console.WriteLine($"[EmailService][FALLBACK] To: {to} | Subject: {subject}");
                Console.WriteLine($"[EmailService][FALLBACK] Body: {body}");
                return;
            }

            using var client = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                EnableSsl = true
            };
            var message = new MailMessage
            {
                From = new MailAddress(_fromAddress, _fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(to);
            await client.SendMailAsync(message);
        }

        public async Task SendVolunteerApprovedAsync(string to, string volunteerName)
        {
            var subject = "✅ Đơn đăng ký tình nguyện viên đã được duyệt – OverLut";
            var body = $@"
<h2>Chào {volunteerName},</h2>
<p>Chúc mừng! Đơn đăng ký tình nguyện viên của bạn trên hệ thống <strong>OverLut</strong> đã được <strong>phê duyệt</strong>.</p>
<p>Tài khoản của bạn hiện đã được cấp quyền Tình nguyện viên. Bạn có thể đăng nhập bằng tài khoản hiện tại và sử dụng đầy đủ chức năng tình nguyện viên.</p>
<hr/>
<p><em>OverLut – Hệ thống Phối hợp Cứu trợ Lũ lụt</em></p>";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendVolunteerRejectedAsync(string to, string volunteerName, string? reason)
        {
            var subject = "❌ Đơn đăng ký tình nguyện viên chưa được chấp thuận – OverLut";
            var reasonHtml = string.IsNullOrWhiteSpace(reason) ? "" : $"<p><strong>Lý do:</strong> {reason}</p>";
            var body = $@"
<h2>Chào {volunteerName},</h2>
<p>Rất tiếc, đơn đăng ký tình nguyện viên của bạn trên hệ thống <strong>OverLut</strong> chưa được chấp thuận tại thời điểm này.</p>
{reasonHtml}
<p>Nếu bạn có thêm thông tin hoặc muốn khiếu nại, vui lòng liên hệ với quản lý hệ thống.</p>
<hr/>
<p><em>OverLut – Hệ thống Phối hợp Cứu trợ Lũ lụt</em></p>";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendTeamAssignmentAsync(
            string to,
            string volunteerName,
            string teamName,
            string assemblyLocation,
            string roleInTeam,
            string? note)
        {
            var subject = $"📣 Bạn đã được phân công vào đội cứu hộ – {teamName}";
            var noteHtml = string.IsNullOrWhiteSpace(note) ? "" : $"<p><strong>Ghi chú:</strong> {note}</p>";
            var body = $@"
<h2>Chào {volunteerName},</h2>
<p>Bạn đã được phân công vào đội cứu hộ trên hệ thống <strong>OverLut</strong>.</p>
<table style='border-collapse:collapse;'>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Tên đội:</td><td style='padding:6px 12px;'>{teamName}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Địa điểm tập kết:</td><td style='padding:6px 12px;'>{assemblyLocation}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Vai trò:</td><td style='padding:6px 12px;'>{roleInTeam}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Thời điểm thông báo:</td><td style='padding:6px 12px;'>{DateTime.Now:dd/MM/yyyy HH:mm}</td></tr>
</table>
{noteHtml}
<p>Vui lòng liên hệ trưởng đội để biết thêm chi tiết và chuẩn bị sẵn sàng.</p>
<hr/>
<p><em>OverLut – Hệ thống Phối hợp Cứu trợ Lũ lụt</em></p>";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendOfferConfirmedAsync(
            string to,
            string volunteerName,
            string offerName,
            string warehouseName,
            string warehouseAddress,
            decimal quantity,
            string unit)
        {
            var subject = $"📦 Xác nhận tiếp nhận vật phẩm – {offerName} – OverLut";
            var body = $@"
<h2>Chào {volunteerName},</h2>
<p>Đăng ký đóng góp vật phẩm của bạn trên hệ thống <strong>OverLut</strong> đã được <strong>xác nhận tiếp nhận</strong>.</p>
<table style='border-collapse:collapse;'>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Vật phẩm:</td><td style='padding:6px 12px;'>{offerName}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Số lượng:</td><td style='padding:6px 12px;'>{quantity} {unit}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Kho tiếp nhận:</td><td style='padding:6px 12px;'>{warehouseName}</td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Địa điểm tập kết:</td><td style='padding:6px 12px;'><strong>{warehouseAddress}</strong></td></tr>
  <tr><td style='padding:6px 12px;font-weight:bold;'>Thời gian thông báo:</td><td style='padding:6px 12px;'>{DateTime.Now:dd/MM/yyyy HH:mm}</td></tr>
</table>
<p>Vui lòng mang vật phẩm đến địa điểm tập kết trên để hoàn tất đóng góp. Cảm ơn bạn đã hỗ trợ công tác cứu trợ lũ lụt!</p>
<hr/>
<p><em>OverLut – Hệ thống Phối hợp Cứu trợ Lũ lụt</em></p>";
            await SendEmailAsync(to, subject, body);
        }
    }
}
