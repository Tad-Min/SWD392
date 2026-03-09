import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_button.dart';
import '../../auth/presentation/auth_providers.dart';

/// User profile screen for citizens.
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _isEditing = false;
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _nameController = TextEditingController(
      text: user?.userName ?? 'Nguyễn Văn A',
    );
    _phoneController = TextEditingController(text: '0912 345 678');
    _addressController = TextEditingController(text: 'Quận 7, TP.HCM');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
        actions: [
          TextButton(
            onPressed: () => setState(() => _isEditing = !_isEditing),
            child: Text(
              _isEditing ? 'Hủy' : 'Sửa',
              style: const TextStyle(
                color: AppColors.cyan,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // ── Avatar + Name ──
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppColors.avatarGradient,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.cyan.withValues(alpha: 0.3),
                    blurRadius: 20,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  (authState.user?.userName ?? 'U')
                      .substring(0, 1)
                      .toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              authState.user?.userName ?? 'Người dùng',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.cyan.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Người dân',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.cyan,
                ),
              ),
            ),
            const SizedBox(height: 28),

            // ── Info Cards ──
            AppCard(
              child: Column(
                children: [
                  _ProfileField(
                    icon: Icons.person_outline,
                    label: 'Họ và tên',
                    controller: _nameController,
                    isEditing: _isEditing,
                  ),
                  _divider(isDark),
                  _ProfileField(
                    icon: Icons.email_outlined,
                    label: 'Email',
                    value: authState.user?.userName != null
                        ? '${authState.user!.userName.toLowerCase().replaceAll(' ', '')}@email.com'
                        : 'user@email.com',
                    isEditing: false, // Email is not editable
                  ),
                  _divider(isDark),
                  _ProfileField(
                    icon: Icons.phone_outlined,
                    label: 'Số điện thoại',
                    controller: _phoneController,
                    isEditing: _isEditing,
                  ),
                  _divider(isDark),
                  _ProfileField(
                    icon: Icons.location_on_outlined,
                    label: 'Địa chỉ',
                    controller: _addressController,
                    isEditing: _isEditing,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // ── Stats ──
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Hoạt động',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _StatItem(
                        value: '4',
                        label: 'Yêu cầu\nđã gửi',
                        color: AppColors.blue,
                      ),
                      _statDivider(isDark),
                      _StatItem(
                        value: '2',
                        label: 'Đã hoàn\nthành',
                        color: AppColors.emerald,
                      ),
                      _statDivider(isDark),
                      _StatItem(
                        value: '1',
                        label: 'Đang\nxử lý',
                        color: AppColors.amber,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            if (_isEditing) ...[
              const SizedBox(height: 20),
              AppButton(
                text: 'Lưu thay đổi',
                width: double.infinity,
                icon: Icons.save_outlined,
                onPressed: () {
                  setState(() => _isEditing = false);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Đã lưu thay đổi!'),
                      backgroundColor: AppColors.emerald,
                    ),
                  );
                },
              ),
            ],

            const SizedBox(height: 20),

            // ── Logout ──
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => ref.read(authProvider.notifier).logout(),
                icon: const Icon(
                  Icons.logout_rounded,
                  size: 18,
                  color: AppColors.red,
                ),
                label: const Text(
                  'Đăng xuất',
                  style: TextStyle(color: AppColors.red),
                ),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: AppColors.red.withValues(alpha: 0.3)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _divider(bool isDark) {
    return Divider(
      height: 1,
      color: (isDark ? AppColors.darkBorder : AppColors.lightBorder).withValues(
        alpha: 0.5,
      ),
    );
  }

  Widget _statDivider(bool isDark) {
    return Container(
      width: 1,
      height: 40,
      color: (isDark ? AppColors.darkBorder : AppColors.lightBorder).withValues(
        alpha: 0.5,
      ),
    );
  }
}

class _ProfileField extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? value;
  final TextEditingController? controller;
  final bool isEditing;

  const _ProfileField({
    required this.icon,
    required this.label,
    this.value,
    this.controller,
    required this.isEditing,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.cyan),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: isDark
                        ? AppColors.darkTextMuted
                        : AppColors.lightTextMuted,
                  ),
                ),
                const SizedBox(height: 4),
                if (isEditing && controller != null)
                  TextField(
                    controller: controller,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: const InputDecoration(
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(vertical: 4),
                      border: InputBorder.none,
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: AppColors.cyan, width: 1),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: AppColors.cyan, width: 2),
                      ),
                    ),
                  )
                else
                  Text(
                    value ?? controller?.text ?? '-',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _StatItem({
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
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
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
