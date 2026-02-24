using System.Text;
using System.Text.Json.Nodes;
using BusinessObject.OverlutEntiy;
using DAOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO.Converters;
using Repositories;
using Repositories.Interface;
using Scalar.AspNetCore;
using Services;
using Services.Interface;
using Swashbuckle.AspNetCore.SwaggerGen;
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

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(4326);
        options.JsonSerializerOptions.Converters.Add(new GeoJsonConverterFactory(geometryFactory));
    });

//
builder.Services.AddAppConfigurations(builder.Configuration);
// Add Repository scope
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IRescueRequestLogRepository, RescueRequestLogRepository>();
builder.Services.AddScoped<IMissionLogRepository, MissionLogRepository>();
builder.Services.AddScoped<IRescueRequestRepository, RescueRequestRepository>();
builder.Services.AddScoped<IRescueMissionRepository, RescueMissionRepository>();
builder.Services.AddScoped<IAttachmentMissionRepository, AttachmentMissionRepository>();

// Add service scope.

builder.Services.AddScoped<IAttachmentStorageService, AttachmentStorageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRescueMissionService, RescueMissionService>();
builder.Services.AddScoped<IRescueRequestService, RescueRequestService>();
builder.Services.AddScoped<IRescueTeamService, RescueTeamService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IWareHouseService, WareHouseService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IStatusService, StatusService>();

// Add Status Repositories
builder.Services.AddScoped<IRescueMissionsStatusRepository, RescueMissionsStatusRepository>();
builder.Services.AddScoped<IRescueRequestsStatusRepository, RescueRequestsStatusRepository>();
builder.Services.AddScoped<IRescueTeamsStatusRepository, RescueTeamsStatusRepository>();
builder.Services.AddScoped<IVehiclesStatusRepository, VehiclesStatusRepository>();

// Add Types Service and Repositories
builder.Services.AddScoped<ITypesService, TypesService>();
builder.Services.AddScoped<IRescueRequestsTypeRepository, RescueRequestsTypeRepository>();
builder.Services.AddScoped<IVehiclesTypeRepository, VehiclesTypeRepository>();

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

// Learn more about configuring Swagger at https://aka.ms/aspnet/swashbuckle
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OverLut API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' following by space and JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
    c.MapType<Geometry>(() => new OpenApiSchema
    {
        Type = "object",
        Description = "GeoJSON format (Point, LineString, Polygon, etc.)",
        Example = new OpenApiObject
        {
            { "type", new OpenApiString("Point") },
            { "coordinates", new OpenApiArray { new OpenApiDouble(106.7725), new OpenApiDouble(10.9024) } }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
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
