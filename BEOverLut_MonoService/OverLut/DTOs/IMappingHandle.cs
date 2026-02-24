using BusinessObject.OverlutEntiy;
using BusinessObject.OverlutStorageEntiy;
using DTOs.Overlut;
using DTOs.OverlutStorage;

namespace DTOs
{
    internal interface IMappingHandle
    {
        #region EntityToDTO
        static abstract AttachmentMissionDTO? EntityToDTO(AttachmentMission? entity);
        static abstract AttachmentRescueDTO? EntityToDTO(AttachmentRescue? entity);
        static abstract CategoryDTO? EntityToDTO(Category? entity);
        static abstract InventoryTransactionDTO? EntityToDTO(InventoryTransaction? entity);
        static abstract MissionLogDTO? EntityToDTO(MissionLog? entity);
        static abstract ProductDTO? EntityToDTO(Product? entity);
        static abstract RefreshTokenDTO? EntityToDTO(RefreshToken? entity);
        static abstract RescueMembersRoleDTO? EntityToDTO(RescueMembersRole? entity);
        static abstract RescueMissionDTO? EntityToDTO(RescueMission? entity);
        static abstract RescueMissionsStatusDTO? EntityToDTO(RescueMissionsStatus? entity);
        static abstract RescueRequestDTO? EntityToDTO(RescueRequest? entity);
        static abstract RescueRequestLogDTO? EntityToDTO(RescueRequestLog? entity);
        static abstract RescueRequestsStatusDTO? EntityToDTO(RescueRequestsStatus? entity);
        static abstract RescueRequestsTypeDTO? EntityToDTO(RescueRequestsType? entity);
        static abstract RescueTeamDTO? EntityToDTO(RescueTeam? entity);
        static abstract RescueTeamMemberDTO? EntityToDTO(RescueTeamMember? entity);
        static abstract RescueTeamsStatusDTO? EntityToDTO(RescueTeamsStatus? entity);
        static abstract RoleDTO? EntityToDTO(Role? entity);
        static abstract UrgencyLevelDTO? EntityToDTO(UrgencyLevel? entity);
        static abstract UserDTO? EntityToDTO(User? entity);
        static abstract VehicleAssignmentDTO? EntityToDTO(VehicleAssignment? entity);
        static abstract VehicleDTO? EntityToDTO(Vehicle? entity);
        static abstract VehiclesStatusDTO? EntityToDTO(VehiclesStatus? entity);
        static abstract VehiclesTypeDTO? EntityToDTO(VehiclesType? entity);
        static abstract WarehouseDTO? EntityToDTO(Warehouse? entity);
        static abstract WarehouseStockDTO? EntityToDTO(WarehouseStock? entity);
        static abstract AttachmentDTO? EntityToDTO(Attachment? entity);
        static abstract FileChunkDTO? EntityToDTO(FileChunk? entity);
        #endregion
        #region DTOToEntity
        static abstract AttachmentMission? DTOToEntity(AttachmentMissionDTO? dto);
        static abstract AttachmentRescue? DTOToEntity(AttachmentRescueDTO? dto);
        static abstract Category? DTOToEntity(CategoryDTO? dto);
        static abstract InventoryTransaction? DTOToEntity(InventoryTransactionDTO? dto);
        static abstract MissionLog? DTOToEntity(MissionLogDTO? dto);
        static abstract Product? DTOToEntity(ProductDTO? dto);
        static abstract RefreshToken? DTOToEntity(RefreshTokenDTO? dto);
        static abstract RescueMembersRole? DTOToEntity(RescueMembersRoleDTO? dto);
        static abstract RescueMission? DTOToEntity(RescueMissionDTO? dto);
        static abstract RescueMissionsStatus? DTOToEntity(RescueMissionsStatusDTO? dto);
        static abstract RescueRequest? DTOToEntity(RescueRequestDTO? dto);
        static abstract RescueRequestLog? DTOToEntity(RescueRequestLogDTO? dto);
        static abstract RescueRequestsStatus? DTOToEntity(RescueRequestsStatusDTO? dto);
        static abstract RescueRequestsType? DTOToEntity(RescueRequestsTypeDTO? dto);
        static abstract RescueTeam? DTOToEntity(RescueTeamDTO? dto);
        static abstract RescueTeamMember? DTOToEntity(RescueTeamMemberDTO? dto);
        static abstract RescueTeamsStatus? DTOToEntity(RescueTeamsStatusDTO? dto);
        static abstract Role? DTOToEntity(RoleDTO? dto);
        static abstract UrgencyLevel? DTOToEntity(UrgencyLevelDTO? dto);
        static abstract User? DTOToEntity(UserDTO? dto);
        static abstract VehicleAssignment? DTOToEntity(VehicleAssignmentDTO? dto);
        static abstract Vehicle? DTOToEntity(VehicleDTO? dto);
        static abstract VehiclesStatus? DTOToEntity(VehiclesStatusDTO? dto);
        static abstract VehiclesType? DTOToEntity(VehiclesTypeDTO? dto);
        static abstract Warehouse? DTOToEntity(WarehouseDTO? dto);
        static abstract WarehouseStock? DTOToEntity(WarehouseStockDTO? dto);
        static abstract Attachment? DTOToEntity(AttachmentDTO? dto);
        static abstract FileChunk? DTOToEntity(FileChunkDTO? dto);
        #endregion

    }
}
