using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMembersRollRepository : IRescueMembersRollRepository
    {
        public async Task<IEnumerable<RescueMembersRoll>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName) => await RescueMembersRollDAO.GetRescueMembersRolls(rescueMembersRollId, rollName);

        public async Task<RescueMembersRoll?> CreateRescueMembersRoll(RescueMembersRoll roll) => await RescueMembersRollDAO.CreateRescueMembersRoll(roll);

        public async Task<bool> UpdateRescueMembersRoll(RescueMembersRoll roll) => await RescueMembersRollDAO.UpdateRescueMembersRoll(roll);
    }
}
