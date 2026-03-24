using System;

namespace DTOs.Overlut;

public class VolunteerOfferDTO
{
    public int OfferId { get; set; }
    public int UserId { get; set; }
    public string? OwnerName { get; set; }
    public int OfferTypeId { get; set; }
    public string? OfferTypeName { get; set; }
    public string? OfferName { get; set; }
    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Description { get; set; }
    public bool IsReturnRequired { get; set; }
    public string? AssetCode { get; set; }

    /// <summary>0=Available, 1=Assigned, 2=Returned, 3=Consumed</summary>
    public int CurrentStatus { get; set; }
    public string CurrentStatusName => CurrentStatus switch
    {
        0 => "Available",
        1 => "Assigned",
        2 => "Returned",
        3 => "Consumed",
        _ => "Unknown"
    };

    public string? DropoffLocationText { get; set; }
    public double? DropoffLatitude { get; set; }
    public double? DropoffLongitude { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableTo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
