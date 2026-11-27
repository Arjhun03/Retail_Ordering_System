using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Enums;
using Retail_Ordering_system.Data;
using Retail_Ordering_system.Models;

namespace Retail_Ordering.Api.Data;

public class DbSeeder(
    RetailDbContext context,
    IConfiguration configuration,
    ILogger<DbSeeder> logger)
{
    public async Task SeedAsync(CancellationToken ct = default)
    {
        try
        {
            await context.Database.EnsureCreatedAsync(ct);

            await SeedAdminUserAsync(ct);
            await SeedCatalogAndInventoryAsync(ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task SeedAdminUserAsync(CancellationToken ct)
    {
        var adminEmail = configuration["SeedData:AdminEmail"] ?? "admin@retailordering.com";
        var normalizedEmail = adminEmail.Trim().ToLowerInvariant();

        if (await context.Users.AnyAsync(u => u.Email == normalizedEmail, ct))
        {
            return;
        }

        var adminPassword = configuration["SeedData:AdminPassword"] ?? "AdminPassword123!";
        var passwordHasher = new PasswordHasher<User>();

        var adminUser = new User
        {
            FullName = "System Administrator",
            Email = normalizedEmail,
            Phone = "1234567890",
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, adminPassword);

        await context.Users.AddAsync(adminUser, ct);
        await context.SaveChangesAsync(ct);
        logger.LogInformation("Admin user seeded successfully with email: {Email}", normalizedEmail);
    }

    private async Task SeedCatalogAndInventoryAsync(CancellationToken ct)
    {
        if (await context.Brands.AnyAsync(ct))
        {
            return;
        }

        logger.LogInformation("Seeding initial catalog and inventory demo data...");

        // Brands
        var pizzaHut = new Brand { BrandName = "Pizza Planet", Description = "Artisan gourmet pizzas", IsActive = true };
        var beverageCo = new Brand { BrandName = "ChillWave Beverages", Description = "Refreshing cold beverages", IsActive = true };
        var bakery = new Brand { BrandName = "Daily Crust Bakery", Description = "Freshly baked artisan breads", IsActive = true };

        await context.Brands.AddRangeAsync([pizzaHut, beverageCo, bakery], ct);
        await context.SaveChangesAsync(ct);

        // Categories
        var catPizza = new Category { CategoryName = "Pizza", Description = "Hot oven-baked pizzas", IsActive = true };
        var catDrinks = new Category { CategoryName = "Cold Drinks", Description = "Chilled sodas, juices, and drinks", IsActive = true };
        var catBreads = new Category { CategoryName = "Breads", Description = "Garlic breads, loaves, and baguettes", IsActive = true };

        await context.Categories.AddRangeAsync([catPizza, catDrinks, catBreads], ct);
        await context.SaveChangesAsync(ct);

        // Products
        var margherita = new Product
        {
            BrandId = pizzaHut.BrandId,
            CategoryId = catPizza.CategoryId,
            ProductName = "Margherita Pizza",
            Description = "Classic mozzarella cheese and fresh basil tomato sauce",
            ImageUrl = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var pepperoni = new Product
        {
            BrandId = pizzaHut.BrandId,
            CategoryId = catPizza.CategoryId,
            ProductName = "Pepperoni Feast Pizza",
            Description = "Loaded with premium pepperoni and extra mozzarella",
            ImageUrl = "https://images.unsplash.com/photo-1628840042765-356cda07504e",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var icedTea = new Product
        {
            BrandId = beverageCo.BrandId,
            CategoryId = catDrinks.CategoryId,
            ProductName = "Lemon Iced Tea",
            Description = "Refreshing brewed iced tea infused with natural lemon juice",
            ImageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var cola = new Product
        {
            BrandId = beverageCo.BrandId,
            CategoryId = catDrinks.CategoryId,
            ProductName = "Sparkling Craft Cola",
            Description = "Zero-calorie carbonated soda with natural cane flavor",
            ImageUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var garlicBread = new Product
        {
            BrandId = bakery.BrandId,
            CategoryId = catBreads.CategoryId,
            ProductName = "Cheesy Garlic Bread",
            Description = "Crispy sourdough baked with herb butter and melted mozzarella",
            ImageUrl = "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await context.Products.AddRangeAsync([margherita, pepperoni, icedTea, cola, garlicBread], ct);
        await context.SaveChangesAsync(ct);

        // Packagings
        var packMargheritaReg = new Packaging { ProductId = margherita.ProductId, PackagingName = "Regular 8-inch", Price = 9.99m, Unit = "1 Pie", IsActive = true };
        var packMargheritaLarge = new Packaging { ProductId = margherita.ProductId, PackagingName = "Large 12-inch", Price = 14.99m, Unit = "1 Pie", IsActive = true };

        var packPepperoniReg = new Packaging { ProductId = pepperoni.ProductId, PackagingName = "Regular 8-inch", Price = 11.99m, Unit = "1 Pie", IsActive = true };
        var packPepperoniLarge = new Packaging { ProductId = pepperoni.ProductId, PackagingName = "Large 12-inch", Price = 16.99m, Unit = "1 Pie", IsActive = true };

        var packTeaCan = new Packaging { ProductId = icedTea.ProductId, PackagingName = "Can 330ml", Price = 2.49m, Unit = "1 Can", IsActive = true };
        var packTeaBottle = new Packaging { ProductId = icedTea.ProductId, PackagingName = "Bottle 500ml", Price = 3.49m, Unit = "1 Bottle", IsActive = true };

        var packColaCan = new Packaging { ProductId = cola.ProductId, PackagingName = "Can 330ml", Price = 2.49m, Unit = "1 Can", IsActive = true };

        var packBreadStandard = new Packaging { ProductId = garlicBread.ProductId, PackagingName = "4 Slices", Price = 4.99m, Unit = "1 Pack", IsActive = true };

        var allPackagings = new[]
        {
            packMargheritaReg, packMargheritaLarge,
            packPepperoniReg, packPepperoniLarge,
            packTeaCan, packTeaBottle,
            packColaCan,
            packBreadStandard
        };

        await context.Packagings.AddRangeAsync(allPackagings, ct);
        await context.SaveChangesAsync(ct);

        // Inventory for each packaging
        var inventories = new List<Inventory>
        {
            new() { PackagingId = packMargheritaReg.PackagingId, StockQuantity = 50, ReorderLevel = 10, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packMargheritaLarge.PackagingId, StockQuantity = 35, ReorderLevel = 10, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packPepperoniReg.PackagingId, StockQuantity = 40, ReorderLevel = 10, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packPepperoniLarge.PackagingId, StockQuantity = 30, ReorderLevel = 10, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packTeaCan.PackagingId, StockQuantity = 100, ReorderLevel = 25, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packTeaBottle.PackagingId, StockQuantity = 80, ReorderLevel = 20, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packColaCan.PackagingId, StockQuantity = 120, ReorderLevel = 30, UpdatedAt = DateTime.UtcNow },
            new() { PackagingId = packBreadStandard.PackagingId, StockQuantity = 45, ReorderLevel = 15, UpdatedAt = DateTime.UtcNow }
        };

        await context.Inventories.AddRangeAsync(inventories, ct);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("Successfully seeded catalog items and inventory records.");
    }
}
