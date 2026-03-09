import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_card.dart';
import '../../auth/presentation/auth_providers.dart';
import '../domain/rescue_team_models.dart';
import 'rescue_team_providers.dart';

/// Home screen for Rescue Team role.
class RescueTeamHomeScreen extends ConsumerWidget {
  const RescueTeamHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final missions = ref.watch(missionsProvider);
    final vehicles = ref.watch(vehiclesProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final activeMissions = missions
        .where((m) => m.status == 0 || m.status == 1)
        .toList();
    final completedCount = missions.where((m) => m.status == 2).length;
    final availableVehicles = vehicles.where((v) => v.status == 0).length;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ──
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.emerald, AppColors.cyan],
                      ),
                    ),
                    child: Center(
                      child: Text(
                        (authState.user?.userName ?? 'R')
                            .substring(0, 1)
                            .toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Xin chào 💪',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark
                                ? AppColors.darkTextMuted
                                : AppColors.lightTextMuted,
                          ),
                        ),
                        Text(
                          authState.user?.userName ?? 'Đội viên',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.emerald.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.circle, size: 8, color: AppColors.emerald),
                        SizedBox(width: 6),
                        Text(
                          'Trực chiến',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.emerald,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ── Stats ──
              Row(
                children: [
                  Expanded(
                    child: _StatCard(
                      value: '${activeMissions.length}',
                      label: 'Nhiệm vụ\nđang làm',
                      icon: Icons.assignment_outlined,
                      color: AppColors.amber,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _StatCard(
                      value: '$completedCount',
                      label: 'Hoàn\nthành',
                      icon: Icons.check_circle_outline,
                      color: AppColors.emerald,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _StatCard(
                      value: '$availableVehicles',
                      label: 'Phương tiện\nsẵn sàng',
                      icon: Icons.directions_boat_outlined,
                      color: AppColors.blue,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _StatCard(
                      value:
                          '${missions.fold<int>(0, (sum, m) => sum + (m.numberOfPeople ?? 0))}',
                      label: 'Người\nđã cứu',
                      icon: Icons.people_outline,
                      color: AppColors.fuchsia,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // ── Active Missions ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Nhiệm vụ hiện tại',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  GestureDetector(
                    onTap: () => context.push('/rescue-team/vehicles'),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.directions_boat_outlined,
                          size: 16,
                          color: AppColors.cyan,
                        ),
                        const SizedBox(width: 4),
                        const Text(
                          'Phương tiện',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.cyan,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (activeMissions.isEmpty)
                AppCard(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          Icon(
                            Icons.assignment_outlined,
                            size: 40,
                            color: isDark
                                ? AppColors.darkTextMuted
                                : AppColors.lightTextMuted,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Không có nhiệm vụ nào',
                            style: TextStyle(
                              color: isDark
                                  ? AppColors.darkTextMuted
                                  : AppColors.lightTextMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

              ...activeMissions.map((m) => _MissionCard(mission: m)),

              // ── Completed section ──
              if (completedCount > 0) ...[
                const SizedBox(height: 24),
                const Text(
                  'Đã hoàn thành',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                ...missions
                    .where((m) => m.status == 2)
                    .map((m) => _MissionCard(mission: m)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.value,
    required this.label,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
        color: isDark
            ? AppColors.darkCard.withValues(alpha: 0.7)
            : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: (isDark ? AppColors.darkBorder : AppColors.lightBorder)
              .withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w500,
              color: isDark
                  ? AppColors.darkTextMuted
                  : AppColors.lightTextMuted,
            ),
          ),
        ],
      ),
    );
  }
}

class _MissionCard extends StatelessWidget {
  final RescueMissionModel mission;
  const _MissionCard({required this.mission});

  Color _statusColor() {
    switch (mission.status) {
      case 0:
        return AppColors.amber;
      case 1:
        return AppColors.blue;
      case 2:
        return AppColors.emerald;
      case 3:
        return AppColors.red;
      default:
        return AppColors.darkTextMuted;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final color = _statusColor();

    return GestureDetector(
      onTap: () => context.push('/rescue-team/mission/${mission.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark
              ? AppColors.darkCard.withValues(alpha: 0.7)
              : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: (isDark ? AppColors.darkBorder : AppColors.lightBorder)
                .withValues(alpha: 0.5),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    mission.statusLabel,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: color,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  '#M-${mission.id?.toString().padLeft(3, '0') ?? '000'}',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isDark
                        ? AppColors.darkTextMuted
                        : AppColors.lightTextMuted,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              mission.missionName ?? 'Nhiệm vụ',
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                Icon(
                  Icons.location_on_outlined,
                  size: 14,
                  color: isDark
                      ? AppColors.darkTextMuted
                      : AppColors.lightTextMuted,
                ),
                const SizedBox(width: 4),
                Text(
                  mission.location ?? '',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark
                        ? AppColors.darkTextMuted
                        : AppColors.lightTextMuted,
                  ),
                ),
                const SizedBox(width: 12),
                Icon(
                  Icons.people_outline,
                  size: 14,
                  color: isDark
                      ? AppColors.darkTextMuted
                      : AppColors.lightTextMuted,
                ),
                const SizedBox(width: 4),
                Text(
                  '${mission.numberOfPeople ?? 0} người',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark
                        ? AppColors.darkTextMuted
                        : AppColors.lightTextMuted,
                  ),
                ),
              ],
            ),
            if (mission.status != 2) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () =>
                      context.push('/rescue-team/mission/${mission.id}'),
                  icon: const Icon(Icons.open_in_new_rounded, size: 16),
                  label: const Text('Xem chi tiết'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    textStyle: const TextStyle(fontSize: 13),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
