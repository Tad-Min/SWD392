import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_button.dart';
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

  @override
  Widget build(BuildContext context) {
    final missions = ref.watch(missionsProvider);
    final id = int.tryParse(widget.missionId);
    final mission = missions.firstWhere(
      (m) => m.id == id,
      orElse: () =>
          const RescueMissionModel(id: 0, missionName: 'Không tìm thấy'),
    );
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('#M-${mission.id?.toString().padLeft(3, '0') ?? '000'}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Status Banner ──
            _StatusBanner(status: mission.status ?? 0),
            const SizedBox(height: 20),

            // ── Mission Info ──
            Text(
              mission.missionName ?? 'Nhiệm vụ',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            AppCard(
              child: Column(
                children: [
                  _InfoRow(
                    icon: Icons.location_on_outlined,
                    label: 'Vị trí',
                    value: mission.location ?? 'N/A',
                  ),
                  _cardDivider(isDark),
                  _InfoRow(
                    icon: Icons.people_outline,
                    label: 'Số người',
                    value: '${mission.numberOfPeople ?? 0} người',
                  ),
                  _cardDivider(isDark),
                  _InfoRow(
                    icon: Icons.groups_outlined,
                    label: 'Đội',
                    value: mission.teamName ?? 'N/A',
                  ),
                  _cardDivider(isDark),
                  _InfoRow(
                    icon: Icons.calendar_today_outlined,
                    label: 'Tạo lúc',
                    value: mission.formattedDate,
                  ),
                  if (mission.startTime != null) ...[
                    _cardDivider(isDark),
                    _InfoRow(
                      icon: Icons.play_circle_outline,
                      label: 'Bắt đầu',
                      value: _formatTime(mission.startTime!),
                    ),
                  ],
                  if (mission.endTime != null) ...[
                    _cardDivider(isDark),
                    _InfoRow(
                      icon: Icons.stop_circle_outlined,
                      label: 'Kết thúc',
                      value: _formatTime(mission.endTime!),
                    ),
                  ],
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

            // ── Update Status ──
            if (mission.status != 2 && mission.status != 3) ...[
              const Text(
                'Cập nhật trạng thái',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  if (mission.status == 0)
                    _StatusChip(
                      label: 'Bắt đầu thực hiện',
                      statusValue: 1,
                      color: AppColors.blue,
                      selected: _newStatus == 1,
                      onTap: () => setState(() => _newStatus = 1),
                    ),
                  _StatusChip(
                    label: 'Hoàn thành',
                    statusValue: 2,
                    color: AppColors.emerald,
                    selected: _newStatus == 2,
                    onTap: () => setState(() => _newStatus = 2),
                  ),
                  _StatusChip(
                    label: 'Hủy bỏ',
                    statusValue: 3,
                    color: AppColors.red,
                    selected: _newStatus == 3,
                    onTap: () => setState(() => _newStatus = 3),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              AppButton(
                text: 'Cập nhật trạng thái',
                width: double.infinity,
                icon: Icons.update_rounded,
                onPressed: _newStatus != null
                    ? () {
                        // Mock update
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Đã cập nhật trạng thái nhiệm vụ #M-${mission.id?.toString().padLeft(3, '0')}',
                            ),
                            backgroundColor: AppColors.emerald,
                          ),
                        );
                        context.pop();
                      }
                    : null,
              ),
            ],

            if (mission.status == 2)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.emerald.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.emerald.withValues(alpha: 0.3),
                  ),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle, color: AppColors.emerald),
                    SizedBox(width: 12),
                    Text(
                      'Nhiệm vụ đã hoàn thành',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: AppColors.emerald,
                      ),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 24),
          ],
        ),
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

  String _formatTime(String iso) {
    try {
      final d = DateTime.parse(iso);
      return '${d.day}/${d.month}/${d.year} ${d.hour}:${d.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
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
    switch (status) {
      case 0:
        color = AppColors.amber;
        label = 'Chờ xử lý';
        icon = Icons.pending_outlined;
        break;
      case 1:
        color = AppColors.blue;
        label = 'Đang thực hiện';
        icon = Icons.play_circle_outline;
        break;
      case 2:
        color = AppColors.emerald;
        label = 'Hoàn thành';
        icon = Icons.check_circle_outline;
        break;
      case 3:
        color = AppColors.red;
        label = 'Hủy bỏ';
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
