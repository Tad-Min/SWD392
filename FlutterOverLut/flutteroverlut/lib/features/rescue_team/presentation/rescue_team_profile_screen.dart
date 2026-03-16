import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/app_button.dart';
import '../../auth/presentation/auth_providers.dart';
import 'rescue_team_providers.dart';

/// User profile screen for Rescue Team members.
class RescueTeamProfileScreen extends ConsumerStatefulWidget {
  const RescueTeamProfileScreen({super.key});

  @override
  ConsumerState<RescueTeamProfileScreen> createState() =>
      _RescueTeamProfileScreenState();
}

class _RescueTeamProfileScreenState
    extends ConsumerState<RescueTeamProfileScreen> {
  bool _isEditing = false;
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _nameController = TextEditingController(
      text: user?.userName ?? 'Đội viên cứu hộ',
    );
    _phoneController = TextEditingController(text: '0912 345 678');
    _addressController = TextEditingController(text: 'Đội cứu hộ địa phương');
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
    final teamAsync = ref.watch(currentTeamProvider);

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
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(currentTeamProvider.future),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // ── Avatar + Name ──
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [AppColors.emerald, AppColors.cyan],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.emerald.withValues(alpha: 0.3),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    (authState.user?.userName ?? 'R')
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
                authState.user?.userName ?? 'Đội viên',
                style: const TextStyle(
                    fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              
              // ── Role Badges ──
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.cyan.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _getRoleName(authState.user?.roleId),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.cyan,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.emerald.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      teamAsync.valueOrNull?.teamName ?? 'Chưa có đội',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.emerald,
                      ),
                    ),
                  ),
                ],
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
                      isEditing: false, 
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
                      label: 'Đơn vị',
                      controller: _addressController,
                      isEditing: _isEditing,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ── Teammates ──
              teamAsync.when(
                data: (team) {
                  if (team == null) {
                    return AppCard(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Center(
                          child: Text(
                            'Bạn chưa được phân bổ vào Đội cứu hộ nào.',
                            style: TextStyle(
                              color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  // Exclude current user from the list
                  final teammates = team.members
                      .where((m) => m.userId != authState.user?.userId)
                      .toList();

                  if (teammates.isEmpty) {
                    return AppCard(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Center(
                          child: Text(
                            'Đội "${team.teamName}" chưa có thành viên khác.',
                            style: TextStyle(
                              color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  return AppCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.group_outlined, color: AppColors.emerald, size: 20),
                            const SizedBox(width: 8),
                            const Text(
                              'Đồng đội',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.emerald.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '${teammates.length}',
                                style: const TextStyle(
                                  color: AppColors.emerald,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ...teammates.map((member) => Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    radius: 18,
                                    backgroundColor: AppColors.darkBorder,
                                    child: Text(
                                      (member.fullName ?? member.email ?? 'U')[0]
                                          .toUpperCase(),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          member.fullName ?? member.email ?? 'Thành viên',
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        if (member.phone != null)
                                          Text(
                                            member.phone!,
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: isDark
                                                  ? AppColors.darkTextMuted
                                                  : AppColors.lightTextMuted,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppColors.cyan.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      member.memberRoleName,
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.cyan,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                      ],
                    ),
                  );
                },
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(20.0),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (err, stack) => const SizedBox.shrink(),
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
                    side: BorderSide(
                        color: AppColors.red.withValues(alpha: 0.3)),
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
      ),
    );
  }

  String _getRoleName(int? roleId) {
    if (roleId == null) return 'Người dùng';
    switch (roleId) {
      case 1:
        return 'Quản trị viên';
      case 2:
        return 'Đội cứu hộ';
      case 3:
        return 'Điều phối viên';
      case 4:
        return 'Lực lượng vũ trang';
      case 5:
        return 'Trung tâm y tế';
      default:
        return 'Người dân';
    }
  }

  Widget _divider(bool isDark) {
    return Divider(
      height: 1,
      color: (isDark ? AppColors.darkBorder : AppColors.lightBorder)
          .withValues(alpha: 0.5),
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
                        borderSide:
                            BorderSide(color: AppColors.cyan, width: 1),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: AppColors.cyan, width: 2),
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
