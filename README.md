Retail_Ordering_System/
│
└── Retail_Ordering.Api/
    │
    ├── Controllers/
    │   ├── AuthController.cs
    │   ├── UsersController.cs
    │   ├── BrandsController.cs
    │   ├── CategoriesController.cs
    │   ├── ProductsController.cs
    │   ├── PackagingController.cs
    │   ├── CartController.cs
    │   ├── OrdersController.cs
    │   └── InventoryController.cs
    │
    ├── Data/
    │   ├── RetailDbContext.cs
    │   └── DbSeeder.cs
    │
    ├── DTOs/
    │   ├── AuthDtos.cs
    │   ├── UserDtos.cs
    │   ├── BrandDtos.cs
    │   ├── CategoryDtos.cs
    │   ├── ProductDtos.cs
    │   ├── PackagingDtos.cs
    │   ├── CartDtos.cs
    │   ├── OrderDtos.cs
    │   ├── InventoryDtos.cs
    │   └── CommonDtos.cs
    │
    ├── Enums/
    │   ├── UserRole.cs
    │   ├── CartStatus.cs
    │   ├── OrderStatus.cs
    │   └── ProductStatus.cs
    │
    ├── Helpers/
    │   ├── JwtHelper.cs
    │   ├── PasswordHelper.cs
    │   └── OrderNumberHelper.cs
    │
    ├── Interfaces/
    │   ├── Repositories/
    │   │   ├── IUserRepository.cs
    │   │   ├── IBrandRepository.cs
    │   │   ├── ICategoryRepository.cs
    │   │   ├── IProductRepository.cs
    │   │   ├── IPackagingRepository.cs
    │   │   ├── ICartRepository.cs
    │   │   ├── IOrderRepository.cs
    │   │   └── IInventoryRepository.cs
    │   │
    │   └── Services/
    │       ├── IAuthService.cs
    │       ├── IUserService.cs
    │       ├── IBrandService.cs
    │       ├── ICategoryService.cs
    │       ├── IProductService.cs
    │       ├── IPackagingService.cs
    │       ├── ICartService.cs
    │       ├── IOrderService.cs
    │       └── IInventoryService.cs
    │
    ├── Middleware/
    │   ├── GlobalExceptionHandler.cs
    │   └── RequestLoggingMiddleware.cs
    │
    ├── Migrations/
    │
    ├── Models/
    │   ├── User.cs
    │   ├── Brand.cs
    │   ├── Category.cs
    │   ├── Product.cs
    │   ├── Packaging.cs
    │   ├── Cart.cs
    │   ├── CartItem.cs
    │   ├── Order.cs
    │   ├── OrderItem.cs
    │   └── Inventory.cs
    │
    ├── Repositories/
    │   ├── UserRepository.cs
    │   ├── BrandRepository.cs
    │   ├── CategoryRepository.cs
    │   ├── ProductRepository.cs
    │   ├── PackagingRepository.cs
    │   ├── CartRepository.cs
    │   ├── OrderRepository.cs
    │   └── InventoryRepository.cs
    │
    ├── Services/
    │   ├── AuthService.cs
    │   ├── UserService.cs
    │   ├── BrandService.cs
    │   ├── CategoryService.cs
    │   ├── ProductService.cs
    │   ├── PackagingService.cs
    │   ├── CartService.cs
    │   ├── OrderService.cs
    │   └── InventoryService.cs
    │
    ├── Properties/
    ├── appsettings.json
    ├── Program.cs
    └── Retail_Ordering.Api.csproj






Docs :
# Retail Ordering System — Parallel Team Development Specification

This document is the shared source of truth for implementing the Retail Ordering System in parallel with four developers and AI coding tools. The attached ER diagram defines the core database entities and relationships. This specification adds agreed ownership, API contracts, implementation rules, and integration steps so each developer can work in a separate area.

## 1. Project objective

Build an ASP.NET Core Web API for a retail food ordering website. Customers can browse brands, categories, products, and packaging; maintain a cart; place and review orders; and see inventory availability. Authorized staff can maintain catalog data and stock. The initial product types include pizza, cold drinks, and breads.

The initial version uses SQL Server and Entity Framework Core. It has no payment gateway; orders are recorded without collecting payment. Do not add features or entities outside this specification without agreement from the team.

## 2. Team rules that prevent file conflicts

1. Use one shared Git repository and **one branch per developer**. Do not have two people commit to the same feature branch.
2. Each developer owns only the files listed in their assignment below. They may read other areas but should not edit them.
3. Shared files have exactly one owner. Send changes to that owner instead of editing shared files.
4. Agree on entity properties, DTOs, interfaces, routes, and namespaces from this document before asking an AI editor to generate implementation code.
5. Keep each feature’s controller, DTOs, model, interface, repository, and service in its assigned area. Do not let an AI editor reorganize the project or modify files outside the assignment.
6. Merge changes to the integration branch one feature branch at a time. Resolve compile errors before starting the next merge.
7. Never create migrations on feature branches. Member 4 creates migrations after all model changes are integrated.
8. Do not commit secrets, local database files, IDE settings, or generated build folders.

### Branch names

- Member 1: `feature/auth-users`
- Member 2: `feature/catalog`
- Member 3: `feature/packaging-cart-orders`
- Member 4: `feature/inventory-integration`

Use pull requests or merge requests into `develop`. The team lead should merge feature branches in this order: Member 4 foundation (initially), Member 1, Member 2, Member 3, then Member 4 final integration/migration. Member 4 can merge their foundation as a small first commit, then continue implementation on the same branch.

## 3. File ownership

The solution layout remains the agreed `Retail_Ordering_System/Retail_Ordering.Api/` structure. `Connected Services` and `Dependencies` are IDE views, not source folders to create manually.

### Member 1 — Authentication and users

Owns:

- `Controllers/AuthController.cs`, `Controllers/UsersController.cs`
- `DTOs/AuthDtos.cs`, `DTOs/UserDtos.cs`
- `Models/User.cs`
- `Interfaces/Repositories/IUserRepository.cs`
- `Interfaces/Services/IAuthService.cs`, `Interfaces/Services/IUserService.cs`
- `Repositories/UserRepository.cs`
- `Services/AuthService.cs`, `Services/UserService.cs`
- `Helpers/JwtHelper.cs`, `Helpers/PasswordHelper.cs`

Responsibilities: register, sign in, hash and verify passwords, issue JWT access tokens, retrieve/update the current user profile, and enforce user roles. Do not edit `Program.cs`, enums, or the DbContext; provide required registrations and DbSet details to Member 4.

### Member 2 — Catalog

Owns:

- `Controllers/BrandsController.cs`, `Controllers/CategoriesController.cs`, `Controllers/ProductsController.cs`
- `DTOs/BrandDtos.cs`, `DTOs/CategoryDtos.cs`, `DTOs/ProductDtos.cs`
- `Models/Brand.cs`, `Models/Category.cs`, `Models/Product.cs`
- `Interfaces/Repositories/IBrandRepository.cs`, `ICategoryRepository.cs`, `IProductRepository.cs`
- `Interfaces/Services/IBrandService.cs`, `ICategoryService.cs`, `IProductService.cs`
- `Repositories/BrandRepository.cs`, `CategoryRepository.cs`, `ProductRepository.cs`
- `Services/BrandService.cs`, `CategoryService.cs`, `ProductService.cs`

Responsibilities: public product browsing and staff catalog CRUD. Do not edit `RetailDbContext.cs`, `DbSeeder.cs`, `Program.cs`, or shared enums; send Member 4 required registrations and seed catalog values.

### Member 3 — Packaging, cart, and orders

Owns:

- `Controllers/PackagingController.cs`, `CartController.cs`, `OrdersController.cs`
- `DTOs/PackagingDtos.cs`, `CartDtos.cs`, `OrderDtos.cs`
- `Models/Packaging.cs`, `Cart.cs`, `CartItem.cs`, `Order.cs`, `OrderItem.cs`
- `Interfaces/Repositories/IPackagingRepository.cs`, `ICartRepository.cs`, `IOrderRepository.cs`
- `Interfaces/Services/IPackagingService.cs`, `ICartService.cs`, `IOrderService.cs`
- `Repositories/PackagingRepository.cs`, `CartRepository.cs`, `OrderRepository.cs`
- `Services/PackagingService.cs`, `CartService.cs`, `OrderService.cs`
- `Helpers/OrderNumberHelper.cs`

Responsibilities: packaging choices/prices, customer cart, checkout, order history, and order status rules. Checkout must use the agreed stock reservation behavior in section 6. Do not edit Member 4’s inventory files or shared files.

### Member 4 — Inventory, foundation, and integration

Owns:

- `Controllers/InventoryController.cs`
- `DTOs/InventoryDtos.cs`, `DTOs/CommonDtos.cs`
- `Models/Inventory.cs`
- `Enums/UserRole.cs`, `CartStatus.cs`, `OrderStatus.cs`, `ProductStatus.cs`
- `Interfaces/Repositories/IInventoryRepository.cs`
- `Interfaces/Services/IInventoryService.cs`
- `Repositories/InventoryRepository.cs`, `Services/InventoryService.cs`
- `Data/RetailDbContext.cs`, `Data/DbSeeder.cs`
- `Middleware/GlobalExceptionHandler.cs`, `RequestLoggingMiddleware.cs`
- `Program.cs`, `appsettings*.json` (configuration keys only; no real secrets)
- `Migrations/`, `.csproj` package references, integration and final merge

Responsibilities: inventory management, database relationships/configuration, dependency injection, middleware, seed data, migrations, and integration. Member 4 incorporates other members’ entity DbSets and DI registration requests. Do not modify feature-owned models or services; request changes from their owners.

## 4. Code and naming conventions

- Root namespace: `Retail_Ordering.Api` (verify actual project namespace once; use one exact namespace everywhere).
- Use async methods for database and service operations. Include `CancellationToken` where practical, consistently across a feature.
- Controllers handle HTTP input/output only. Business rules belong in services; EF Core queries belong in repositories.
- Use DTOs for API input/output. Never return EF entities directly.
- Use data annotations or explicit service validation for required values, string lengths, valid quantities, and positive prices.
- Use `decimal` for money and configure SQL precision as `(10,2)`. Never use `float`/`double` for prices or totals.
- Store timestamps in UTC. Property names use PascalCase in C#; JSON uses ASP.NET Core’s default camelCase.
- Use `AsNoTracking()` for read-only EF queries where suitable.
- Avoid generic repository abstractions, AutoMapper, CQRS, payment processing, or extra packages unless the team agrees first.
- Do not hardcode credentials or JWT signing keys. Use user secrets/environment variables locally; appsettings should contain placeholders or non-secret defaults only.

## 5. Agreed database schema

Use integer primary keys unless the diagram’s field is otherwise specified. Names below are C# property names; use conventional singular PascalCase entity/table names. Foreign keys are required unless explicitly marked optional.

| Entity | Fields |
|---|---|
| `User` | `UserId` PK; `FullName` string max 100 required; `Email` string max 150 required unique; `Phone` string max 15 optional; `PasswordHash` string max 255 required; `Role` `UserRole` required; `CreatedAt` UTC datetime. |
| `Brand` | `BrandId` PK; `BrandName` string max 100 required; `Description` string max 500 optional; `IsActive` bool. |
| `Category` | `CategoryId` PK; `CategoryName` string max 100 required; `Description` string max 500 optional; `IsActive` bool. |
| `Product` | `ProductId` PK; `BrandId` FK; `CategoryId` FK; `ProductName` string max 150 required; `Description` string max 500 optional; `ImageUrl` string max 500 optional; `IsActive` bool; `CreatedAt` UTC datetime. |
| `Packaging` | `PackagingId` PK; `ProductId` FK; `PackagingName` string max 50 required; `Price` decimal(10,2); `Unit` string max 50 required; `IsActive` bool. |
| `Cart` | `CartId` PK; `UserId` FK; `CartStatus` enum; `CreatedAt` UTC datetime. A user can have multiple historical carts but at most one active cart (enforce in service; a filtered unique index may be used if supported). |
| `CartItem` | `CartItemId` PK; `CartId` FK; `PackagingId` FK; `Quantity` positive int; `UnitPrice` decimal(10,2), snapshot of price when item was added. Unique `(CartId, PackagingId)` for an active cart. |
| `Order` | `OrderId` PK; `UserId` FK; `OrderNumber` string max 30 required unique; `DeliveryAddress` string max 500 required; `TotalAmount` decimal(10,2); `OrderStatus` enum; `OrderedAt` UTC datetime. |
| `OrderItem` | `OrderItemId` PK; `OrderId` FK; `PackagingId` FK; `ProductName` string max 150 required snapshot; `PackagingName` string max 50 required snapshot; `Quantity` positive int; `UnitPrice` decimal(10,2) snapshot; `Subtotal` decimal(10,2). |
| `Inventory` | `InventoryId` PK; `PackagingId` FK unique (one inventory row per packaging); `StockQuantity` nonnegative int; `ReorderLevel` nonnegative int; `UpdatedAt` UTC datetime. |

Relationships: User 1-to-many Cart and Order; Cart 1-to-many CartItem; Brand 1-to-many Product; Category 1-to-many Product; Product 1-to-many Packaging; Packaging 1-to-many CartItem and OrderItem; Packaging 1-to-1 Inventory; Order 1-to-many OrderItem.

Configure cascade behavior deliberately. Prefer cascade delete only for owned rows such as cart items when deleting a cart; do not cascade-delete historical orders or catalog rows. Catalog records referenced by order history should be deactivated, not deleted.

### Enum values

Use string names in API JSON and database string conversion where practical; document exact values and configure EF conversions consistently.

- `UserRole`: `Customer`, `Admin`.
- `CartStatus`: `Active`, `CheckedOut`, `Abandoned`.
- `OrderStatus`: `Pending`, `Confirmed`, `Preparing`, `Ready`, `Delivered`, `Cancelled`.
- `ProductStatus`: only add if required by implementation; the schema already has `Product.IsActive`. If retained, define `Active`, `Inactive` and avoid having conflicting status and `IsActive` sources of truth. Preferred: use `IsActive` and omit `ProductStatus` unless agreed otherwise.

## 6. Cross-feature behavior

These rules are shared contracts, not independent implementation choices:

1. Only authenticated customers can manage their cart or view/create their own orders. A user ID comes from JWT claims, never from a client-supplied user ID for customer endpoints.
2. Catalog browsing can be anonymous. Inactive products, brands, categories, and packaging are not shown to customers. Admin-only create/update/deactivate and inventory adjustment operations require the `Admin` role.
3. Cart item quantity must be positive. Adding the same packaging again updates the existing row. Cart price is set from the current active packaging price on the server; clients cannot set `UnitPrice`.
4. At checkout, validate address, cart contents, current catalog activity, and available stock. Calculate all totals on the server. Do not trust client totals or cart prices.
5. Checkout copies current product/packaging names and prices into order item snapshots. Existing order history must not change when catalog names or prices change.
6. **Atomic stock/order contract:** Member 3’s `OrderRepository` owns checkout persistence and begins one EF Core database transaction. It reads the active cart and inventory rows, verifies every requested quantity, decrements stock, creates the order and its item snapshots, marks the cart `CheckedOut`, then commits. If any item lacks stock or any write fails, roll back the entire transaction and return a clear conflict/validation error. Use concurrency-safe updates/row version or conditional stock updates so two simultaneous checkouts cannot oversell. Member 4’s `InventoryRepository` owns admin stock adjustments; it must not create a second checkout path.
7. Cancelled orders do not automatically restock in v1. If the team later adds restocking, define its exact allowed statuses and make it idempotent before implementation.
8. Do not accept payment details or represent an external payment as completed in this version.

Member 3 may reference the `Inventory` model and inventory schema when implementing the checkout transaction, but must not edit `Inventory.cs` or inventory repository/service files. Member 4 owns those files and should expose any needed repository methods only after discussion. The checkout transaction remains implemented in Member 3’s `OrderRepository` using the shared scoped DbContext.

## 7. API contract

All routes are under `/api`. Use DTOs, consistent validation, and appropriate HTTP status codes: `200` for successful reads/updates, `201` for created resources, `204` for successful deletes where applicable, `400` for invalid input, `401` for unauthenticated, `403` for forbidden, `404` for missing resources, and `409` for stock or uniqueness conflicts.

### Authentication and users — Member 1

- `POST /api/auth/register` — `RegisterRequest { fullName, email, phone?, password }`; returns created user summary and token (or a documented register-then-login approach; choose one and keep consistent).
- `POST /api/auth/login` — `LoginRequest { email, password }`; returns `AuthResponse { token, expiresAt, user { userId, fullName, email, role } }`.
- `GET /api/users/me` — authenticated current user profile.
- `PUT /api/users/me` — update allowed profile fields; email/role/password changes are excluded from this endpoint.

### Catalog — Member 2

- `GET /api/brands`; `GET /api/brands/{id}`; admin `POST /api/brands`, `PUT /api/brands/{id}`, `DELETE /api/brands/{id}` (deactivate rather than hard delete if referenced).
- `GET /api/categories`; `GET /api/categories/{id}`; admin `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}` (deactivate rather than hard delete if referenced).
- `GET /api/products` — optional filters `categoryId`, `brandId`, `search`, `page`, `pageSize`; only active catalog rows for public use.
- `GET /api/products/{id}` — include brand, category, and active packaging summary.
- Admin `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` (deactivate if historical references exist).

### Packaging, cart, and orders — Member 3

- `GET /api/products/{productId}/packaging` — active packaging options (catalog route may be implemented by Member 2 only if agreed; default owner is Member 3).
- Admin `POST /api/packaging`, `PUT /api/packaging/{id}`, `DELETE /api/packaging/{id}` (deactivate).
- `GET /api/cart` — current user’s active cart and calculated item totals.
- `POST /api/cart/items` — `{ packagingId, quantity }`.
- `PUT /api/cart/items/{cartItemId}` — `{ quantity }`.
- `DELETE /api/cart/items/{cartItemId}`.
- `POST /api/orders` — `{ deliveryAddress }`; checkout from active cart and return created order.
- `GET /api/orders` — current user’s paged order history.
- `GET /api/orders/{id}` — current user’s order details; admins may inspect any order.
- Admin `PATCH /api/orders/{id}/status` — `{ status }`; enforce allowed transitions and do not permit arbitrary status rewinds.

### Inventory — Member 4

- Admin `GET /api/inventory` — stock list with packaging/product identifiers and low-stock indicator.
- Admin `GET /api/inventory/{packagingId}`.
- Admin `PUT /api/inventory/{packagingId}` — set stock quantity/reorder level with nonnegative validation.
- Admin `POST /api/inventory/{packagingId}/adjust` — `{ adjustment, reason }`; record resulting stock and reject a negative result. If adjustment history is not implemented, omit the endpoint and use `PUT` only.

For list endpoints, pagination is optional in v1, but if implemented use the same query names (`page`, `pageSize`) and response shape throughout. `CommonDtos.cs` should define a shared paged response only if at least two features use it; otherwise keep DTOs feature-local.

## 8. Shared DTO and error conventions

- Request DTOs contain only client-editable fields. Never accept IDs, roles, totals, prices, or timestamps when the server owns those values.
- Response DTOs use camelCase JSON automatically and include identifiers needed for follow-up requests.
- Validation errors use ASP.NET Core model validation and return `ProblemDetails` (or `ValidationProblemDetails`).
- `GlobalExceptionHandler` maps expected exceptions to safe client responses and logs unexpected exceptions without exposing stack traces, SQL, or secrets.
- Return a consistent error response. Prefer built-in `ProblemDetails` rather than creating a second error envelope.

## 9. Integration checklist

Before merging a feature, its owner should:

- Confirm only assigned files changed (`git status` and `git diff --name-only`).
- Confirm namespaces and DTO/interface signatures match this document.
- Confirm all async database calls are awaited and all user-scoped queries filter by the authenticated user.
- Confirm no secrets or local database files are included.
- Run `dotnet build` from the solution directory and report any unresolved errors.

Member 4 integrates in this order:

1. Commit the empty ASP.NET Core project foundation, package references, base configuration, shared enums, and `RetailDbContext` skeleton.
2. Merge Member 1 and add `User` DbSet/configuration and auth DI registrations.
3. Merge Member 2 and add catalog DbSets, relationships, indexes, and registrations.
4. Merge Member 3 and add packaging/cart/order DbSets and relationships.
5. Add inventory model configuration, seeder, middleware, and final service/controller registrations.
6. Create one initial migration after all entities are present; apply it to a local development database.
7. Build and manually verify the documented endpoints in Swagger or an HTTP client.

If the project already exists, Member 4 should inspect it first and preserve existing namespaces, settings, and package versions where compatible. Do not regenerate or overwrite the project template just to match this document.

## 10. AI coding editor prompts

Give each developer the common instruction first, followed by only their assigned prompt. Ask the AI to summarize intended files before it edits. Keep each person in their feature branch/worktree.

### Common instruction for every AI session

> You are implementing one assigned feature in an existing ASP.NET Core Web API. Follow `TEAM_DEVELOPMENT_SPEC.md` as the source of truth. Do not edit files owned by other members, do not change the database schema or public contracts without identifying the conflict first, do not add dependencies or reorganize folders, and do not overwrite existing project configuration. Before editing, list the files you plan to change and confirm they are in your assigned ownership list. Implement only your feature. At the end, list changed files, summarize API behavior, and report build issues. Do not create EF migrations.

### Member 1 prompt

> Implement Authentication and Users only. You own AuthController, UsersController, AuthDtos, UserDtos, User.cs, IUserRepository, IAuthService, IUserService, UserRepository, AuthService, UserService, JwtHelper, and PasswordHelper. Follow the agreed schema and API contract in `TEAM_DEVELOPMENT_SPEC.md`. Use secure password hashing, JWT claims for user ID and role, and ensure customer endpoints use the authenticated identity rather than a supplied user ID. Do not edit Program.cs, RetailDbContext.cs, enums, or any other member’s files. Provide Member 4 with required DbSet/configuration and dependency injection registrations as notes.

### Member 2 prompt

> Implement Catalog only. You own BrandsController, CategoriesController, ProductsController, BrandDtos, CategoryDtos, ProductDtos, Brand.cs, Category.cs, Product.cs, their repository/service interfaces, repositories, and services. Follow the schema, role rules, filtering, DTO, and HTTP conventions in `TEAM_DEVELOPMENT_SPEC.md`. Public reads must hide inactive records; admin mutations must require Admin authorization. Do not edit shared files or other members’ files. Provide Member 4 with required DbSet/configuration/DI registrations and seed data as notes.

### Member 3 prompt

> Implement Packaging, Cart, and Orders only. You own PackagingController, CartController, OrdersController, PackagingDtos, CartDtos, OrderDtos, Packaging.cs, Cart.cs, CartItem.cs, Order.cs, OrderItem.cs, their repository/service interfaces, repositories, services, and OrderNumberHelper. Follow `TEAM_DEVELOPMENT_SPEC.md`. Cart prices and order totals are server-calculated. Scope customer cart/order access to the authenticated user. Checkout must atomically validate and decrement inventory, create order snapshots, mark the cart checked out, and roll back on failure as specified. You may query the Inventory entity through the shared DbContext but must not edit Inventory.cs or Member 4’s files. Do not edit Program.cs, RetailDbContext.cs, or create migrations. Send Member 4 the DbSet/configuration/DI registration requirements.

### Member 4 prompt

> Implement Inventory and own shared integration. You own InventoryController, InventoryDtos, Inventory.cs, IInventoryRepository, IInventoryService, InventoryRepository, InventoryService, all shared enums, CommonDtos, RetailDbContext, DbSeeder, Program.cs, middleware, appsettings configuration keys, project package references, and migrations. Preserve existing project setup. Implement schema relationships/indexes/constraints from `TEAM_DEVELOPMENT_SPEC.md`; register services and middleware; seed only safe demo catalog data and a development admin through a documented safe mechanism. Coordinate entity and DI additions with the other owners; do not edit their feature files. Create migrations only after all feature models are merged.

## 11. Definition of done for v1

- A customer can register/login and receive a JWT.
- Anonymous users can browse active products and packaging.
- An admin can manage catalog records and inventory.
- An authenticated customer can add/update/remove cart items and retrieve their cart.
- Checkout calculates totals on the server, prevents overselling, creates order snapshots, and closes the active cart.
- Customers can view only their own orders; admins can manage order status.
- EF Core migration creates the agreed schema and the app can start with local SQL Server configuration.
- Swagger or an HTTP client can exercise the core endpoints; errors do not expose secrets or stack traces.

## 12. Exact C# model contract

The following names, types, nullability, and navigation properties are fixed for v1. Use `int` keys and `DateTime` timestamps in UTC. Nullable reference types should be enabled. Initialize required collection navigation properties to `new List<T>()`. EF navigation properties may be `virtual` only if the team explicitly enables lazy-loading; default is non-virtual and eager/explicit loading.

```csharp
// Models/User.cs
public class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;       // required, max 100
    public string Email { get; set; } = string.Empty;          // required, max 150, unique, normalized lowercase
    public string? Phone { get; set; }                         // optional, max 15
    public string PasswordHash { get; set; } = string.Empty;   // required, max 255
    public UserRole Role { get; set; } = UserRole.Customer;
    public DateTime CreatedAt { get; set; }                    // UTC
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

// Models/Brand.cs
public class Brand
{
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;      // required, max 100
    public string? Description { get; set; }                   // optional, max 500
    public bool IsActive { get; set; } = true;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

// Models/Category.cs
public class Category
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;   // required, max 100
    public string? Description { get; set; }                   // optional, max 500
    public bool IsActive { get; set; } = true;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

// Models/Product.cs
public class Product
{
    public int ProductId { get; set; }
    public int BrandId { get; set; }
    public Brand Brand { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string ProductName { get; set; } = string.Empty;    // required, max 150
    public string? Description { get; set; }                   // optional, max 500
    public string? ImageUrl { get; set; }                       // optional, max 500
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }                    // UTC
    public ICollection<Packaging> Packagings { get; set; } = new List<Packaging>();
}

// Models/Packaging.cs
public class Packaging
{
    public int PackagingId { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string PackagingName { get; set; } = string.Empty;  // required, max 50
    public decimal Price { get; set; }                         // >= 0, SQL decimal(10,2)
    public string Unit { get; set; } = string.Empty;           // required, max 50
    public bool IsActive { get; set; } = true;
    public Inventory? Inventory { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

// Models/Cart.cs
public class Cart
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public CartStatus CartStatus { get; set; } = CartStatus.Active;
    public DateTime CreatedAt { get; set; }                    // UTC
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}

// Models/CartItem.cs
public class CartItem
{
    public int CartItemId { get; set; }
    public int CartId { get; set; }
    public Cart Cart { get; set; } = null!;
    public int PackagingId { get; set; }
    public Packaging Packaging { get; set; } = null!;
    public int Quantity { get; set; }                          // > 0
    public decimal UnitPrice { get; set; }                     // snapshot; SQL decimal(10,2)
}

// Models/Order.cs
public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string OrderNumber { get; set; } = string.Empty;    // required, max 30, unique
    public string DeliveryAddress { get; set; } = string.Empty;// required, max 500
    public decimal TotalAmount { get; set; }                   // SQL decimal(10,2)
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    public DateTime OrderedAt { get; set; }                    // UTC
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

// Models/OrderItem.cs
public class OrderItem
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int PackagingId { get; set; }
    public Packaging Packaging { get; set; } = null!;
    public string ProductName { get; set; } = string.Empty;   // order-time snapshot, max 150
    public string PackagingName { get; set; } = string.Empty; // order-time snapshot, max 50
    public int Quantity { get; set; }                          // > 0
    public decimal UnitPrice { get; set; }                     // order-time snapshot
    public decimal Subtotal { get; set; }                      // Quantity * UnitPrice
}

// Models/Inventory.cs
public class Inventory
{
    public int InventoryId { get; set; }
    public int PackagingId { get; set; }                       // unique FK
    public Packaging Packaging { get; set; } = null!;
    public int StockQuantity { get; set; }                     // >= 0
    public int ReorderLevel { get; set; }                      // >= 0
    public DateTime UpdatedAt { get; set; }                    // UTC
}
```

The `User` relationship to carts/orders is one-to-many. `Brand` and `Category` each have one-to-many products. A product has many packaging rows. Packaging has at most one inventory row, and can appear in many cart and order item rows. All required FK properties and navigation properties must be configured by Member 4 in `RetailDbContext`.

## 13. Exact DTO contracts

DTOs are `public` classes in the feature DTO file. Use `[Required]`, `[StringLength]`, `[EmailAddress]`, `[Range]`, and `[Url]` where applicable. IDs, role, timestamps, prices and totals are response-only unless explicitly identified as editable below.

### AuthDtos.cs and UserDtos.cs

```csharp
public sealed record RegisterRequest(string FullName, string Email, string? Phone, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record UserSummaryDto(int UserId, string FullName, string Email, string Role);
public sealed record AuthResponse(string Token, DateTime ExpiresAtUtc, UserSummaryDto User);
public sealed record UserProfileResponse(int UserId, string FullName, string Email, string? Phone, string Role, DateTime CreatedAtUtc);
public sealed record UpdateUserProfileRequest(string FullName, string? Phone);
```

Validation: full name 1–100 chars; email valid and max 150; phone max 15 when supplied; password 8–100 chars. Normalize email using trim + invariant lowercase before uniqueness checks. Registration always creates `Customer`; clients cannot select a role. `POST /register` returns `201 Created` with `UserProfileResponse` (no token); client then calls login. Login returns `AuthResponse`.

### BrandDtos.cs

```csharp
public sealed record CreateBrandRequest(string BrandName, string? Description);
public sealed record UpdateBrandRequest(string BrandName, string? Description, bool IsActive);
public sealed record BrandResponse(int BrandId, string BrandName, string? Description, bool IsActive);
```

Brand name required, max 100; description max 500.

### CategoryDtos.cs

```csharp
public sealed record CreateCategoryRequest(string CategoryName, string? Description);
public sealed record UpdateCategoryRequest(string CategoryName, string? Description, bool IsActive);
public sealed record CategoryResponse(int CategoryId, string CategoryName, string? Description, bool IsActive);
```

Category name required, max 100; description max 500.

### ProductDtos.cs

```csharp
public sealed record CreateProductRequest(int BrandId, int CategoryId, string ProductName, string? Description, string? ImageUrl);
public sealed record UpdateProductRequest(int BrandId, int CategoryId, string ProductName, string? Description, string? ImageUrl, bool IsActive);
public sealed record ProductListItemResponse(int ProductId, string ProductName, string? Description, string? ImageUrl, int BrandId, string BrandName, int CategoryId, string CategoryName, bool IsActive);
public sealed record ProductDetailResponse(int ProductId, string ProductName, string? Description, string? ImageUrl, BrandResponse Brand, CategoryResponse Category, IReadOnlyList<PackagingResponse> Packagings, DateTime CreatedAtUtc);
```

Product name required, max 150; description max 500; image URL max 500 and absolute HTTP/HTTPS if supplied; BrandId/CategoryId must refer to existing active rows. `GET /products` returns `PagedResponse<ProductListItemResponse>`.

### PackagingDtos.cs

```csharp
public sealed record CreatePackagingRequest(int ProductId, string PackagingName, decimal Price, string Unit);
public sealed record UpdatePackagingRequest(string PackagingName, decimal Price, string Unit, bool IsActive);
public sealed record PackagingResponse(int PackagingId, int ProductId, string ProductName, string PackagingName, decimal Price, string Unit, bool IsActive, int? AvailableQuantity);
```

Name required max 50; unit required max 50; price range 0.00–99,999,999.99; ProductId must exist and be active. `AvailableQuantity` is nullable for public listing only if the API intentionally hides stock; default v1 returns the available nonnegative quantity.

### CartDtos.cs

```csharp
public sealed record AddCartItemRequest(int PackagingId, int Quantity);
public sealed record UpdateCartItemRequest(int Quantity);
public sealed record CartItemResponse(int CartItemId, int PackagingId, string ProductName, string PackagingName, string Unit, int Quantity, decimal UnitPrice, decimal Subtotal);
public sealed record CartResponse(int CartId, string Status, IReadOnlyList<CartItemResponse> Items, decimal TotalAmount, DateTime CreatedAtUtc);
```

Quantity must be 1–100 per request. `Subtotal` and `TotalAmount` are computed by server as price × quantity and sum of subtotals, rounded to 2 decimals. Cart response for no existing active cart is `200` with an empty cart representation? **Fixed behavior:** create an active cart on first `GET /api/cart`, then return it.

### OrderDtos.cs

```csharp
public sealed record PlaceOrderRequest(string DeliveryAddress);
public sealed record UpdateOrderStatusRequest(OrderStatus Status);
public sealed record OrderListItemResponse(int OrderId, string OrderNumber, decimal TotalAmount, string Status, DateTime OrderedAtUtc);
public sealed record OrderItemResponse(int OrderItemId, int PackagingId, string ProductName, string PackagingName, int Quantity, decimal UnitPrice, decimal Subtotal);
public sealed record OrderDetailResponse(int OrderId, string OrderNumber, int UserId, string DeliveryAddress, decimal TotalAmount, string Status, DateTime OrderedAtUtc, IReadOnlyList<OrderItemResponse> Items);
```

Address is required, max 500. `POST /api/orders` returns `201 Created` with `OrderDetailResponse`. Order number is generated server-side, unique, and max 30. `GET /api/orders` returns `PagedResponse<OrderListItemResponse>`.

### InventoryDtos.cs

```csharp
public sealed record SetInventoryRequest(int StockQuantity, int ReorderLevel);
public sealed record AdjustInventoryRequest(int Adjustment, string Reason);
public sealed record InventoryResponse(int InventoryId, int PackagingId, string ProductName, string PackagingName, int StockQuantity, int ReorderLevel, bool IsLowStock, DateTime UpdatedAtUtc);
```

Stock and reorder level must be nonnegative; adjustment reason required max 250. `IsLowStock` is `StockQuantity <= ReorderLevel`. Because there is no inventory adjustment history entity in v1, omit `POST /adjust`; use `PUT` to set exact quantities and record actor/reason in logs only if implemented safely.

### CommonDtos.cs

```csharp
public sealed record PagedResponse<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount, int TotalPages);
```

Pagination defaults: `page=1`, `pageSize=20`; page minimum 1; page size range 1–100. `TotalPages` is zero when `TotalCount` is zero, otherwise ceiling of count/page size. Use this response for product and order lists; do not create feature-specific competing pagination types.

## 14. Repository and service method contracts

Use the following method names and parameter/return types so feature files integrate without signature negotiation. Add `CancellationToken cancellationToken = default` as the final parameter to every async method. Use `Task<T>` even for operations that might return null; nullable return values are shown as `T?`. All service/repository interfaces live in the exact folders already listed.

### Member 1 interfaces

```csharp
IUserRepository:
  Task<User?> GetByIdAsync(int userId, CancellationToken ct = default);
  Task<User?> GetByEmailAsync(string normalizedEmail, CancellationToken ct = default);
  Task<bool> EmailExistsAsync(string normalizedEmail, CancellationToken ct = default);
  Task<User> AddAsync(User user, CancellationToken ct = default);
  Task UpdateAsync(User user, CancellationToken ct = default);

IAuthService:
  Task<UserProfileResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
  Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);

IUserService:
  Task<UserProfileResponse> GetMeAsync(int userId, CancellationToken ct = default);
  Task<UserProfileResponse> UpdateMeAsync(int userId, UpdateUserProfileRequest request, CancellationToken ct = default);
```

`IPasswordHelper` is not required; `PasswordHelper` is a concrete helper registered as singleton or stateless utility. Use ASP.NET Core `PasswordHasher<User>` or a reviewed framework password hasher; never reversible encryption or plain SHA hashing. `IJwtHelper` is not required; `JwtHelper` is a concrete service registered by Member 4. JWT config keys: `Jwt:Issuer`, `Jwt:Audience`, `Jwt:SigningKey`, `Jwt:AccessTokenMinutes`.

### Member 2 interfaces

```csharp
IBrandRepository:
  Task<IReadOnlyList<Brand>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
  Task<Brand?> GetByIdAsync(int id, CancellationToken ct = default);
  Task<Brand> AddAsync(Brand entity, CancellationToken ct = default);
  Task UpdateAsync(Brand entity, CancellationToken ct = default);
  Task<bool> HasProductsAsync(int id, CancellationToken ct = default);

ICategoryRepository:
  Task<IReadOnlyList<Category>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
  Task<Category?> GetByIdAsync(int id, CancellationToken ct = default);
  Task<Category> AddAsync(Category entity, CancellationToken ct = default);
  Task UpdateAsync(Category entity, CancellationToken ct = default);
  Task<bool> HasProductsAsync(int id, CancellationToken ct = default);

IProductRepository:
  Task<PagedResponse<ProductListItemResponse>> GetPageAsync(int? categoryId, int? brandId, string? search, int page, int pageSize, CancellationToken ct = default);
  Task<Product?> GetByIdAsync(int id, bool includeInactive, CancellationToken ct = default);
  Task<Product> AddAsync(Product entity, CancellationToken ct = default);
  Task UpdateAsync(Product entity, CancellationToken ct = default);
  Task<bool> BrandAndCategoryExistAsync(int brandId, int categoryId, CancellationToken ct = default);
```

```csharp
IBrandService:
  Task<IReadOnlyList<BrandResponse>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
  Task<BrandResponse> GetByIdAsync(int id, CancellationToken ct = default);
  Task<BrandResponse> CreateAsync(CreateBrandRequest request, CancellationToken ct = default);
  Task<BrandResponse> UpdateAsync(int id, UpdateBrandRequest request, CancellationToken ct = default);
  Task DeactivateAsync(int id, CancellationToken ct = default);

ICategoryService:
  Task<IReadOnlyList<CategoryResponse>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
  Task<CategoryResponse> GetByIdAsync(int id, CancellationToken ct = default);
  Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct = default);
  Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request, CancellationToken ct = default);
  Task DeactivateAsync(int id, CancellationToken ct = default);

IProductService:
  Task<PagedResponse<ProductListItemResponse>> GetPageAsync(int? categoryId, int? brandId, string? search, int page, int pageSize, CancellationToken ct = default);
  Task<ProductDetailResponse> GetByIdAsync(int id, CancellationToken ct = default);
  Task<ProductDetailResponse> CreateAsync(CreateProductRequest request, CancellationToken ct = default);
  Task<ProductDetailResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default);
  Task DeactivateAsync(int id, CancellationToken ct = default);
```

### Member 3 interfaces

```csharp
IPackagingRepository:
  Task<IReadOnlyList<Packaging>> GetByProductIdAsync(int productId, bool includeInactive, CancellationToken ct = default);
  Task<Packaging?> GetByIdAsync(int id, bool includeInactive, CancellationToken ct = default);
  Task<Packaging> AddAsync(Packaging entity, CancellationToken ct = default);
  Task UpdateAsync(Packaging entity, CancellationToken ct = default);

ICartRepository:
  Task<Cart> GetOrCreateActiveAsync(int userId, CancellationToken ct = default);
  Task<CartItem?> GetItemAsync(int userId, int cartItemId, CancellationToken ct = default);
  Task<CartItem?> GetItemByPackagingAsync(int cartId, int packagingId, CancellationToken ct = default);
  Task<CartItem> AddItemAsync(CartItem item, CancellationToken ct = default);
  Task UpdateItemAsync(CartItem item, CancellationToken ct = default);
  Task RemoveItemAsync(CartItem item, CancellationToken ct = default);

IOrderRepository:
  Task<Order> PlaceOrderAsync(int userId, string deliveryAddress, string orderNumber, CancellationToken ct = default);
  Task<PagedResponse<OrderListItemResponse>> GetPageForUserAsync(int userId, int page, int pageSize, CancellationToken ct = default);
  Task<Order?> GetByIdAsync(int orderId, CancellationToken ct = default);
  Task UpdateStatusAsync(Order order, CancellationToken ct = default);

IPackagingService:
  Task<IReadOnlyList<PackagingResponse>> GetByProductIdAsync(int productId, CancellationToken ct = default);
  Task<PackagingResponse> CreateAsync(CreatePackagingRequest request, CancellationToken ct = default);
  Task<PackagingResponse> UpdateAsync(int id, UpdatePackagingRequest request, CancellationToken ct = default);
  Task DeactivateAsync(int id, CancellationToken ct = default);

ICartService:
  Task<CartResponse> GetAsync(int userId, CancellationToken ct = default);
  Task<CartResponse> AddItemAsync(int userId, AddCartItemRequest request, CancellationToken ct = default);
  Task<CartResponse> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemRequest request, CancellationToken ct = default);
  Task<CartResponse> RemoveItemAsync(int userId, int cartItemId, CancellationToken ct = default);

IOrderService:
  Task<OrderDetailResponse> PlaceOrderAsync(int userId, PlaceOrderRequest request, CancellationToken ct = default);
  Task<PagedResponse<OrderListItemResponse>> GetMyOrdersAsync(int userId, int page, int pageSize, CancellationToken ct = default);
  Task<OrderDetailResponse> GetByIdAsync(int requestingUserId, bool isAdmin, int orderId, CancellationToken ct = default);
  Task<OrderDetailResponse> UpdateStatusAsync(int orderId, OrderStatus status, CancellationToken ct = default);
```

### Member 4 interfaces

```csharp
IInventoryRepository:
  Task<IReadOnlyList<Inventory>> GetAllAsync(CancellationToken ct = default);
  Task<Inventory?> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default);
  Task<Inventory> GetOrCreateForPackagingAsync(int packagingId, CancellationToken ct = default);
  Task UpdateAsync(Inventory inventory, CancellationToken ct = default);

IInventoryService:
  Task<IReadOnlyList<InventoryResponse>> GetAllAsync(CancellationToken ct = default);
  Task<InventoryResponse> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default);
  Task<InventoryResponse> SetAsync(int packagingId, SetInventoryRequest request, CancellationToken ct = default);
```

Avoid adding public repository methods not specified here. If implementation needs another method, the owning member proposes it in writing and updates this document before both sides code against it.

## 15. Exact controller actions and authorization

Use `[ApiController]` and `[Route("api/[controller]")]`, except `AuthController` route is explicitly `api/auth`. Controllers depend on service interfaces only. No controller may use `RetailDbContext` directly.

| Controller | Action | Access | Success response |
|---|---|---|---|
| Auth | `POST api/auth/register` | Anonymous | `201 UserProfileResponse` |
| Auth | `POST api/auth/login` | Anonymous | `200 AuthResponse` |
| Users | `GET api/users/me` | Authenticated | `200 UserProfileResponse` |
| Users | `PUT api/users/me` | Authenticated | `200 UserProfileResponse` |
| Brands | `GET api/brands`, `GET api/brands/{id}` | Anonymous | `200` list/item |
| Brands | `POST`, `PUT {id}`, `DELETE {id}` | Admin | `201`, `200`, `204` |
| Categories | `GET api/categories`, `GET api/categories/{id}` | Anonymous | `200` list/item |
| Categories | `POST`, `PUT {id}`, `DELETE {id}` | Admin | `201`, `200`, `204` |
| Products | `GET api/products`, `GET api/products/{id}` | Anonymous | `200` page/detail |
| Products | `POST`, `PUT {id}`, `DELETE {id}` | Admin | `201`, `200`, `204` |
| Packaging | `GET api/products/{productId}/packaging` | Anonymous | `200 IReadOnlyList<PackagingResponse>` |
| Packaging | `POST api/packaging`, `PUT api/packaging/{id}`, `DELETE api/packaging/{id}` | Admin | `201`, `200`, `204` |
| Cart | `GET api/cart`, `POST api/cart/items`, `PUT api/cart/items/{cartItemId}`, `DELETE api/cart/items/{cartItemId}` | Customer | `200 CartResponse` |
| Orders | `POST api/orders`, `GET api/orders`, `GET api/orders/{id}` | Customer; admin may inspect any order | `201`, `200` |
| Orders | `PATCH api/orders/{id}/status` | Admin | `200 OrderDetailResponse` |
| Inventory | `GET api/inventory`, `GET api/inventory/{packagingId}`, `PUT api/inventory/{packagingId}` | Admin | `200` list/item |

For each action, include `[Authorize]` or `[Authorize(Roles = "Admin")]` as listed. Use the role string exactly `Admin`. Customer/admin role checks must not be inferred from request DTO values.

## 16. Database and runtime configuration contract

### DbContext

`RetailDbContext` must expose these exact DbSets:

```csharp
public DbSet<User> Users => Set<User>();
public DbSet<Brand> Brands => Set<Brand>();
public DbSet<Category> Categories => Set<Category>();
public DbSet<Product> Products => Set<Product>();
public DbSet<Packaging> Packagings => Set<Packaging>();
public DbSet<Cart> Carts => Set<Cart>();
public DbSet<CartItem> CartItems => Set<CartItem>();
public DbSet<Order> Orders => Set<Order>();
public DbSet<OrderItem> OrderItems => Set<OrderItem>();
public DbSet<Inventory> Inventories => Set<Inventory>();
```

Member 4 alone edits DbContext. Configure all string max lengths, required/optional fields, unique indexes on `User.Email`, `Order.OrderNumber`, `Inventory.PackagingId`, decimal precision `(10,2)`, and enum conversions. Use SQL Server identity keys. FK delete behavior is `Restrict` for products/packaging/orders/users where historical data must remain; cascading is permitted from Cart to CartItem and Order to OrderItem only if the team confirms history deletion semantics. Preferred v1: never delete orders/users; deactivate catalog entities.

### `appsettings.json` keys

```json
{
  "ConnectionStrings": { "RetailDatabase": "" },
  "Jwt": {
    "Issuer": "RetailOrdering.Api",
    "Audience": "RetailOrdering.Client",
    "SigningKey": "SET_WITH_USER_SECRETS_OR_ENVIRONMENT_VARIABLE",
    "AccessTokenMinutes": 60
  },
  "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } },
  "AllowedHosts": "*"
}
```

Local environment variables use `ConnectionStrings__RetailDatabase`, `Jwt__SigningKey`, and other double-underscore equivalents. Do not check a real signing key or database password into Git. Development database and migration instructions belong in README, not hardcoded in source.

### Program.cs registration order

Member 4 registers controllers, Swagger in development, SQL Server `RetailDbContext`, JWT authentication, authorization, feature repositories/services, exception handler, request logging, and maps controllers. Middleware order: exception handler first; HTTPS redirection; authentication; authorization; controller mapping. `UseAuthentication()` must appear before `UseAuthorization()`.

## 17. Fixed rules for ambiguous cases

- The `DashboardController` and payment entities/controllers from an earlier draft are excluded from v1 because they are absent from the final requested tree and ER diagram.
- `ProductStatus` is excluded from behavior; `Product.IsActive` is the only product activation flag. Keep the enum file only if the existing requested skeleton requires it, but do not use it in DTOs or persistence.
- No `Payment`, `PaymentStatus`, or `PaymentMethod` classes/endpoints in v1.
- Packaging list endpoint ownership is Member 3 and route is exactly `GET /api/products/{productId}/packaging`.
- Inventory endpoint `PUT` sets exact quantities. There is no `/adjust` endpoint or inventory audit table in v1.
- Product and order list endpoints use the exact `PagedResponse<T>` shape and page defaults defined above.
- All order cancellation/restocking is out of scope. Admin status transitions are `Pending -> Confirmed -> Preparing -> Ready -> Delivered`; `Pending` or `Confirmed` may transition to `Cancelled`. No other transitions are allowed.
- Existing customers cannot set their own role. Seed admin creation is a development-only operation using environment-provided credentials; never commit default admin credentials.
- For duplicate email, brand/category uniqueness, or order number collisions, return a conflict response. Brand and category names are unique case-insensitively; product names are not unique.
- If any developer believes a requirement is impossible or internally inconsistent, stop that specific implementation, report the section and proposed change, and wait for team agreement. Do not silently invent a competing contract.
