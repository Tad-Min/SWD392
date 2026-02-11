using BusinessObject.OverlutEntiy;
using BusinessObject.OverlutStorageEntiy;
using DTOs.Overlut;
using DTOs.OverlutStorage;

namespace DTOs
{
    public class MappingHandle : IMappingHandle
    {
        private MappingHandle()
        {
        }

        #region EntityToDTO
        
        public static AttachmentMissionDTO? EntityToDTO(AttachmentMission entity)
        {
            return new AttachmentMissionDTO
            {
                AttachmentId = entity.AttachmentId,
                MissionId = entity.MissionId,
                FileSize = entity.FileSize,
                FileType = entity.FileType
            };
        }

        public static AttachmentRescueDTO? EntityToDTO(AttachmentRescue entity)
        {
            return new AttachmentRescueDTO
            {
                AttachmentId = entity.AttachmentId,
                RescueRequestId = entity.RescueRequestId,
                FileSize = entity.FileSize,
                FileType = entity.FileType
            };
        }

        public static CategoryDTO? EntityToDTO(Category entity)
        {
            return new CategoryDTO
            {
                CategoryId = entity.CategoryId,
                CategoryName = entity.CategoryName
            };
        }

        public static InventoryTransactionDTO? EntityToDTO(InventoryTransaction entity)
        {
            return new InventoryTransactionDTO
            {
                TxId = entity.TxId,
                WarehouseId = entity.WarehouseId,
                ProductId = entity.ProductId,
                TxType = entity.TxType,
                Quantity = entity.Quantity,
                MissionId = entity.MissionId,
                CreatedByUserId = entity.CreatedByUserId,
                CreatedAt = entity.CreatedAt
            };
        }

        
        public static MissionLogDTO? EntityToDTO(MissionLog entity)
        {
            return new MissionLogDTO
            {
                LogId = entity.LogId,
                MissionId = entity.MissionId,
                OldRescueMissions = entity.OldRescueMissions,
                ChangedByUserId = entity.ChangedByUserId,
                ChangedAt = entity.ChangedAt
            };
        }

        public static ProductDTO? EntityToDTO(Product entity)
        {
            return new ProductDTO
            {
                ProductId = entity.ProductId,
                ProductName = entity.ProductName,
                CategoryId = entity.CategoryId,
                Unit = entity.Unit
            };
        }

        public static RefreshTokenDTO? EntityToDTO(RefreshToken entity)
        {
            return new RefreshTokenDTO
            {
                RefreshTokenId = entity.RefreshTokenId,
                UserId = entity.UserId,
                Token = entity.Token,
                CreatedAt = entity.CreatedAt,
                ExpiredAt = entity.ExpiredAt,
                Revoked = entity.Revoked,
                Ipaddress = entity.Ipaddress,
                UserAgent = entity.UserAgent
            };
        }

        public static RescueMembersRollDTO? EntityToDTO(RescueMembersRoll entity)
        {
            return new RescueMembersRollDTO
            {
                RescueMembersRollId = entity.RescueMembersRollId,
                RollName = entity.RollName
            };
        }

        public static RescueMissionDTO? EntityToDTO(RescueMission entity)
        {
            return new RescueMissionDTO
            {
                MissionId = entity.MissionId,
                RescueRequestId = entity.RescueRequestId,
                CoordinatorUserId = entity.CoordinatorUserId,
                TeamId = entity.TeamId,
                StatusId = entity.StatusId,
                AssignedAt = entity.AssignedAt
            };
        }

        public static RescueMissionsStatusDTO? EntityToDTO(RescueMissionsStatus entity)
        {
            return new RescueMissionsStatusDTO
            {
                RescueMissionsStatusId = entity.RescueMissionsStatusId,
                StatusName = entity.StatusName
            };
        }

        public static RescueRequestDTO? EntityToDTO(RescueRequest entity)
        {
            return new RescueRequestDTO
            {
                RescueRequestId = entity.RescueRequestId,
                UserReqId = entity.UserReqId,
                RequestType = entity.RequestType,
                UrgencyLevel = entity.UrgencyLevel,
                Ipaddress = entity.Ipaddress,
                UserAgent = entity.UserAgent,
                Status = entity.Status,
                Description = entity.Description,
                PeopleCount = entity.PeopleCount,
                Location = entity.Location,
                LocationText = entity.LocationText,
                CreatedAt = entity.CreatedAt
            };
        }

        public static RescueRequestLogDTO? EntityToDTO(RescueRequestLog entity)
        {
            return new RescueRequestLogDTO
            {
                LogId = entity.LogId,
                RescueRequestId = entity.RescueRequestId,
                OldRescueRequests = entity.OldRescueRequests,
                ChangedByUserId = entity.ChangedByUserId,
                ChangedAt = entity.ChangedAt
            };
        }

        public static RescueRequestsStatusDTO? EntityToDTO(RescueRequestsStatus entity)
        {
            return new RescueRequestsStatusDTO
            {
                RescueRequestsStatusId = entity.RescueRequestsStatusId,
                StatusName = entity.StatusName
            };
        }

        public static RescueRequestsTypeDTO? EntityToDTO(RescueRequestsType entity)
        {
            return new RescueRequestsTypeDTO
            {
                RescueRequestsTypeId = entity.RescueRequestsTypeId,
                TypeName = entity.TypeName
            };
        }

        public static RescueTeamDTO? EntityToDTO(RescueTeam entity)
        {
            return new RescueTeamDTO
            {
                TeamId = entity.TeamId,
                TeamName = entity.TeamName,
                StatusId = entity.StatusId,
                CreatedAt = entity.CreatedAt
            };
        }

        public static RescueTeamMemberDTO? EntityToDTO(RescueTeamMember entity)
        {
            return new RescueTeamMemberDTO
            {
                UserId = entity.UserId,
                TeamId = entity.TeamId,
                RoleId = entity.RoleId
            };
        }

        public static RescueTeamsStatusDTO? EntityToDTO(RescueTeamsStatus entity)
        {
            return new RescueTeamsStatusDTO
            {
                RescueTeamsStatusId = entity.RescueTeamsStatusId,
                StatusName = entity.StatusName
            };
        }

        public static RoleDTO? EntityToDTO(Role entity)
        {
            return new RoleDTO
            {
                RoleId = entity.RoleId,
                RoleName = entity.RoleName
            };
        }

        public static UrgencyLevelDTO? EntityToDTO(UrgencyLevel entity)
        {
            return new UrgencyLevelDTO
            {
                UrgencyLevelId = entity.UrgencyLevelId,
                UrgencyName = entity.UrgencyName
            };
        }

        public static UserDTO? EntityToDTO(User entity)
        {
            return new UserDTO
            {
                UserId = entity.UserId,
                RoleId = entity.RoleId,
                FullName = entity.FullName,
                IdentifyId = entity.IdentifyId,
                Address = entity.Address,
                Email = entity.Email,
                Phone = entity.Phone,
                Password = entity.Password,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt
            };
        }

        public static VehicleAssignmentDTO? EntityToDTO(VehicleAssignment entity)
        {
            return new VehicleAssignmentDTO
            {
                MissionId = entity.MissionId,
                VehicleId = entity.VehicleId,
                AssignedAt = entity.AssignedAt,
                ReleasedAt = entity.ReleasedAt
            };
        }

        public static VehicleDTO? EntityToDTO(Vehicle entity)
        {
            return new VehicleDTO
            {
                VehicleId = entity.VehicleId,
                VehicleCode = entity.VehicleCode,
                VehicleType = entity.VehicleType,
                Capacity = entity.Capacity,
                StatusId = entity.StatusId,
                Note = entity.Note
            };
        }

        public static VehiclesStatusDTO? EntityToDTO(VehiclesStatus entity)
        {
            return new VehiclesStatusDTO
            {
                VehiclesStatusId = entity.VehiclesStatusId,
                StatusName = entity.StatusName
            };
        }

        public static VehiclesTypeDTO? EntityToDTO(VehiclesType entity)
        {
            return new VehiclesTypeDTO
            {
                VehicleTypeId = entity.VehicleTypeId,
                TypeName = entity.TypeName
            };
        }

        public static WarehouseDTO? EntityToDTO(Warehouse entity)
        {
            return new WarehouseDTO
            {
                WarehouseId = entity.WarehouseId,
                WarehouseName = entity.WarehouseName,
                Location = entity.Location,
                LocationText = entity.LocationText,
                Address = entity.Address,
                IsActive = entity.IsActive
            };
        }

        public static WarehouseStockDTO? EntityToDTO(WarehouseStock entity)
        {
            return new WarehouseStockDTO
            {
                WarehouseId = entity.WarehouseId,
                ProductId = entity.ProductId,
                CurrentQuantity = entity.CurrentQuantity,
                LastUpdated = entity.LastUpdated
            };
        }

        public static AttachmentDTO? EntityToDTO(Attachment entity)
        {
            return new AttachmentDTO
            {
                AttachmentId = entity.AttachmentId,
                IsComplete = entity.IsComplete,
                CreatedAt = entity.CreatedAt
            };
        }

        public static FileChunkDTO? EntityToDTO(FileChunk entity)
        {
            return new FileChunkDTO
            {
                ChunkId = entity.ChunkId,
                AttachmentId = entity.AttachmentId,
                SequenceNumber = entity.SequenceNumber,
                Data = entity.Data
            };
        }
        #endregion

        #region DTOToEntity
        

        public static AttachmentMission? DTOToEntity(AttachmentMissionDTO dto)
        {
            return new AttachmentMission
            {
                AttachmentId = dto.AttachmentId,
                MissionId = dto.MissionId,
                FileSize = dto.FileSize,
                FileType = dto.FileType
            };
        }

        public static AttachmentRescue? DTOToEntity(AttachmentRescueDTO dto)
        {
            return new AttachmentRescue
            {
                AttachmentId = dto.AttachmentId,
                RescueRequestId = dto.RescueRequestId,
                FileSize = dto.FileSize,
                FileType = dto.FileType
            };
        }

        public static Category? DTOToEntity(CategoryDTO dto)
        {
            return new Category
            {
                CategoryId = dto.CategoryId,
                CategoryName = dto.CategoryName
            };
        }

        public static InventoryTransaction? DTOToEntity(InventoryTransactionDTO dto)
        {
            return new InventoryTransaction
            {
                TxId = dto.TxId,
                WarehouseId = dto.WarehouseId,
                ProductId = dto.ProductId,
                TxType = dto.TxType,
                Quantity = dto.Quantity,
                MissionId = dto.MissionId,
                CreatedByUserId = dto.CreatedByUserId,
                CreatedAt = dto.CreatedAt
            };
        }

       

        public static MissionLog? DTOToEntity(MissionLogDTO dto)
        {
            return new MissionLog
            {
                LogId = dto.LogId,
                MissionId = dto.MissionId,
                OldRescueMissions = dto.OldRescueMissions,
                ChangedByUserId = dto.ChangedByUserId,
                ChangedAt = dto.ChangedAt
            };
        }

        public static Product? DTOToEntity(ProductDTO dto)
        {
            return new Product
            {
                ProductId = dto.ProductId,
                ProductName = dto.ProductName,
                CategoryId = dto.CategoryId,
                Unit = dto.Unit
            };
        }

        public static RefreshToken? DTOToEntity(RefreshTokenDTO dto)
        {
            return new RefreshToken
            {
                RefreshTokenId = dto.RefreshTokenId,
                UserId = dto.UserId,
                Token = dto.Token,
                CreatedAt = dto.CreatedAt,
                ExpiredAt = dto.ExpiredAt,
                Revoked = dto.Revoked,
                Ipaddress = dto.Ipaddress,
                UserAgent = dto.UserAgent
            };
        }

        public static RescueMembersRoll? DTOToEntity(RescueMembersRollDTO dto)
        {
            return new RescueMembersRoll
            {
                RescueMembersRollId = dto.RescueMembersRollId,
                RollName = dto.RollName
            };
        }

        public static RescueMission? DTOToEntity(RescueMissionDTO dto)
        {
            return new RescueMission
            {
                MissionId = dto.MissionId,
                RescueRequestId = dto.RescueRequestId,
                CoordinatorUserId = dto.CoordinatorUserId,
                TeamId = dto.TeamId,
                StatusId = dto.StatusId,
                AssignedAt = dto.AssignedAt
            };
        }

        public static RescueMissionsStatus? DTOToEntity(RescueMissionsStatusDTO dto)
        {
            return new RescueMissionsStatus
            {
                RescueMissionsStatusId = dto.RescueMissionsStatusId,
                StatusName = dto.StatusName
            };
        }

        public static RescueRequest? DTOToEntity(RescueRequestDTO dto)
        {
            return new RescueRequest
            {
                RescueRequestId = dto.RescueRequestId,
                UserReqId = dto.UserReqId,
                RequestType = dto.RequestType,
                UrgencyLevel = dto.UrgencyLevel,
                Ipaddress = dto.Ipaddress,
                UserAgent = dto.UserAgent,
                Status = dto.Status,
                Description = dto.Description,
                PeopleCount = dto.PeopleCount,
                Location = dto.Location,
                LocationText = dto.LocationText,
                CreatedAt = dto.CreatedAt
            };
        }

        public static RescueRequestLog? DTOToEntity(RescueRequestLogDTO dto)
        {
            return new RescueRequestLog
            {
                LogId = dto.LogId,
                RescueRequestId = dto.RescueRequestId,
                OldRescueRequests = dto.OldRescueRequests,
                ChangedByUserId = dto.ChangedByUserId,
                ChangedAt = dto.ChangedAt
            };
        }

        public static RescueRequestsStatus? DTOToEntity(RescueRequestsStatusDTO dto)
        {
            return new RescueRequestsStatus
            {
                RescueRequestsStatusId = dto.RescueRequestsStatusId,
                StatusName = dto.StatusName
            };
        }

        public static RescueRequestsType? DTOToEntity(RescueRequestsTypeDTO dto)
        {
            return new RescueRequestsType
            {
                RescueRequestsTypeId = dto.RescueRequestsTypeId,
                TypeName = dto.TypeName
            };
        }

        public static RescueTeam? DTOToEntity(RescueTeamDTO dto)
        {
            return new RescueTeam
            {
                TeamId = dto.TeamId,
                TeamName = dto.TeamName,
                StatusId = dto.StatusId,
                CreatedAt = dto.CreatedAt
            };
        }

        public static RescueTeamMember? DTOToEntity(RescueTeamMemberDTO dto)
        {
            return new RescueTeamMember
            {
                UserId = dto.UserId,
                TeamId = dto.TeamId,
                RoleId = dto.RoleId
            };
        }

        public static RescueTeamsStatus? DTOToEntity(RescueTeamsStatusDTO dto)
        {
            return new RescueTeamsStatus
            {
                RescueTeamsStatusId = dto.RescueTeamsStatusId,
                StatusName = dto.StatusName
            };
        }

        public static Role? DTOToEntity(RoleDTO dto)
        {
            return new Role
            {
                RoleId = dto.RoleId,
                RoleName = dto.RoleName
            };
        }

        public static UrgencyLevel? DTOToEntity(UrgencyLevelDTO dto)
        {
            return new UrgencyLevel
            {
                UrgencyLevelId = dto.UrgencyLevelId,
                UrgencyName = dto.UrgencyName
            };
        }

        public static User? DTOToEntity(UserDTO dto)
        {
            return new User
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                FullName = dto.FullName,
                IdentifyId = dto.IdentifyId,
                Address = dto.Address,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,
                IsActive = dto.IsActive,
                CreatedAt = dto.CreatedAt
            };
        }

        public static VehicleAssignment? DTOToEntity(VehicleAssignmentDTO dto)
        {
            return new VehicleAssignment
            {
                MissionId = dto.MissionId,
                VehicleId = dto.VehicleId,
                AssignedAt = dto.AssignedAt,
                ReleasedAt = dto.ReleasedAt
            };
        }

        public static Vehicle? DTOToEntity(VehicleDTO dto)
        {
            return new Vehicle
            {
                VehicleId = dto.VehicleId,
                VehicleCode = dto.VehicleCode,
                VehicleType = dto.VehicleType,
                Capacity = dto.Capacity,
                StatusId = dto.StatusId,
                Note = dto.Note
            };
        }

        public static VehiclesStatus? DTOToEntity(VehiclesStatusDTO dto)
        {
            return new VehiclesStatus
            {
                VehiclesStatusId = dto.VehiclesStatusId,
                StatusName = dto.StatusName
            };
        }

        public static VehiclesType? DTOToEntity(VehiclesTypeDTO dto)
        {
            return new VehiclesType
            {
                VehicleTypeId = dto.VehicleTypeId,
                TypeName = dto.TypeName
            };
        }

        public static Warehouse? DTOToEntity(WarehouseDTO dto)
        {
            return new Warehouse
            {
                WarehouseId = dto.WarehouseId,
                WarehouseName = dto.WarehouseName,
                Location = dto.Location,
                LocationText = dto.LocationText,
                Address = dto.Address,
                IsActive = dto.IsActive
            };
        }

        public static WarehouseStock? DTOToEntity(WarehouseStockDTO dto)
        {
            return new WarehouseStock
            {
                WarehouseId = dto.WarehouseId,
                ProductId = dto.ProductId,
                CurrentQuantity = dto.CurrentQuantity,
                LastUpdated = dto.LastUpdated
            };
        }

        public static Attachment? DTOToEntity(AttachmentDTO dto)
        {
            return new Attachment
            {
                AttachmentId = dto.AttachmentId,
                IsComplete = dto.IsComplete,
                CreatedAt = dto.CreatedAt
            };
        }

        public static FileChunk? DTOToEntity(FileChunkDTO dto)
        {
            return new FileChunk
            {
                ChunkId = dto.ChunkId,
                AttachmentId = dto.AttachmentId,
                SequenceNumber = dto.SequenceNumber,
                Data = dto.Data
            };
        }
        #endregion
    }
}
