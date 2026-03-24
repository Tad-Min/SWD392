using System.Text;
using DAOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO.Converters;
using Repositories.Interface.Overlut;
using Repositories.Interface.OverlutStorage;
using Repositories.Overlut;
using Repositories.OverlutStorage;
using Scalar.AspNetCore;
using Services;
using Services.Interface;
using WebApi.Extensions;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Content-Type", "Authorization");
    });
});


// Add services to the container.

builder.Services.AddDbContext<OverlutDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("overlutdb"), // Đã sửa chuẩn
        sqlOptions => sqlOptions.UseNetTopologySuite()
    ));

builder.Services.AddDbContext<OverlutDbStorageContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("overlutstoragedb") // Đã sửa chuẩn
    ));

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
builder.Services.AddScoped<IAttachmentRescueRepository, AttachmentRescueRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IInventoryTransactionRepository, InventoryTransactionRepository>();
builder.Services.AddScoped<IWarehouseRepository, WarehouseRepository>();
builder.Services.AddScoped<IWarehouseStockRepository, WarehouseStockRepository>();
builder.Services.AddScoped<IRescueTeamRepository, RescueTeamRepository>();
builder.Services.AddScoped<IRescueTeamMemberRepository, RescueTeamMemberRepository>();
builder.Services.AddScoped<IRescueMembersRoleRepository, RescueMembersRoleRepository>();
builder.Services.AddScoped<IUrgencyLevelRepository, UrgencyLevelRepository>();
builder.Services.AddScoped<IRescueMembersRoleRepository, RescueMembersRoleRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

// Volunteer Management Repositories
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerSkillRepository, VolunteerSkillRepository>();
builder.Services.AddScoped<IVolunteerOfferRepository, VolunteerOfferRepository>();
builder.Services.AddScoped<IVolunteerOfferAssignmentRepository, VolunteerOfferAssignmentRepository>();

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
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IInventoryTransactionService, InventoryTransactionService>();
builder.Services.AddScoped<IEmailService, EmailService>();
// Volunteer Management Services
builder.Services.AddScoped<IVolunteerService, VolunteerService>();
builder.Services.AddScoped<IUrgencyLevelService, UrgencyLevelService>();
builder.Services.AddScoped<IVehicleAssignmentRepository, VehicleAssignmentRepository>();
builder.Services.AddScoped<IRolesService, RolesService>();
// Add Status Repositories
builder.Services.AddScoped<IRescueMissionsStatusRepository, RescueMissionsStatusRepository>();
builder.Services.AddScoped<IRescueRequestsStatusRepository, RescueRequestsStatusRepository>();
builder.Services.AddScoped<IRescueTeamsStatusRepository, RescueTeamsStatusRepository>();
builder.Services.AddScoped<IVehiclesStatusRepository, VehiclesStatusRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IAttachmentMissionRepository, AttachmentMissionRepository>();
builder.Services.AddScoped<IAttachmentRescueRepository, AttachmentRescueRepository>();
builder.Services.AddScoped<IFileChunkRepository, FileChunkRepository>();
builder.Services.AddScoped<IAttachmentRepository, AttachmentRepository>();
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

            ValidIssuer = builder.Configuration["JWTAuth:Issuer"],
            ValidAudience = builder.Configuration["JWTAuth:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWTAuth:key"] ?? "a-string-secret-at-least-256-bits-long")),

            // CRITICAL: AuthService sets role as ClaimTypes.Role (full URI).
            // Without this, JwtBearer maps it to short "role" claim and [Authorize(Roles=...)] can't find it.
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
            NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier,
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
    c.MapType<Point>(() => new OpenApiSchema
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
Console.WriteLine("===================================================");
Console.WriteLine("=== KIỂM TRA CONNECTION STRING ĐANG CHẠY ===");
Console.WriteLine("Environment: " + app.Environment.EnvironmentName);

// In ra thử cả 2 cách gọi key xem cái nào đang có dữ liệu
var db1 = app.Configuration.GetConnectionString("DefaultConnection:overlutdb");
var db2 = app.Configuration.GetConnectionString("overlutdb");
Console.WriteLine("Chuỗi kết nối (DefaultConnection:overlutdb): " + (string.IsNullOrEmpty(db1) ? "RỖNG/NULL" : db1));
Console.WriteLine("Chuỗi kết nối (overlutdb): " + (string.IsNullOrEmpty(db2) ? "RỖNG/NULL" : db2));
Console.WriteLine("===================================================");
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

// CORS middleware must come BEFORE Authentication and Authorization
app.UseCors("AllowReactApp");

//app.UseHttpsRedirection();

app.UseWebSockets();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Handle OPTIONS requests explicitly
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});

// WebSocket endpoint for browser clients
var wsConnections = new System.Collections.Concurrent.ConcurrentDictionary<string, System.Net.WebSockets.WebSocket>();

app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var ws = await context.WebSockets.AcceptWebSocketAsync();
        var connectionId = Guid.NewGuid().ToString();
        wsConnections.TryAdd(connectionId, ws);
        Console.WriteLine($"WebSocket client connected: {connectionId}");

        var buffer = new byte[1024 * 8];
        try
        {
            while (ws.State == System.Net.WebSockets.WebSocketState.Open)
            {
                var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == System.Net.WebSockets.WebSocketMessageType.Close)
                    break;

                var message = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"WS Received from {connectionId}: {message}");

                // Broadcast to all other connected clients
                var data = System.Text.Encoding.UTF8.GetBytes(message);
                foreach (var conn in wsConnections)
                {
                    if (conn.Key != connectionId && conn.Value.State == System.Net.WebSockets.WebSocketState.Open)
                    {
                        await conn.Value.SendAsync(
                            new ArraySegment<byte>(data),
                            System.Net.WebSockets.WebSocketMessageType.Text,
                            true,
                            CancellationToken.None);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WebSocket error {connectionId}: {ex.Message}");
        }
        finally
        {
            wsConnections.TryRemove(connectionId, out _);
            if (ws.State == System.Net.WebSockets.WebSocketState.Open)
                await ws.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
            Console.WriteLine($"WebSocket client disconnected: {connectionId}");
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

app.Run();
