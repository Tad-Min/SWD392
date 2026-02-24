using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WareHouseController : ControllerBase
    {
        private readonly IWareHouseService _wareHouseService;

        public WareHouseController(IWareHouseService wareHouseService)
        {
            _wareHouseService = wareHouseService;
        }

        #region Warehouse
        [HttpGet]
        public async Task<IActionResult> GetAllWarehouses(
            [FromQuery] int? warehouseId,
            [FromQuery] string? warehouseName,
            [FromQuery] string? address,
            [FromQuery] bool? isActive)
        {
            try
            {
                var warehouses = await _wareHouseService.GetAllWarehouses(warehouseId, warehouseName, address, isActive);
                return Ok(warehouses);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving warehouses", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouseById(int id)
        {
            try
            {
                var warehouse = await _wareHouseService.GetWarehouseById(id);
                if (warehouse == null)
                    return NotFound(new { message = $"Warehouse with ID {id} not found" });

                return Ok(warehouse);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving warehouse", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateWarehouse(WarehouseDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Warehouse data is required" });

                var createdWarehouse = await _wareHouseService.CreateWarehouse(dto);
                if (createdWarehouse == null)
                    return BadRequest(new { message = "Failed to create warehouse" });

                return CreatedAtAction(nameof(GetWarehouseById), new { id = createdWarehouse.WarehouseId }, createdWarehouse);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating warehouse", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWarehouse(int id, WarehouseDTO dto)
        {
            try
            {
                var existingWarehouse = await _wareHouseService.GetWarehouseById(id);
                if (existingWarehouse == null)
                    return NotFound(new { message = $"Warehouse with ID {id} not found" });

                dto.WarehouseId = id;
                var result = await _wareHouseService.UpdateWarehouse(dto);
                if (!result)
                    return BadRequest(new { message = "Failed to update warehouse" });

                return Ok(new { message = "Warehouse updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating warehouse", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(int id)
        {
            try
            {
                var warehouse = await _wareHouseService.GetWarehouseById(id);
                if (warehouse == null)
                    return NotFound(new { message = $"Warehouse with ID {id} not found" });

                var result = await _wareHouseService.DeleteWarehouse(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete warehouse" });

                return Ok(new { message = "Warehouse deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting warehouse", error = ex.Message });
            }
        }
        #endregion

        #region WarehouseStock
        [HttpGet("Stock")]
        public async Task<IActionResult> GetAllWarehouseStocks([FromQuery] int? warehouseId, [FromQuery] int? productId)
        {
            try
            {
                var stocks = await _wareHouseService.GetAllWarehouseStocks(warehouseId, productId);
                return Ok(stocks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving warehouse stocks", error = ex.Message });
            }
        }

        [HttpPost("Stock")]
        public async Task<IActionResult> CreateWarehouseStock(WarehouseStockDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Warehouse stock data is required" });

                var createdStock = await _wareHouseService.CreateWarehouseStock(dto);
                if (createdStock == null)
                    return BadRequest(new { message = "Failed to create warehouse stock" });

                return Ok(createdStock);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating warehouse stock", error = ex.Message });
            }
        }

        [HttpPut("Stock")]
        public async Task<IActionResult> UpdateWarehouseStock(WarehouseStockDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Warehouse stock data is required" });

                var result = await _wareHouseService.UpdateWarehouseStock(dto);
                if (!result)
                    return BadRequest(new { message = "Failed to update warehouse stock" });

                return Ok(new { message = "Warehouse stock updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating warehouse stock", error = ex.Message });
            }
        }

        [HttpDelete("Stock/{warehouseId}/{productId}")]
        public async Task<IActionResult> DeleteWarehouseStock(int warehouseId, int productId)
        {
            try
            {
                var result = await _wareHouseService.DeleteWarehouseStock(warehouseId, productId);
                if (!result)
                    return BadRequest(new { message = "Failed to delete warehouse stock" });

                return Ok(new { message = "Warehouse stock deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting warehouse stock", error = ex.Message });
            }
        }
        #endregion
    }
}
