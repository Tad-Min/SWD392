using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestsTypeRepository : IRescueRequestsTypeRepository
    {
        public async Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName) => await RescueRequestsTypeDAO.GetAllRescueRequestsType(typeName);

        public async Task<RescueRequestsType?> GetRescueRequestsTypeById(int id) => await RescueRequestsTypeDAO.GetRescueRequestsTypeById(id);
    }
}
