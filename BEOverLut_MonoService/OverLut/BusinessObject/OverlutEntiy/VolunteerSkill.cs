namespace BusinessObject.OverlutEntiy;

public partial class VolunteerSkill
{
    public int VolunteerSkillId { get; set; }

    public int UserId { get; set; }

    public int SkillTypeId { get; set; }

    // Navigation
    public virtual User User { get; set; } = null!;
    public virtual VolunteerSkillType SkillType { get; set; } = null!;
}
