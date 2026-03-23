import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_button.dart';
import '../data/rescue_team_api.dart';
import '../domain/rescue_team_models.dart';
import 'rescue_team_providers.dart';

/// Detailed view of a single rescue mission.
class MissionDetailScreen extends ConsumerStatefulWidget {
  final String missionId;
  const MissionDetailScreen({super.key, required this.missionId});

  @override
  ConsumerState<MissionDetailScreen> createState() =>
      _MissionDetailScreenState();
}

class _MissionDetailScreenState extends ConsumerState<MissionDetailScreen> {
  int? _newStatus;
  bool _isUpdating = false;

  @override
  Widget build(BuildContext context) {
    final missionsAsync = ref.watch(teamMissionsProvider);
    final id = int.tryParse(widget.missionId);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('#M-${id?.toString().padLeft(3, '0') ?? '000'}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: missionsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.error_outline,
                size: 48,
                color: AppColors.red.withValues(alpha: 0.7),
              ),
              const SizedBox(height: 12),
              const Text('Không thể tải dữ liệu'),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => ref.invalidate(teamMissionsProvider),
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
        data: (missions) {
          final mission = missions.cast<RescueMissionModel?>().firstWhere(
            (m) => m?.missionId == id,
            orElse: () => null,
          );

          if (mission == null) {
            return const Center(child: Text('Không tìm thấy nhiệm vụ'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Status Banner ──
                _StatusBanner(status: mission.statusId ?? 0),
                const SizedBox(height: 20),

                // ── Mission Info ──
                Text(
                  mission.description ?? 'Nhiệm vụ',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),

                AppCard(
                  child: Column(
                    children: [
                      _InfoRow(
                        icon: Icons.tag,
                        label: 'Mã NV',
                        value:
                            '#M-${mission.missionId?.toString().padLeft(3, '0') ?? '000'}',
                      ),
                      _cardDivider(isDark),
                      _InfoRow(
                        icon: Icons.assignment_outlined,
                        label: 'Yêu cầu',
                        value:
                            '#RQ-${mission.rescueRequestId?.toString().padLeft(3, '0') ?? 'N/A'}',
                      ),
                      _cardDivider(isDark),
                      _InfoRow(
                        icon: Icons.groups_outlined,
                        label: 'Team ID',
                        value: '${mission.teamId ?? 'N/A'}',
                      ),
                      _cardDivider(isDark),
                      _InfoRow(
                        icon: Icons.calendar_today_outlined,
                        label: 'Phân công',
                        value: mission.formattedDate,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ── Description ──
                const Text(
                  'Mô tả nhiệm vụ',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                AppCard(
                  child: Text(
                    mission.description ?? 'Không có mô tả',
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.6,
                      color: isDark ? AppColors.darkText : AppColors.lightText,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Only show update section when mission is still active (not Completed=4 or Failed=5)
                if (mission.statusId != 4 && mission.statusId != 5) ...[
                  const Text(
                    'Cập nhật trạng thái',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      // Show EnRoute (2) only if currently Assigned (1)
                      if (mission.statusId == 1)
                        _StatusChip(
                          label: 'Đang di chuyển',
                          statusValue: 2,
                          color: AppColors.blue,
                          selected: _newStatus == 2,
                          onTap: () => setState(() => _newStatus = 2),
                        ),
                      // Show Rescuing (3) if Assigned or EnRoute
                      if ((mission.statusId ?? 0) <= 2)
                        _StatusChip(
                          label: 'Đang cứu hộ',
                          statusValue: 3,
                          color: AppColors.amber,
                          selected: _newStatus == 3,
                          onTap: () => setState(() => _newStatus = 3),
                        ),
                      // Completed (4) always available for active missions
                      _StatusChip(
                        label: 'Hoàn thành',
                        statusValue: 4,
                        color: AppColors.emerald,
                        selected: _newStatus == 4,
                        onTap: () => setState(() => _newStatus = 4),
                      ),
                      // Failed (5) always available for active missions
                      _StatusChip(
                        label: 'Thất bại',
                        statusValue: 5,
                        color: AppColors.red,
                        selected: _newStatus == 5,
                        onTap: () => setState(() => _newStatus = 5),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  AppButton(
                    text: _isUpdating
                        ? 'Đang cập nhật...'
                        : 'Cập nhật trạng thái',
                    width: double.infinity,
                    icon: Icons.update_rounded,
                    isLoading: _isUpdating,
                    onPressed: _newStatus != null && !_isUpdating
                        ? () => _updateMissionStatus(mission)
                        : null,
                  ),
                ],

                // Show completed/failed footer
                if (mission.statusId == 4)
                  _buildFinishedBanner(
                    color: AppColors.emerald,
                    icon: Icons.check_circle,
                    label: 'Nhiệm vụ đã hoàn thành',
                  ),
                if (mission.statusId == 5)
                  _buildFinishedBanner(
                    color: AppColors.red,
                    icon: Icons.cancel,
                    label: 'Nhiệm vụ thất bại',
                  ),

                const SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }

  Future<void> _updateMissionStatus(RescueMissionModel mission) async {
    if (_newStatus == null) return;
    setState(() => _isUpdating = true);

    try {
      final api = ref.read(rescueTeamApiProvider);

      // 1. Update mission status
      await api.updateMission({
        'missionId': mission.missionId,
        'rescueRequestId': mission.rescueRequestId,
        'teamId': mission.teamId,
        'statusId': _newStatus,
        'description': mission.description ?? '',
      });

      // 2. If mission is Completed (4) or Failed (5):
      //    • Release vehicle assignments (set ReleasedAt = now)
      //    • Reset each vehicle status to Available (1)
      if ((_newStatus == 4 || _newStatus == 5) && mission.missionId != null) {
        try {
          // Get all vehicles assigned to this mission
          final assignments = await api.getVehicleAssignmentsByMissionId(
            mission.missionId!,
          );
          final vehicleIds = assignments
              .map((a) => a.vehicleId)
              .whereType<int>()
              .toSet();

          if (vehicleIds.isNotEmpty) {
            // Fetch vehicle details (needed for full VehicleDTO update)
            final vehiclesFutures = vehicleIds.map(api.getVehicleById);
            final vehicles = (await Future.wait(vehiclesFutures))
                .whereType<VehicleModel>()
                .toList();

            // Release assignments + update vehicle status in parallel
            await Future.wait([
              // Release each vehicle assignment (set ReleasedAt)
              ...vehicleIds.map(
                (id) => api.releaseVehicleAssignment(id).catchError((_) {}),
              ),
              // Update each vehicle status to Available (1)
              ...vehicles.map(
                (v) => api
                    .updateVehicleStatusToAvailable(v)
                    .catchError((_) {}),
              ),
            ]);
          }
        } catch (_) {
          // Vehicle release failure is non-critical
        }

        // Also set rescue team back to Available (statusId = 1)
        if (mission.teamId != null) {
          try {
            await api.updateTeamStatus(mission.teamId!, 1);
          } catch (_) {}
        }
      }


      ref.invalidate(teamMissionsProvider);

      if (mounted) {
        setState(() => _isUpdating = false);
        final statusName = _newStatus == 4 ? 'Hoàn thành' : 
                           _newStatus == 5 ? 'Thất bại' :
                           _newStatus == 2 ? 'Đang di chuyển' : 'Đang cứu hộ';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Đã cập nhật: #M-${mission.missionId?.toString().padLeft(3, '0')} → $statusName'
              '${(_newStatus == 4 || _newStatus == 5) ? ' · Đội về trạng thái Sẵn sàng' : ''}',
            ),
            backgroundColor: _newStatus == 4
                ? AppColors.emerald
                : _newStatus == 5
                    ? AppColors.red
                    : AppColors.blue,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isUpdating = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: AppColors.red,
          ),
        );
      }
    }
  }


  Widget _buildFinishedBanner({
    required Color color,
    required IconData icon,
    required String label,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(fontWeight: FontWeight.w600, color: color),
          ),
        ],
      ),
    );
  }

  Widget _cardDivider(bool isDark) {
    return Divider(
      height: 1,
      color: (isDark ? AppColors.darkBorder : AppColors.lightBorder).withValues(
        alpha: 0.5,
      ),
    );
  }
}

class _StatusBanner extends StatelessWidget {
  final int status;
  const _StatusBanner({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    String label;
    IconData icon;
    // DB: 1=Assigned, 2=EnRoute, 3=Rescuing, 4=Completed, 5=Failed
    switch (status) {
      case 1:
        color = AppColors.amber;
        label = 'Đã phân công';
        icon = Icons.assignment_outlined;
        break;
      case 2:
        color = AppColors.blue;
        label = 'Đang di chuyển';
        icon = Icons.directions_run_rounded;
        break;
      case 3:
        color = AppColors.cyan;
        label = 'Đang cứu hộ';
        icon = Icons.play_circle_outline;
        break;
      case 4:
        color = AppColors.emerald;
        label = 'Hoàn thành';
        icon = Icons.check_circle_outline;
        break;
      case 5:
        color = AppColors.red;
        label = 'Thất bại';
        icon = Icons.cancel_outlined;
        break;
      default:
        color = AppColors.darkTextMuted;
        label = 'Không rõ';
        icon = Icons.help_outline;
        break;
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 10),
          Text(
            label,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.cyan),
          const SizedBox(width: 12),
          SizedBox(
            width: 70,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: isDark
                    ? AppColors.darkTextMuted
                    : AppColors.lightTextMuted,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final int statusValue;
  final Color color;
  final bool selected;
  final VoidCallback onTap;
  const _StatusChip({
    required this.label,
    required this.statusValue,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? color.withValues(alpha: 0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: selected ? color : color.withValues(alpha: 0.3),
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
            color: selected ? color : color.withValues(alpha: 0.7),
          ),
        ),
      ),
    );
  }
}
