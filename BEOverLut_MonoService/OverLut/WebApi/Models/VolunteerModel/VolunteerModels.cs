namespace WebApi.Models.VolunteerModel;

public class RegisterVolunteerModel
{
    public string? Notes { get; set; }
}

public class UpdateVolunteerModel
{
    public bool IsAvailable { get; set; }
    public string? Notes { get; set; }
}

public class ApproveVolunteerModel { }

public class RejectVolunteerModel
{
    public string? Reason { get; set; }
}

public class SuspendVolunteerModel
{
    public string? Reason { get; set; }
}

public class SetSkillsModel
{
    /// <summary>List of SkillTypeIds to set. Replaces all existing skills atomically.</summary>
    public List<int> SkillTypeIds { get; set; } = new();
}

public class CreateOfferModel
{
    public int OfferTypeId { get; set; }

    /// <summary>Required when IsReturnRequired = true.</summary>
    public string? OfferName { get; set; }

    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Description { get; set; }

    public bool IsReturnRequired { get; set; }
    public string? AssetCode { get; set; }

    public string? DropoffLocationText { get; set; }
    public double? DropoffLatitude { get; set; }
    public double? DropoffLongitude { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableTo { get; set; }
}

public class UpdateOfferModel : CreateOfferModel { }
