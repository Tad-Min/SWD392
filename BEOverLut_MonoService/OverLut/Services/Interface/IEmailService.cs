namespace Services.Interface
{
    public interface IEmailService
    {
        Task SendVolunteerApprovedAsync(string to, string volunteerName);
        Task SendVolunteerRejectedAsync(string to, string volunteerName, string? reason);
        Task SendTeamAssignmentAsync(
            string to,
            string volunteerName,
            string teamName,
            string assemblyLocation,
            string roleInTeam,
            string? note);
        Task SendTeamCreatedNotificationAsync(
            string to,
            string managerName,
            string teamName,
            string assemblyLocation);
        Task SendOfferConfirmedAsync(
            string to,
            string volunteerName,
            string offerName,
            string warehouseName,
            string warehouseAddress,
            decimal quantity,
            string unit);
        Task SendOfferReturnedAsync(
            string to,
            string volunteerName,
            string offerName,
            decimal quantity,
            string unit);
    }
}
