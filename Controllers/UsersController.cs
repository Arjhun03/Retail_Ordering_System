using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Retail_Ordering.Api;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileResponse>> GetMe(CancellationToken ct)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var response = await _userService.GetMeAsync(userId, ct);
        return Ok(response);
    }

    [HttpPut("me")]
    [ProducesResponseType(typeof(UserProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileResponse>> UpdateMe(
        [FromBody] UpdateUserProfileRequest request,
        CancellationToken ct)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var response = await _userService.UpdateMeAsync(userId, request, ct);
        return Ok(response);
    }

    [HttpGet("brand-managers")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IReadOnlyList<BrandManagerResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<BrandManagerResponse>>> GetBrandManagers(CancellationToken ct)
    {
        var managers = await _userService.GetBrandManagersAsync(ct);
        return Ok(managers);
    }

    [HttpPost("brand-managers")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BrandManagerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<BrandManagerResponse>> CreateBrandManager(
        [FromBody] CreateBrandManagerRequest request,
        CancellationToken ct)
    {
        try
        {
            var manager = await _userService.CreateBrandManagerAsync(request, ct);
            return StatusCode(StatusCodes.Status201Created, manager);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out int userId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out userId);
    }
}
