using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryTransactionController : ControllerBase
    {
        private readonly IInventoryTransactionService _inventoryTransactionService;

        public InventoryTransactionController(IInventoryTransactionService inventoryTransactionService)
        {
            _inventoryTransactionService = inventoryTransactionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInventoryTransactions(
            [FromQuery] int? txId,
            [FromQuery] int? warehouseId,
            [FromQuery] int? productId,
            [FromQuery] int? txType,
            [FromQuery] int? missionId,
            [FromQuery] int? createdByUserID,
            [FromQuery] DateTime? createdAt)
        {
            try
            {
                var transactions = await _inventoryTransactionService.GetAllInventoryTransactions(txId, warehouseId, productId, txType, missionId, createdByUserID, createdAt);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving inventory transactions", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventoryTransactionById(int id)
        {
            try
            {
                var transactions = await _inventoryTransactionService.GetAllInventoryTransactions(txId: id);
                var transaction = transactions?.FirstOrDefault();
                if (transaction == null)
                    return NotFound(new { message = $"Inventory transaction with ID {id} not found" });

                return Ok(transaction);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving inventory transaction", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateInventoryTransaction(InventoryTransactionDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Inventory transaction data is required" });

                var createdTransaction = await _inventoryTransactionService.CreateInventoryTransaction(dto);
                if (createdTransaction == null)
                    return BadRequest(new { message = "Failed to create inventory transaction" });

                return CreatedAtAction(nameof(GetInventoryTransactionById), new { id = createdTransaction.TxId }, createdTransaction);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating inventory transaction", error = ex.Message });
            }
        }
    }
}