import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/services/location_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../data/citizen_api.dart';
import '../domain/citizen_models.dart';
import 'citizen_providers.dart';

/// Screen for citizens to submit a new rescue request (SOS).
/// Uses objective questions to auto-calculate UrgencyLevel.
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
  bool _isSubmitting = false;

  // ── GPS state ──
  double? _currentLat;
  double? _currentLng;
  bool _isLocating = false;

  @override
  void initState() {
    super.initState();
    // Pre-fill phone from user profile after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final profile = await ref.read(userProfileProvider.future);
        if (mounted && profile?.phone != null && profile!.phone!.isNotEmpty) {
          setState(() => _phoneController.text = profile.phone!);
        }
      } catch (_) {
        // Ignore API failures — user can manually type phone
      }
    });
  }

  // ── Question 1: Vulnerable people ──
  bool? _hasVulnerable; // null = chưa chọn

  // ── Question 2: Water level ──
  int? _waterLevel; // null = chưa chọn, 0 / 1 / 2

  // ── Question 3: People count (from text field) ──
  // parsed from _peopleController

  // ── Computed urgency ──
  int get _urgencyScore {
    int score = 0;

    // Q1: Có người già/trẻ em/người bệnh -> +1
    if (_hasVulnerable == true) score += 1;

    // Q2: Water level
    if (_waterLevel == 1) {
      score += 1; // Ngập tầng 1
    } else if (_waterLevel == 2) {
      score += 2; // Lên tới nóc nhà
    }

    // Q3: Trên 5 người -> +1
    final people = int.tryParse(_peopleController.text) ?? 0;
    if (people > 5) score += 1;

    return score;
  }

  /// Map score to urgency info: maps to DB UrgencyLevels (1=Normal, 2=High, 3=Critical).
  _UrgencyInfo get _urgencyInfo {
    final score = _urgencyScore;
    if (score >= 3) {
      return _UrgencyInfo(
        level: 3, // Critical
        label: 'Nghiêm trọng',
        color: AppColors.fuchsia,
        icon: Icons.warning_amber_rounded,
        description: 'Tình huống cực kỳ nguy hiểm, cần cứu hộ ngay!',
      );
    } else if (score == 2) {
      return _UrgencyInfo(
        level: 2, // High
        label: 'Nguy hiểm',
        color: AppColors.red,
        icon: Icons.dangerous_outlined,
        description: 'Tình huống nguy hiểm, ưu tiên cứu hộ sớm.',
      );
    } else {
      return _UrgencyInfo(
        level: 1, // Normal
        label: 'Cần hỗ trợ',
        color: AppColors.amber,
        icon: Icons.help_outline_rounded,
        description: 'Cần hỗ trợ, đội cứu hộ sẽ đến khi có thể.',
      );
    }
  }

  bool get _allQuestionsAnswered =>
      _hasVulnerable != null && _waterLevel != null;

  @override
  void dispose() {
    _descController.dispose();
    _locationController.dispose();
    _phoneController.dispose();
    _peopleController.dispose();
    super.dispose();
  }

  /// Fetch GPS coordinates and reverse-geocode to an address string.
  Future<void> _fetchGps() async {
    setState(() => _isLocating = true);
    try {
      final svc = ref.read(locationServiceProvider);
      final result = await svc.getCurrentLocation();
      setState(() {
        _currentLat = result.latitude;
        _currentLng = result.longitude;
        if (result.address != null && result.address!.isNotEmpty) {
          _locationController.text = result.address!;
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '✅ Vị trí: ${result.latitude.toStringAsFixed(5)}, ${result.longitude.toStringAsFixed(5)}',
            ),
            backgroundColor: AppColors.emerald,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('⚠️ $e'),
            backgroundColor: AppColors.amber,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLocating = false);
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    if (!_allQuestionsAnswered) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('⚠️ Vui lòng trả lời tất cả câu hỏi đánh giá'),
          backgroundColor: AppColors.amber,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final api = ref.read(citizenApiProvider);
      final request = RescueRequestModel(
        description: _descController.text.trim(),
        requestType: 1, // Default: rescue
        urgencyLevel: _urgencyInfo.level,
        peopleCount: int.tryParse(_peopleController.text) ?? 1,
        locationText: _locationController.text.trim(),
      );

      await api.createRescueRequest(
        request.toCreateJson(
          latitude: _currentLat,
          longitude: _currentLng,
        ),
      );

      // Refresh the requests list
      ref.invalidate(rescueRequestsProvider);

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
    } catch (e) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: AppColors.red,
          ),
        );
      }
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
        physics: const ClampingScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── SOS Header ──
              _buildSOSHeader(isDark),
              const SizedBox(height: 24),

              // ── Location with GPS button ──
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: AppTextField(
                      label: 'Vị trí hiện tại',
                      hint: 'VD: 123 Nguyễn Văn Linh, Quận 7',
                      controller: _locationController,
                      prefixIcon: Icons.location_on_outlined,
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Vui lòng nhập vị trí' : null,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Padding(
                    padding: const EdgeInsets.only(top: 22),
                    child: Tooltip(
                      message: 'Lấy vị trí GPS tự động',
                      child: Material(
                        color: _currentLat != null
                            ? AppColors.emerald.withValues(alpha: 0.15)
                            : AppColors.blue.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(14),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(14),
                          onTap: _isLocating ? null : _fetchGps,
                          child: Container(
                            width: 52,
                            height: 52,
                            alignment: Alignment.center,
                            child: _isLocating
                                ? SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.5,
                                      color: AppColors.blue,
                                    ),
                                  )
                                : Icon(
                                    _currentLat != null
                                        ? Icons.my_location_rounded
                                        : Icons.gps_fixed_rounded,
                                    color: _currentLat != null
                                        ? AppColors.emerald
                                        : AppColors.blue,
                                    size: 24,
                                  ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              if (_currentLat != null)
                Padding(
                  padding: const EdgeInsets.only(top: 4, left: 4),
                  child: Row(
                    children: [
                      Icon(Icons.check_circle_outline,
                          size: 12, color: AppColors.emerald),
                      const SizedBox(width: 4),
                      Text(
                        'GPS: ${_currentLat!.toStringAsFixed(4)}°N, ${_currentLng!.toStringAsFixed(4)}°E',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.emerald,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
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
              const SizedBox(height: 16),

              // ── Description ──
              AppTextField(
                label: 'Mô tả thêm (tuỳ chọn)',
                hint: 'VD: Nhà bị ngập, cần hỗ trợ di chuyển...',
                controller: _descController,
                prefixIcon: Icons.description_outlined,
              ),
              const SizedBox(height: 28),

              // ══════════════════════════════════════════════════════
              // ── ĐÁNH GIÁ TÌNH TRẠNG (Objective Questions) ──
              // ══════════════════════════════════════════════════════
              _buildSectionTitle(
                icon: Icons.fact_check_outlined,
                title: 'Đánh giá tình trạng',
                isDark: isDark,
              ),
              const SizedBox(height: 6),
              Text(
                'Trả lời các câu hỏi sau để hệ thống tự đánh giá mức khẩn cấp',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark
                      ? AppColors.darkTextMuted
                      : AppColors.lightTextMuted,
                ),
              ),
              const SizedBox(height: 16),

              // ── Q1: Người dễ tổn thương ──
              _buildQuestionCard(
                isDark: isDark,
                questionNumber: 1,
                question: 'Có người già, trẻ em hoặc người bệnh không?',
                icon: Icons.elderly_rounded,
                child: Row(
                  children: [
                    Expanded(
                      child: _AnswerChip(
                        label: 'Có',
                        icon: Icons.check_circle_outline,
                        color: AppColors.red,
                        selected: _hasVulnerable == true,
                        onTap: () => setState(() => _hasVulnerable = true),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _AnswerChip(
                        label: 'Không',
                        icon: Icons.cancel_outlined,
                        color: AppColors.emerald,
                        selected: _hasVulnerable == false,
                        onTap: () => setState(() => _hasVulnerable = false),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // ── Q2: Mức nước ──
              _buildQuestionCard(
                isDark: isDark,
                questionNumber: 2,
                question: 'Mức nước hiện tại ở đâu?',
                icon: Icons.water_rounded,
                child: Column(
                  children: [
                    _WaterLevelOption(
                      label: 'Đến gối',
                      subtitle: 'Nước ngập thấp, vẫn di chuyển được',
                      emoji: '🌊',
                      color: AppColors.emerald,
                      selected: _waterLevel == 0,
                      onTap: () => setState(() => _waterLevel = 0),
                    ),
                    const SizedBox(height: 8),
                    _WaterLevelOption(
                      label: 'Đang ngập tầng 1',
                      subtitle: 'Phải di chuyển lên tầng trên',
                      emoji: '🏠',
                      color: AppColors.amber,
                      selected: _waterLevel == 1,
                      onTap: () => setState(() => _waterLevel = 1),
                    ),
                    const SizedBox(height: 8),
                    _WaterLevelOption(
                      label: 'Lên tới nóc nhà / Không còn chỗ đứng',
                      subtitle: 'Tình huống cực kỳ nguy hiểm',
                      emoji: '🆘',
                      color: AppColors.red,
                      selected: _waterLevel == 2,
                      onTap: () => setState(() => _waterLevel = 2),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // ── Q3: Số người ──
              _buildQuestionCard(
                isDark: isDark,
                questionNumber: 3,
                question: 'Số lượng người cần cứu trợ?',
                icon: Icons.people_rounded,
                child: AppTextField(
                  hint: 'VD: 5',
                  controller: _peopleController,
                  keyboardType: TextInputType.number,
                  prefixIcon: Icons.groups_outlined,
                  onChanged: (_) => setState(() {}),
                  validator: (v) => (v == null || v.isEmpty)
                      ? 'Vui lòng nhập số người'
                      : null,
                ),
              ),
              const SizedBox(height: 24),

              const SizedBox(height: 24),

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

  // ─────────────────────────────────────────────────────────────────
  // ── Helper Builders ──
  // ─────────────────────────────────────────────────────────────────

  Widget _buildSOSHeader(bool isDark) {
    return Container(
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
        border: Border.all(color: AppColors.red.withValues(alpha: 0.2)),
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
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Trả lời nhanh các câu hỏi – hệ thống sẽ tự đánh giá mức độ khẩn cấp',
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
    );
  }

  Widget _buildSectionTitle({
    required IconData icon,
    required String title,
    required bool isDark,
  }) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.cyan),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
      ],
    );
  }

  Widget _buildQuestionCard({
    required bool isDark,
    required int questionNumber,
    required String question,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
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
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: AppColors.cyan.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    '$questionNumber',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: AppColors.cyan,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Icon(icon, size: 18, color: AppColors.cyan),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  question,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}


// ═══════════════════════════════════════════════════════════════════
// ── Supporting Widgets ──
// ═══════════════════════════════════════════════════════════════════

class _UrgencyInfo {
  final int level;
  final String label;
  final Color color;
  final IconData icon;
  final String description;

  const _UrgencyInfo({
    required this.level,
    required this.label,
    required this.color,
    required this.icon,
    required this.description,
  });
}

/// A selectable chip for Yes/No answers.
class _AnswerChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _AnswerChip({
    required this.label,
    required this.icon,
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
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? color.withValues(alpha: 0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? color : color.withValues(alpha: 0.3),
            width: selected ? 1.8 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: selected ? color : color.withValues(alpha: 0.5),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                color: selected ? color : color.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// A selectable option for water level with emoji + text.
class _WaterLevelOption extends StatelessWidget {
  final String label;
  final String subtitle;
  final String emoji;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _WaterLevelOption({
    required this.label,
    required this.subtitle,
    required this.emoji,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: selected
              ? color.withValues(alpha: 0.12)
              : (isDark
                    ? AppColors.darkInput.withValues(alpha: 0.5)
                    : AppColors.lightInput),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? color : Colors.transparent,
            width: selected ? 1.8 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                      color: selected ? color : null,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
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
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: selected
                    ? color
                    : (isDark
                          ? AppColors.darkBorder.withValues(alpha: 0.5)
                          : AppColors.lightBorder),
                border: Border.all(
                  color: selected
                      ? color
                      : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  width: 2,
                ),
              ),
              child: selected
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
