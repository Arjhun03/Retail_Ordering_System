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
