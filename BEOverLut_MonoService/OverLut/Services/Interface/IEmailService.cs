namespace Services.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);

        Task SendVolunteerApprovedAsync(string to, string volunteerName);
        Task SendVolunteerRejectedAsync(string to, string volunteerName, string? reason);
        Task SendTeamAssignmentAsync(
            string to,
            string volunteerName,
            string teamName,
            string assemblyLocation,
            string roleInTeam,
            string? note);
        Task SendOfferConfirmedAsync(
            string to,
            string volunteerName,
            string offerName,
            string warehouseName,
            string warehouseAddress,
            decimal quantity,
            string unit);
    }
}
