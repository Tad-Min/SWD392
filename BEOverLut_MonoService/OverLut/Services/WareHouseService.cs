using DTOs;
using DTOs.Overlut;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class WareHouseService : IWareHouseService
    {
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly IWarehouseStockRepository _warehouseStockRepository;

        public WareHouseService(
            IWarehouseRepository warehouseRepository,
            IWarehouseStockRepository warehouseStockRepository)
        {
            _warehouseRepository = warehouseRepository;
            _warehouseStockRepository = warehouseStockRepository;
        }

        #region Warehouse
        public async Task<IEnumerable<WarehouseDTO>?> GetAllWarehouses(int? warehouseId = null, string? warehouseName = null, string? address = null, bool? isActive = null)
        {
            var warehouses = await _warehouseRepository.GetAllWarehouses(warehouseId, warehouseName, address, isActive);
            if (warehouses == null) return new List<WarehouseDTO>();
            return warehouses.Select(w => MappingHandle.EntityToDTO(w)).Where(w => w != null).Cast<WarehouseDTO>();
        }

        public async Task<WarehouseDTO?> GetWarehouseById(int warehouseId)
        {
            return MappingHandle.EntityToDTO(await _warehouseRepository.GetWarehouseById(warehouseId));
        }

        public async Task<WarehouseDTO?> CreateWarehouse(WarehouseDTO dto)
        {
            return MappingHandle.EntityToDTO(await _warehouseRepository.AddWarehouse(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> UpdateWarehouse(WarehouseDTO dto)
        {
            return await _warehouseRepository.UpdateWarehouse(MappingHandle.DTOToEntity(dto)!);
        }

        public async Task<bool> DeleteWarehouse(int warehouseId)
        {
            return await _warehouseRepository.DeleteWarehouse(warehouseId);
        }
        #endregion

        #region WarehouseStock
        public async Task<IEnumerable<WarehouseStockDTO>?> GetAllWarehouseStocks(int? warehouseId = null, int? productId = null)
        {
            var stocks = await _warehouseStockRepository.GetAllWarehouseStocks(warehouseId, productId);
            if (stocks == null) return new List<WarehouseStockDTO>();
            return stocks.Select(s => MappingHandle.EntityToDTO(s)).Where(s => s != null).Cast<WarehouseStockDTO>();
        }

        public async Task<WarehouseStockDTO?> CreateWarehouseStock(WarehouseStockDTO dto)
        {
            return MappingHandle.EntityToDTO(await _warehouseStockRepository.AddWarehouseStock(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> UpdateWarehouseStock(WarehouseStockDTO dto)
        {
            return await _warehouseStockRepository.UpdateWarehouseStock(MappingHandle.DTOToEntity(dto)!);
        }

        public async Task<bool> DeleteWarehouseStock(int warehouseId, int productId)
        {
            return await _warehouseStockRepository.DeleteWarehouseStock(warehouseId, productId);
        }
        #endregion
    }
}
