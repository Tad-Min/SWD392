using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueTeamRepository : IRescueTeamRepository
    {
        public async Task<IEnumerable<RescueTeam>?> GetAllRescueTeam(int? teamId = null, string? teamName = null, int? statusId = null) => await RescueTeamDAO.GetAllRescueTeam(teamId, teamName, statusId);

        public async Task<RescueTeam?> CreateRescueTeam(RescueTeam rescueTeam) => await RescueTeamDAO.CreateRescueTeam(rescueTeam);

        public async Task<bool> UpdateRescueTeam(RescueTeam rescueTeam) => await RescueTeamDAO.UpdateRescueTeam(rescueTeam);

        public async Task<bool> DeleteRescueTeamById(int teamId) => await RescueTeamDAO.DeleteRescueTeamById(teamId);
    }
}
