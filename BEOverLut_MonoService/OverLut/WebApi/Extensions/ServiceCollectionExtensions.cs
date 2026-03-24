using DTOs.Appsettings;

namespace WebApi.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAppConfigurations(this IServiceCollection services, IConfiguration config)
        {
            // Đăng ký JWTAuth
            services.AddOptions<JWTAuth>()
                    .Bind(config.GetSection("JWTAuth"))
                    .ValidateDataAnnotations()
                    .ValidateOnStart();
            services.AddOptions<UserSettings>()
                    .Bind(config.GetSection("UserSettings"))
                    .ValidateDataAnnotations()
                    .ValidateOnStart();
            services.AddOptions<RescueReqSettings>()
                    .Bind(config.GetSection("RescueReqSettings"))
                    .ValidateDataAnnotations()
                    .ValidateOnStart();
            services.AddOptions<RescueTeamSettings>()
                    .Bind(config.GetSection("RescueTeamSettings"))
                    .ValidateDataAnnotations()
                    .ValidateOnStart();
            services.AddOptions<EmailSettings>()
                    .Bind(config.GetSection(EmailSettings.SectionName))
                    .ValidateDataAnnotations()
                    .ValidateOnStart();
            return services;
        }
    }
}
