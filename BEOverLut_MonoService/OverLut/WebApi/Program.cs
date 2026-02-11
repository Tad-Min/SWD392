using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Interface;
using Scalar.AspNetCore;
using Services;
using Services.Interface;
using WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<OverlutDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection:overlutdb"),
        sqlOptions => sqlOptions.UseNetTopologySuite()
    ));
builder.Services.AddDbContext<OverlutDbStorageContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection:overlutstoragedb")));

//
builder.Services.AddAppConfigurations(builder.Configuration);
// Add Repository scope
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

// Add service scope.

builder.Services.AddScoped<IAttachmentStorageService, AttachmentStorageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRescueMissionService, RescueMissionService>();
builder.Services.AddScoped<IRescueRequestService, RescueRequestService>();
builder.Services.AddScoped<IRescueTeamService, RescueTeamService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IWareHouseService, WareHouseService>();

// Add authentication

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,

            ValidIssuer = builder.Configuration["JWTAuth:Authority"],
            ValidAudience = builder.Configuration["JWTAuth:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWTAuth:key"] ?? "a-string-secret-at-least-256-bits-long")),
        };
    });

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "OverLut API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapSwagger();
    app.MapScalarApiReference();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "OverLut API v1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
