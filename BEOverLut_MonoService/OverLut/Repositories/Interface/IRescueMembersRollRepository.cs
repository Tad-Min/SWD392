using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueMembersRollRepository
    {
        Task<IEnumerable<RescueMembersRoll>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName);
            Task<RescueMembersRoll?> CreateRescueMembersRoll(RescueMembersRoll roll);
            Task<bool> UpdateRescueMembersRoll(RescueMembersRoll roll);
    }
}
