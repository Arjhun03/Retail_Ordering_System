RetailOrderingSystem (Solution)
│
└── RetailOrdering.Api
    │
    ├── Connected Services
    ├── Dependencies
    ├── Properties
    │
    ├── Controllers
    │   ├── AuthController.cs
    │   ├── UsersController.cs
    │   ├── ProductsController.cs
    │   ├── CategoriesController.cs
    │   ├── BrandsController.cs
    │   ├── PackagingController.cs
    │   ├── CartController.cs
    │   ├── OrdersController.cs
    │   ├── PaymentsController.cs
    │   ├── InventoryController.cs
    │   └── DashboardController.cs
    │
    ├── Data
    │   ├── RetailDbContext.cs
    │   └── DbSeeder.cs
    │
    ├── DTOs
    │   ├── AuthDtos.cs
    │   ├── UserDtos.cs
    │   ├── ProductDtos.cs
    │   ├── CategoryDtos.cs
    │   ├── BrandDtos.cs
    │   ├── PackagingDtos.cs
    │   ├── CartDtos.cs
    │   ├── OrderDtos.cs
    │   ├── PaymentDtos.cs
    │   ├── InventoryDtos.cs
    │   ├── DashboardDtos.cs
    │   └── CommonDtos.cs
    │
    ├── Enums
    │   ├── UserRole.cs
    │   ├── ProductStatus.cs
    │   ├── OrderStatus.cs
    │   ├── PaymentStatus.cs
    │   └── PaymentMethod.cs
    │
    ├── Helpers
    │   ├── JwtHelper.cs
    │   ├── PasswordHelper.cs
    │   ├── OrderNumberHelper.cs
    │   └── QueryHelpers.cs
    │
    ├── Interfaces
    │   │
    │   ├── Repositories
    │   │   ├── IUserRepository.cs
    │   │   ├── IProductRepository.cs
    │   │   ├── ICategoryRepository.cs
    │   │   ├── IBrandRepository.cs
    │   │   ├── IPackagingRepository.cs
    │   │   ├── ICartRepository.cs
    │   │   ├── IOrderRepository.cs
    │   │   ├── IPaymentRepository.cs
    │   │   └── IInventoryRepository.cs
    │   │
    │   └── Services
    │       ├── IAuthService.cs
    │       ├── IUserService.cs
    │       ├── IProductService.cs
    │       ├── ICategoryService.cs
    │       ├── IBrandService.cs
    │       ├── IPackagingService.cs
    │       ├── ICartService.cs
    │       ├── IOrderService.cs
    │       ├── IPaymentService.cs
    │       ├── IInventoryService.cs
    │       └── IDashboardService.cs
    │
    ├── Middleware
    │   ├── GlobalExceptionHandler.cs
    │   └── RequestLoggingMiddleware.cs
    │
    ├── Migrations
    │
    ├── Models
    │   ├── User.cs
    │   ├── Product.cs
    │   ├── Category.cs
    │   ├── Brand.cs
    │   ├── Packaging.cs
    │   ├── Cart.cs
    │   ├── CartItem.cs
    │   ├── Order.cs
    │   ├── OrderItem.cs
    │   ├── Payment.cs
    │   └── Inventory.cs
    │
    ├── Repositories
    │   ├── UserRepository.cs
    │   ├── ProductRepository.cs
    │   ├── CategoryRepository.cs
    │   ├── BrandRepository.cs
    │   ├── PackagingRepository.cs
    │   ├── CartRepository.cs
    │   ├── OrderRepository.cs
    │   ├── PaymentRepository.cs
    │   └── InventoryRepository.cs
    │
    ├── Services
    │   ├── AuthService.cs
    │   ├── UserService.cs
    │   ├── ProductService.cs
    │   ├── CategoryService.cs
    │   ├── BrandService.cs
    │   ├── PackagingService.cs
    │   ├── CartService.cs
    │   ├── OrderService.cs
    │   ├── PaymentService.cs
    │   ├── InventoryService.cs
    │   └── DashboardService.cs
    │
    ├── appsettings.json
    ├── appsettings.Development.json
    ├── Program.cs
    └── RetailOrdering.Api.csproj