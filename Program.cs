using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Retail_Ordering.Api;
using Retail_Ordering.Api.Data;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Middleware;
using Retail_Ordering.Api.Repositories;
using Retail_Ordering.Api.Services;
using Retail_Ordering.Api.Data;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Repositories;
using Retail_Ordering.Api.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Database context
var connectionString = builder.Configuration.GetConnectionString("RetailDatabase")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=localhost,1433;Database=RetailOrderingDb;User Id=sa;Password=n3v1tnpYqFRD3b/iPU7HrhyPFBRwqs8s;TrustServerCertificate=True;MultipleActiveResultSets=true;";

builder.Services.AddDbContext<RetailDbContext>(options =>
    options.UseSqlServer(connectionString));

// Member 1 (Auth & Users)
builder.Services.AddSingleton<PasswordHelper>();
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// Member 2 (Catalog)
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

// Member 3 (Packaging, Cart, Orders)
builder.Services.AddScoped<IPackagingRepository, PackagingRepository>();
builder.Services.AddScoped<IPackagingService, PackagingService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Member 4 (Inventory & Seeder)
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<DbSeeder>();

// Exception Handling and Logging
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// JWT Authentication
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "RetailOrdering.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "RetailOrdering.Client";
var jwtKey = builder.Configuration["Jwt:SigningKey"]
    ?? builder.Configuration["Jwt:Key"]
    ?? "CHANGE_THIS_DEVELOPMENT_KEY_TO_A_LONG_RANDOM_SECRET_2026_RETAIL";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// CORS configuration for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// OpenAPI configuration
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Retail Ordering API")
               .WithTheme(ScalarTheme.Mars)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });

    // Auto-seed development database safely
    try
    {
        using var scope = app.Services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database seeding failed during development startup (likely SQL Server is not reachable).");
    }
}

// Convenient root redirects to Scalar API reference
app.MapGet("/", () => Results.Redirect("/scalar/v1"));
app.MapGet("/scalar", () => Results.Redirect("/scalar/v1"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
