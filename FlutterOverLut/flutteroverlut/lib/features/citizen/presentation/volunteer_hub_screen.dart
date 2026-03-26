import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';
import '../data/volunteer_api.dart';
import 'volunteer_providers.dart';

/// Main volunteer hub: shows registration form OR dashboard depending on profile state.
class VolunteerHubScreen extends ConsumerWidget {
  const VolunteerHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(myVolunteerProfileProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: AppBar(
        title: const Text('Tình nguyện viên'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: profileAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorView(message: e.toString()),
        data: (profile) {
          if (profile == null) {
            return _RegistrationForm(isDark: isDark);
          }
          if (profile.isPending) {
            return _PendingView(profile: profile, isDark: isDark);
          }
          if (profile.isRejectedOrSuspended) {
            return _RejectedView(profile: profile, isDark: isDark);
          }
          return _ApprovedDashboard(isDark: isDark);
        },
      ),
    );
  }
}

// ─── Registration Form ────────────────────────────────────────────────────────

class _RegistrationForm extends ConsumerStatefulWidget {
  final bool isDark;
  const _RegistrationForm({required this.isDark});

  @override
  ConsumerState<_RegistrationForm> createState() => _RegistrationFormState();
}

class _RegistrationFormState extends ConsumerState<_RegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final _notesCtrl = TextEditingController();
  final _provinceCtrl = TextEditingController();
  final _wardCtrl = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _notesCtrl.dispose();
    _provinceCtrl.dispose();
    _wardCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);
    try {
      final api = ref.read(volunteerApiProvider);
      await api.register(
        notes: _notesCtrl.text.trim(),
        province: _provinceCtrl.text.trim(),
        ward: _wardCtrl.text.trim(),
      );
      ref.invalidate(myVolunteerProfileProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Đăng ký thành công! Chờ Manager phê duyệt.'),
            backgroundColor: AppColors.emerald,
          ),
        );
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
    final isDark = widget.isDark;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.emerald.withValues(alpha: 0.15),
                    AppColors.cyan.withValues(alpha: 0.08),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: AppColors.emerald.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.emerald, AppColors.cyan],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.volunteer_activism_rounded,
                      color: Colors.white,
                      size: 36,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Trở thành Tình nguyện viên',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Đăng ký để đóng góp kỹ năng và vật tư hỗ trợ cứu hộ cộng đồng.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark
                          ? AppColors.darkTextMuted
                          : AppColors.lightTextMuted,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),

            _SectionTitle(title: 'Thông tin đăng ký', isDark: isDark),
            const SizedBox(height: 14),

            // Province
            _StyledField(
              controller: _provinceCtrl,
              hint: 'Tỉnh / Thành phố hoạt động',
              icon: Icons.location_city_rounded,
              isDark: isDark,
              validator: (v) =>
                  (v == null || v.isEmpty) ? 'Vui lòng nhập tỉnh/thành phố' : null,
            ),
            const SizedBox(height: 12),

            // Ward
            _StyledField(
              controller: _wardCtrl,
              hint: 'Phường / Xã hoạt động',
              icon: Icons.map_rounded,
              isDark: isDark,
            ),
            const SizedBox(height: 12),

            // Notes
            _StyledField(
              controller: _notesCtrl,
              hint: 'Ghi chú thêm (tuỳ chọn)',
              icon: Icons.notes_rounded,
              isDark: isDark,
              maxLines: 3,
            ),
            const SizedBox(height: 28),

            AppButton(
              text: _isSubmitting ? 'Đang gửi...' : '🙋 Đăng ký tình nguyện',
              isLoading: _isSubmitting,
              width: double.infinity,
              onPressed: _submit,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Pending View ────────────────────────────────────────────────────────────

class _PendingView extends StatelessWidget {
  final profile;
  final bool isDark;
  const _PendingView({required this.profile, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(28),
              ),
              child: const Icon(
                Icons.hourglass_empty_rounded,
                size: 52,
                color: AppColors.amber,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Đang chờ phê duyệt',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              'Đơn đăng ký tình nguyện viên của bạn đang được xem xét bởi Manager. '
              'Bạn sẽ nhận được thông báo sau khi được phê duyệt.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
              ),
            ),
            if (profile?.volunteerProvince != null) ...[
              const SizedBox(height: 24),
              _InfoChip(
                label: '📍 ${profile.volunteerProvince}',
                color: AppColors.cyan,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─── Rejected View ───────────────────────────────────────────────────────────

class _RejectedView extends StatelessWidget {
  final profile;
  final bool isDark;
  const _RejectedView({required this.profile, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.red.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(28),
              ),
              child: const Icon(
                Icons.cancel_rounded,
                size: 52,
                color: AppColors.red,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Đơn không được chấp nhận',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            if (profile?.rejectedReason != null) ...[
              const SizedBox(height: 12),
              Text(
                'Lý do: ${profile.rejectedReason}',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─── Approved Dashboard ───────────────────────────────────────────────────────

class _ApprovedDashboard extends StatelessWidget {
  final bool isDark;
  const _ApprovedDashboard({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status banner
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.emerald.withValues(alpha: 0.18),
                  AppColors.cyan.withValues(alpha: 0.06),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppColors.emerald.withValues(alpha: 0.3),
              ),
            ),
            child: const Row(
              children: [
                Icon(Icons.verified_rounded, color: AppColors.emerald, size: 28),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Đã được phê duyệt ✅',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppColors.emerald,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Bạn có thể đăng ký vai trò và đóng góp vật tư.',
                        style: TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          Text(
            'Hoạt động tình nguyện',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: isDark ? AppColors.darkText : AppColors.lightText,
            ),
          ),
          const SizedBox(height: 14),

          // Action cards
          _ActionCard(
            title: 'Đăng ký Kỹ năng',
            subtitle: 'Thêm kỹ năng cứu hộ, y tế, hậu cần của bạn',
            icon: Icons.psychology_rounded,
            gradient: [AppColors.blue, AppColors.cyan],
            onTap: () => context.push('/citizen/volunteer/skills'),
          ),
          const SizedBox(height: 14),

          _ActionCard(
            title: 'Đóng góp Vật tư',
            subtitle: 'Đăng ký cống hiến thực phẩm, dụng cụ, thiết bị',
            icon: Icons.inventory_2_rounded,
            gradient: [AppColors.amber, Color(0xFFEF8C2E)],
            onTap: () => context.push('/citizen/volunteer/offer'),
          ),
          const SizedBox(height: 14),

          _ActionCard(
            title: 'Lịch sử đóng góp',
            subtitle: 'Xem các vật tư bạn đã cống hiến',
            icon: Icons.history_rounded,
            gradient: [AppColors.fuchsia, Color(0xFFAB3BC2)],
            onTap: () => context.push('/citizen/volunteer/history'),
          ),
        ],
      ),
    );
  }
}

// ─── Shared Widgets ───────────────────────────────────────────────────────────

class _ActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final List<Color> gradient;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.gradient,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              gradient[0].withValues(alpha: 0.15),
              gradient[1].withValues(alpha: 0.06),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: gradient[0].withValues(alpha: 0.3),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: Colors.white, size: 26),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: gradient[0].withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 16,
              color: gradient[0].withValues(alpha: 0.6),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final bool isDark;
  const _SectionTitle({required this.title, required this.isDark});

  @override
  Widget build(BuildContext context) => Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: isDark ? AppColors.darkText : AppColors.lightText,
        ),
      );
}

class _StyledField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final bool isDark;
  final int maxLines;
  final String? Function(String?)? validator;

  const _StyledField({
    required this.controller,
    required this.hint,
    required this.icon,
    required this.isDark,
    this.maxLines = 1,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      validator: validator,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, size: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          ),
        ),
        filled: true,
        fillColor: isDark
            ? AppColors.darkCard.withValues(alpha: 0.8)
            : AppColors.lightCard,
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String label;
  final Color color;
  const _InfoChip({required this.label, required this.color});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      );
}

class _ErrorView extends StatelessWidget {
  final String message;
  const _ErrorView({required this.message});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.red),
              const SizedBox(height: 12),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.red),
              ),
            ],
          ),
        ),
      );
}
