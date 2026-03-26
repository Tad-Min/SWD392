import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';
import '../data/volunteer_api.dart';
import '../domain/volunteer_models.dart';
import 'volunteer_providers.dart';

/// Screen for submitting a new volunteer supply offer.
class VolunteerOfferScreen extends ConsumerStatefulWidget {
  const VolunteerOfferScreen({super.key});

  @override
  ConsumerState<VolunteerOfferScreen> createState() =>
      _VolunteerOfferScreenState();
}

class _VolunteerOfferScreenState
    extends ConsumerState<VolunteerOfferScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _quantityCtrl = TextEditingController();
  final _unitCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();

  int? _selectedOfferTypeId;
  bool _isReturnRequired = false;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _quantityCtrl.dispose();
    _unitCtrl.dispose();
    _descCtrl.dispose();
    _locationCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedOfferTypeId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('⚠️ Vui lòng chọn loại vật tư'),
          backgroundColor: AppColors.amber,
        ),
      );
      return;
    }
    setState(() => _isSubmitting = true);
    try {
      final api = ref.read(volunteerApiProvider);
      await api.createOffer(
        offerTypeId: _selectedOfferTypeId!,
        offerName: _nameCtrl.text.trim(),
        quantity: double.tryParse(_quantityCtrl.text) ?? 1,
        unit: _unitCtrl.text.trim(),
        description: _descCtrl.text.trim().isEmpty
            ? null
            : _descCtrl.text.trim(),
        isReturnRequired: _isReturnRequired,
        dropoffLocationText: _locationCtrl.text.trim().isEmpty
            ? null
            : _locationCtrl.text.trim(),
        contactPhone: _phoneCtrl.text.trim().isEmpty
            ? null
            : _phoneCtrl.text.trim(),
      );
      ref.invalidate(myOffersProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content:
                Text('🎉 Đã đăng ký đóng góp vật tư! Cảm ơn bạn.'),
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
    final offerTypesAsync = ref.watch(offerTypesProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: AppBar(
        title: const Text('Đóng góp vật tư'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: offerTypesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) =>
            Center(child: Text('Không thể tải dữ liệu: $e')),
        data: (offerTypes) => Form(
          key: _formKey,
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    // Loại vật tư
                    _Label('Loại vật tư', isDark),
                    const SizedBox(height: 8),
                    _OfferTypeSelector(
                      offerTypes: offerTypes,
                      selectedId: _selectedOfferTypeId,
                      isDark: isDark,
                      onSelect: (id) {
                        setState(() => _selectedOfferTypeId = id);
                        // Suggest isReturnRequired based on type
                        final t = offerTypes
                            .where((t) => t.offerTypeId == id)
                            .firstOrNull;
                        if (t != null) {
                          setState(() =>
                              _isReturnRequired =
                                  t.isTypicallyReturnable ?? false);
                        }
                      },
                    ),
                    const SizedBox(height: 20),

                    // Tên vật tư
                    _Label('Tên vật tư', isDark),
                    const SizedBox(height: 8),
                    _Field(
                      controller: _nameCtrl,
                      hint: 'VD: Gạo ST25, Áo phao 5 chiếc...',
                      icon: Icons.label_rounded,
                      isDark: isDark,
                      validator: (v) => (v == null || v.isEmpty)
                          ? 'Vui lòng nhập tên'
                          : null,
                    ),
                    const SizedBox(height: 14),

                    // Số lượng & Đơn vị
                    Row(
                      children: [
                        Expanded(
                          flex: 2,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _Label('Số lượng', isDark),
                              const SizedBox(height: 8),
                              _Field(
                                controller: _quantityCtrl,
                                hint: '10',
                                icon: Icons.numbers_rounded,
                                isDark: isDark,
                                keyboardType: TextInputType.number,
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Nhập số lượng';
                                  }
                                  if (double.tryParse(v) == null) {
                                    return 'Không hợp lệ';
                                  }
                                  return null;
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 3,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _Label('Đơn vị', isDark),
                              const SizedBox(height: 8),
                              _Field(
                                controller: _unitCtrl,
                                hint: 'kg, túi, chiếc...',
                                icon: Icons.straighten_rounded,
                                isDark: isDark,
                                validator: (v) => (v == null || v.isEmpty)
                                    ? 'Nhập đơn vị'
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Mô tả
                    _Label('Mô tả (tuỳ chọn)', isDark),
                    const SizedBox(height: 8),
                    _Field(
                      controller: _descCtrl,
                      hint: 'Thông tin thêm về vật tư...',
                      icon: Icons.notes_rounded,
                      isDark: isDark,
                      maxLines: 2,
                    ),
                    const SizedBox(height: 14),

                    // Địa điểm giao
                    _Label('Địa điểm giao vật tư', isDark),
                    const SizedBox(height: 8),
                    _Field(
                      controller: _locationCtrl,
                      hint: 'VD: 123 Đường ABC, Phường XYZ',
                      icon: Icons.location_on_rounded,
                      isDark: isDark,
                    ),
                    const SizedBox(height: 14),

                    // Số điện thoại liên hệ
                    _Label('Số điện thoại liên hệ', isDark),
                    const SizedBox(height: 8),
                    _Field(
                      controller: _phoneCtrl,
                      hint: '0901234567',
                      icon: Icons.phone_rounded,
                      isDark: isDark,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 14),

                    // Cần hoàn trả?
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkCard : AppColors.lightCard,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isDark
                              ? AppColors.darkBorder
                              : AppColors.lightBorder,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.swap_horiz_rounded,
                            color: AppColors.amber,
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Yêu cầu hoàn trả',
                                  style: TextStyle(fontWeight: FontWeight.w600),
                                ),
                                Text(
                                  'Đánh dấu nếu bạn muốn lấy lại vật tư sau',
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
                          Switch(
                            value: _isReturnRequired,
                            onChanged: (v) =>
                                setState(() => _isReturnRequired = v),
                            activeColor: AppColors.amber,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: AppButton(
                  text: _isSubmitting ? 'Đang gửi...' : '📦 Gửi đóng góp',
                  isLoading: _isSubmitting,
                  width: double.infinity,
                  onPressed: _submit,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Offer History Screen ────────────────────────────────────────────────────

class VolunteerOfferHistoryScreen extends ConsumerWidget {
  const VolunteerOfferHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final offersAsync = ref.watch(myOffersProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: AppBar(
        title: const Text('Lịch sử đóng góp'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(myOffersProvider.future),
        child: offersAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) =>
              Center(child: Text('Không thể tải lịch sử: $e')),
          data: (offers) => offers.isEmpty
              ? _EmptyHistory(isDark: isDark)
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: offers.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, i) =>
                      _OfferHistoryCard(offer: offers[i], isDark: isDark),
                ),
        ),
      ),
    );
  }
}

// ─── Shared Widgets ───────────────────────────────────────────────────────────

class _OfferTypeSelector extends StatelessWidget {
  final List<VolunteerOfferTypeModel> offerTypes;
  final int? selectedId;
  final bool isDark;
  final void Function(int) onSelect;

  const _OfferTypeSelector({
    required this.offerTypes,
    required this.selectedId,
    required this.isDark,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: offerTypes.map((type) {
        final id = type.offerTypeId ?? 0;
        final selected = selectedId == id;
        return GestureDetector(
          onTap: () => onSelect(id),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: selected
                  ? AppColors.amber.withValues(alpha: 0.15)
                  : (isDark ? AppColors.darkCard : AppColors.lightCard),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: selected ? AppColors.amber : (isDark
                    ? AppColors.darkBorder
                    : AppColors.lightBorder),
                width: selected ? 1.5 : 1,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(_offerTypeIcon(id)),
                const SizedBox(width: 6),
                Text(
                  type.displayName,
                  style: TextStyle(
                    fontWeight:
                        selected ? FontWeight.w600 : FontWeight.normal,
                    color: selected ? AppColors.amber : null,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  String _offerTypeIcon(int id) {
    switch (id) {
      case 1:
        return '🍚';
      case 2:
        return '🦺';
      case 3:
        return '⛵';
      case 4:
        return '💊';
      case 5:
        return '🔧';
      default:
        return '📦';
    }
  }
}

class _OfferHistoryCard extends StatelessWidget {
  final VolunteerOfferModel offer;
  final bool isDark;

  const _OfferHistoryCard({required this.offer, required this.isDark});

  Color get _statusColor {
    switch (offer.currentStatus) {
      case 1:
        return AppColors.emerald;
      case 2:
        return AppColors.cyan;
      default:
        return AppColors.amber;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: _statusColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.inventory_2_rounded, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  offer.offerName ?? 'Vật tư đóng góp',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${offer.quantity?.toStringAsFixed(0) ?? 0} ${offer.unit ?? ''}',
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
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: _statusColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              offer.statusLabel,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: _statusColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyHistory extends StatelessWidget {
  final bool isDark;
  const _EmptyHistory({required this.isDark});

  @override
  Widget build(BuildContext context) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.inventory_2_outlined,
              size: 60,
              color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
            ),
            const SizedBox(height: 16),
            Text(
              'Chưa có đóng góp nào',
              style: TextStyle(
                fontSize: 16,
                color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
              ),
            ),
          ],
        ),
      );
}

class _Label extends StatelessWidget {
  final String text;
  final bool isDark;
  const _Label(this.text, this.isDark);

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
        ),
      );
}

class _Field extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final bool isDark;
  final int maxLines;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;

  const _Field({
    required this.controller,
    required this.hint,
    required this.icon,
    required this.isDark,
    this.maxLines = 1,
    this.keyboardType = TextInputType.text,
    this.validator,
  });

  @override
  Widget build(BuildContext context) => TextFormField(
        controller: controller,
        maxLines: maxLines,
        keyboardType: keyboardType,
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
