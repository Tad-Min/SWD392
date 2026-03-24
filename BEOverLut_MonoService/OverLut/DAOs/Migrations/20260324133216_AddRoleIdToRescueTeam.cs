using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAOs.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleIdToRescueTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleID",
                keyValue: 4);

            migrationBuilder.AddColumn<int>(
                name: "RoleID",
                table: "RescueTeams",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleID", "RoleName" },
                values: new object[] { 6, "Volunteer" });

            migrationBuilder.CreateIndex(
                name: "IX_RescueTeams_RoleID",
                table: "RescueTeams",
                column: "RoleID");

            migrationBuilder.AddForeignKey(
                name: "FK_RescueTeams_RescueMembersRoles",
                table: "RescueTeams",
                column: "RoleID",
                principalTable: "RescueMembersRoles",
                principalColumn: "RescueMembersRoleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RescueTeams_RescueMembersRoles",
                table: "RescueTeams");

            migrationBuilder.DropIndex(
                name: "IX_RescueTeams_RoleID",
                table: "RescueTeams");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleID",
                keyValue: 6);

            migrationBuilder.DropColumn(
                name: "RoleID",
                table: "RescueTeams");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleID", "RoleName" },
                values: new object[] { 4, "Volunteer" });
        }
    }
}
