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
            return services;
        }
    }
}
