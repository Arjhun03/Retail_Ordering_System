namespace Retail_Ordering_system.DTOs;

public sealed record CreatePackagingRequest(int ProductId, string PackagingName, decimal Price, string Unit);
public sealed record UpdatePackagingRequest(string PackagingName, decimal Price, string Unit, bool IsActive);
public sealed record PackagingResponse(int PackagingId, int ProductId, string ProductName, string PackagingName, decimal Price, string Unit, bool IsActive, int? AvailableQuantity);
