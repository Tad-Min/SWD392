import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';
import '../data/volunteer_api.dart';
import 'volunteer_providers.dart';

/// Screen for selecting and saving volunteer skills.
class VolunteerSkillsScreen extends ConsumerStatefulWidget {
  const VolunteerSkillsScreen({super.key});

  @override
  ConsumerState<VolunteerSkillsScreen> createState() =>
      _VolunteerSkillsScreenState();
}

class _VolunteerSkillsScreenState
    extends ConsumerState<VolunteerSkillsScreen> {
  final Set<int> _selected = {};
  bool _isSubmitting = false;
  bool _initialized = false;

  Future<void> _save() async {
    setState(() => _isSubmitting = true);
    try {
      final api = ref.read(volunteerApiProvider);
      await api.setSkills(_selected.toList());
      ref.invalidate(mySkillsProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Kỹ năng đã được cập nhật!'),
            backgroundColor: AppColors.emerald,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: $e'),
            backgroundColor: AppColors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final typesAsync = ref.watch(skillTypesProvider);
    final mySkillsAsync = ref.watch(mySkillsProvider);

    // Pre-select skills I already have
    if (!_initialized) {
      final skills = mySkillsAsync.valueOrNull;
      if (skills != null) {
        for (final s in skills) {
          if (s.skillTypeId != null) _selected.add(s.skillTypeId!);
        }
        _initialized = true;
      }
    }

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: AppBar(
        title: const Text('Kỹ năng tình nguyện'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: typesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) =>
            Center(child: Text('Không thể tải kỹ năng: $e')),
        data: (types) => Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  // Description
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.blue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: AppColors.blue.withValues(alpha: 0.25),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.info_outline_rounded,
                          color: AppColors.blue,
                          size: 22,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Chọn các kỹ năng bạn có. Thông tin này giúp hệ thống điều phối phù hợp.',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark
                                  ? AppColors.darkTextMuted
                                  : AppColors.lightTextMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  ...types.map((type) {
                    final id = type.skillTypeId ?? 0;
                    final selected = _selected.contains(id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: GestureDetector(
                        onTap: () => setState(() {
                          if (selected) {
                            _selected.remove(id);
                          } else {
                            _selected.add(id);
                          }
                        }),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.blue.withValues(alpha: 0.12)
                                : (isDark
                                    ? AppColors.darkCard
                                    : AppColors.lightCard),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: selected
                                  ? AppColors.blue
                                  : (isDark
                                      ? AppColors.darkBorder
                                      : AppColors.lightBorder),
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 42,
                                height: 42,
                                decoration: BoxDecoration(
                                  color: selected
                                      ? AppColors.blue.withValues(alpha: 0.2)
                                      : (isDark
                                          ? AppColors.darkBg
                                          : AppColors.lightBg),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  _skillIcon(id),
                                  color: selected
                                      ? AppColors.blue
                                      : (isDark
                                          ? AppColors.darkTextMuted
                                          : AppColors.lightTextMuted),
                                  size: 22,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      type.displayName,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 15,
                                        color: selected
                                            ? AppColors.blue
                                            : null,
                                      ),
                                    ),
                                    Text(
                                      _skillDesc(id),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: isDark
                                            ? AppColors.darkTextMuted
                                            : AppColors.lightTextMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Icon(
                                selected
                                    ? Icons.check_circle_rounded
                                    : Icons.circle_outlined,
                                color: selected
                                    ? AppColors.blue
                                    : (isDark
                                        ? AppColors.darkTextMuted
                                        : AppColors.lightTextMuted),
                                size: 24,
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: AppButton(
                text: _isSubmitting
                    ? 'Đang lưu...'
                    : 'Lưu kỹ năng (${_selected.length} đã chọn)',
                isLoading: _isSubmitting,
                width: double.infinity,
                onPressed: _selected.isEmpty ? null : _save,
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _skillIcon(int id) {
    switch (id) {
      case 1:
        return Icons.medical_services_rounded;
      case 2:
        return Icons.directions_run_rounded;
      case 3:
        return Icons.local_shipping_rounded;
      case 4:
        return Icons.directions_boat_rounded;
      default:
        return Icons.star_rounded;
    }
  }

  String _skillDesc(int id) {
    switch (id) {
      case 1:
        return 'Sơ cứu, băng bó, chăm sóc y tế cơ bản';
      case 2:
        return 'Cứu người trực tiếp trong vùng ngập lụt';
      case 3:
        return 'Vận chuyển và phân phối hàng hóa cứu trợ';
      case 4:
        return 'Điều khiển xuồng, canô trong vùng lũ';
      default:
        return 'Kỹ năng hỗ trợ khác';
    }
  }
}
