using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class VolunteerSkillType
{
    public int SkillTypeId { get; set; }

    /// <summary>e.g. MedicalSupport, DirectRescuer, LogisticsSupport, BoatOperator</summary>
    public string SkillName { get; set; } = null!;

    public virtual ICollection<VolunteerSkill> VolunteerSkills { get; set; } = new List<VolunteerSkill>();
}
