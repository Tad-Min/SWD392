using System;

namespace BusinessObject.OverlutEntiy;

public partial class VolunteerOffer
{
    public int OfferId { get; set; }

    public int UserId { get; set; }

    public int OfferTypeId { get; set; }

    /// <summary>Required when IsReturnRequired = true (tracked asset name).</summary>
    public string? OfferName { get; set; }

    public decimal Quantity { get; set; }

    public string? Unit { get; set; }

    public string? Description { get; set; }

    /// <summary>True for boats, equipment etc. False for food / consumables.</summary>
    public bool IsReturnRequired { get; set; }

    /// <summary>Serial or asset code for returnable items. Nullable for consumables.</summary>
    public string? AssetCode { get; set; }

    /// <summary>Available = 0, Assigned = 1, Returned = 2, Consumed = 3</summary>
    public int CurrentStatus { get; set; }

    public string? DropoffLocationText { get; set; }

    public double? DropoffLatitude { get; set; }

    public double? DropoffLongitude { get; set; }

    public string? ContactPhone { get; set; }

    public DateTime? AvailableFrom { get; set; }

    public DateTime? AvailableTo { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation
    public virtual User User { get; set; } = null!;
    public virtual VolunteerOfferType OfferType { get; set; } = null!;

    public virtual ICollection<VolunteerOfferAssignment> Assignments { get; set; } = new List<VolunteerOfferAssignment>();
}
