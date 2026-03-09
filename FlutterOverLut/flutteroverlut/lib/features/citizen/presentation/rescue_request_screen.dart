import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';

/// Screen for citizens to submit a new rescue request (SOS).
class RescueRequestScreen extends ConsumerStatefulWidget {
  const RescueRequestScreen({super.key});

  @override
  ConsumerState<RescueRequestScreen> createState() =>
      _RescueRequestScreenState();
}

class _RescueRequestScreenState extends ConsumerState<RescueRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descController = TextEditingController();
  final _locationController = TextEditingController();
  final _phoneController = TextEditingController();
  final _peopleController = TextEditingController();
  int _urgencyLevel = 3; // default: Cao
  bool _isSubmitting = false;

  @override
  void dispose() {
    _descController.dispose();
    _locationController.dispose();
    _phoneController.dispose();
    _peopleController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() => _isSubmitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🆘 Yêu cầu cứu trợ đã được gửi thành công!'),
          backgroundColor: AppColors.emerald,
        ),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Yêu cầu cứu trợ'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── SOS Header ──
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.red.withValues(alpha: 0.15),
                      AppColors.amber.withValues(alpha: 0.08),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppColors.red.withValues(alpha: 0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.red.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.sos_rounded,
                        color: AppColors.red,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Gửi yêu cầu cứu trợ khẩn cấp',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Thông tin sẽ được gửi đến đội cứu hộ gần nhất',
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
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ── Location ──
              AppTextField(
                label: 'Vị trí hiện tại',
                hint: 'VD: 123 Nguyễn Văn Linh, Quận 7',
                controller: _locationController,
                prefixIcon: Icons.location_on_outlined,
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Vui lòng nhập vị trí' : null,
              ),
              const SizedBox(height: 16),

              // ── Description ──
              AppTextField(
                label: 'Mô tả tình trạng',
                hint: 'VD: Nước dâng cao, 5 người mắc kẹt tầng 2...',
                controller: _descController,
                prefixIcon: Icons.description_outlined,
                validator: (v) => (v == null || v.isEmpty)
                    ? 'Vui lòng mô tả tình trạng'
                    : null,
              ),
              const SizedBox(height: 16),

              // ── Number of people ──
              AppTextField(
                label: 'Số người cần cứu trợ',
                hint: 'VD: 5',
                controller: _peopleController,
                keyboardType: TextInputType.number,
                prefixIcon: Icons.people_outline,
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Vui lòng nhập số người' : null,
              ),
              const SizedBox(height: 16),

              // ── Phone ──
              AppTextField(
                label: 'Số điện thoại liên lạc',
                hint: '0912 345 678',
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                prefixIcon: Icons.phone_outlined,
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Vui lòng nhập SĐT' : null,
              ),
              const SizedBox(height: 20),

              // ── Urgency Level ──
              Text(
                'Mức độ khẩn cấp',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.darkText : AppColors.lightText,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _UrgencyChip(
                    label: 'Thấp',
                    color: AppColors.emerald,
                    selected: _urgencyLevel == 1,
                    onTap: () => setState(() => _urgencyLevel = 1),
                  ),
                  const SizedBox(width: 8),
                  _UrgencyChip(
                    label: 'Trung bình',
                    color: AppColors.blue,
                    selected: _urgencyLevel == 2,
                    onTap: () => setState(() => _urgencyLevel = 2),
                  ),
                  const SizedBox(width: 8),
                  _UrgencyChip(
                    label: 'Cao',
                    color: AppColors.amber,
                    selected: _urgencyLevel == 3,
                    onTap: () => setState(() => _urgencyLevel = 3),
                  ),
                  const SizedBox(width: 8),
                  _UrgencyChip(
                    label: 'Khẩn cấp',
                    color: AppColors.red,
                    selected: _urgencyLevel == 4,
                    onTap: () => setState(() => _urgencyLevel = 4),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // ── Submit ──
              AppButton(
                text: _isSubmitting ? 'Đang gửi...' : '🆘 Gửi yêu cầu cứu trợ',
                isLoading: _isSubmitting,
                width: double.infinity,
                onPressed: _handleSubmit,
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _UrgencyChip extends StatelessWidget {
  final String label;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _UrgencyChip({
    required this.label,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? color.withValues(alpha: 0.2) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: selected ? color : color.withValues(alpha: 0.3),
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                color: selected ? color : color.withValues(alpha: 0.7),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
