import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../domain/rescue_team_models.dart';
import 'rescue_team_providers.dart';

/// Screen showing all vehicles and their statuses.
class VehicleStatusScreen extends ConsumerWidget {
  const VehicleStatusScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final vehiclesAsync = ref.watch(teamVehiclesProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Phương tiện'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(teamVehiclesProvider.future),
        child: vehiclesAsync.when(
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
                  onPressed: () => ref.invalidate(vehiclesProvider),
                  child: const Text('Thử lại'),
                ),
              ],
            ),
          ),
          data: (vehicles) {
            if (vehicles.isEmpty) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.directions_boat_outlined,
                      size: 56,
                      color: AppColors.darkTextMuted.withValues(alpha: 0.4),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Chưa có phương tiện nào được phân công',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Điều phối viên chưa chỉ định phương tiện\ncho các nhiệm vụ của đội bạn.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.darkTextMuted,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              );
            }
            final available = vehicles.where((v) => v.statusId == 1).length;
            final inUse = vehicles.where((v) => v.statusId == 2).length;
            final maintenance = vehicles.where((v) => v.statusId == 3).length;

            return Column(
              children: [
                // ── Stats bar ──
                Container(
                  margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color:
                          (isDark
                                  ? AppColors.darkBorder
                                  : AppColors.lightBorder)
                              .withValues(alpha: 0.5),
                    ),
                  ),
                  child: Row(
                    children: [
                      _MiniStat(
                        value: '${vehicles.length}',
                        label: 'Tổng',
                        color: AppColors.blue,
                      ),
                      _divider(isDark),
                      _MiniStat(
                        value: '$available',
                        label: 'Sẵn sàng',
                        color: AppColors.emerald,
                      ),
                      _divider(isDark),
                      _MiniStat(
                        value: '$inUse',
                        label: 'Đang dùng',
                        color: AppColors.amber,
                      ),
                      _divider(isDark),
                      _MiniStat(
                        value: '$maintenance',
                        label: 'Bảo trì',
                        color: AppColors.red,
                      ),
                    ],
                  ),
                ),

                // ── Vehicle List ──
                Expanded(
                  child: ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: vehicles.length,
                    itemBuilder: (context, index) =>
                        _VehicleCard(vehicle: vehicles[index]),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _divider(bool isDark) {
    return Container(
      width: 1,
      height: 36,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      color: (isDark ? AppColors.darkBorder : AppColors.lightBorder).withValues(
        alpha: 0.5,
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String value;
  final String label;
  final Color color;
  const _MiniStat({
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Column(
        children: [
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
            style: TextStyle(
              fontSize: 10,
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

class _VehicleCard extends StatelessWidget {
  final VehicleModel vehicle;
  const _VehicleCard({required this.vehicle});

  Color _statusColor() {
    switch (vehicle.statusId) {
      case 1:
        return AppColors.emerald;
      case 2:
        return AppColors.amber;
      case 3:
        return AppColors.red;
      default:
        return AppColors.darkTextMuted;
    }
  }

  IconData _typeIcon() {
    switch (vehicle.vehicleType) {
      case 1:
        return Icons.directions_boat_rounded;
      case 2:
        return Icons.local_shipping_rounded;
      case 3:
        return Icons.kayaking_rounded;
      default:
        return Icons.directions_boat_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final color = _statusColor();

    return Container(
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
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(_typeIcon(), color: color, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  vehicle.vehicleCode ?? 'Phương tiện',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      vehicle.vehicleTypeName,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark
                            ? AppColors.darkTextMuted
                            : AppColors.lightTextMuted,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '•',
                      style: TextStyle(
                        color: isDark
                            ? AppColors.darkTextMuted
                            : AppColors.lightTextMuted,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      Icons.people_outline,
                      size: 13,
                      color: isDark
                          ? AppColors.darkTextMuted
                          : AppColors.lightTextMuted,
                    ),
                    const SizedBox(width: 3),
                    Text(
                      '${vehicle.capacity ?? 0} chỗ',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark
                            ? AppColors.darkTextMuted
                            : AppColors.lightTextMuted,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              vehicle.statusLabel,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
