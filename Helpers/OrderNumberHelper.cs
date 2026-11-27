namespace Retail_Ordering.Api.Helpers;

public static class OrderNumberHelper
{
    public static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
    }
}