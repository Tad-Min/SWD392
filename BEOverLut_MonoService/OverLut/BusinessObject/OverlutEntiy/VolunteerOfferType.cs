using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class VolunteerOfferType
{
    public int OfferTypeId { get; set; }

    /// <summary>e.g. Food, LifeJacket, Boat, MedicalSupplies, RescueEquipment, Other</summary>
    public string TypeName { get; set; } = null!;

    /// <summary>If true, items of this type are typically returnable (non-consumable).</summary>
    public bool IsTypicallyReturnable { get; set; }

    public virtual ICollection<VolunteerOffer> VolunteerOffers { get; set; } = new List<VolunteerOffer>();
}
