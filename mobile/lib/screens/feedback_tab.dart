import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../theme.dart';

class FeedbackTab extends StatefulWidget {
  const FeedbackTab({super.key});

  @override
  State<FeedbackTab> createState() => _FeedbackTabState();
}

class _FeedbackTabState extends State<FeedbackTab> {
  final _nameController = TextEditingController();
  final _contactController = TextEditingController();
  final _messageController = TextEditingController();
  String category = 'General Feedback';
  bool isUrgent = false;
  bool sending = false;
  bool submitted = false;

  final categories = [
    'General Feedback',
    'Editorial Complaint',
    'Programming Suggestion',
    'Copyright Takedown',
    'Song Request',
  ];

  Future<void> _submit() async {
    if (_messageController.text.trim().isEmpty) return;
    setState(() => sending = true);

    final ok = await ApiService.submitFeedback(
      name: _nameController.text.trim().isEmpty ? null : _nameController.text.trim(),
      contact: _contactController.text.trim().isEmpty ? null : _contactController.text.trim(),
      category: category,
      message: _messageController.text.trim(),
      isUrgent: isUrgent,
    );

    if (mounted) {
      setState(() {
        sending = false;
        submitted = ok;
        if (ok) {
          _nameController.clear();
          _contactController.clear();
          _messageController.clear();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Feedback & Complaints Channel',
          style: GoogleFonts.fraunces(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.stationInk,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Direct submission to Nyanthepa station leadership.',
          style: GoogleFonts.inter(fontSize: 12, color: Colors.black54),
        ),
        const SizedBox(height: 16),

        if (submitted) ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.accentCommunity.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.accentCommunity),
            ),
            child: Column(
              children: [
                const Icon(Icons.check_circle, color: AppTheme.accentCommunity, size: 36),
                const SizedBox(height: 8),
                Text(
                  'Zikomo kwambiri!',
                  style: GoogleFonts.fraunces(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Your message was received and logged for editorial management review.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 11),
                ),
                TextButton(
                  onPressed: () => setState(() => submitted = false),
                  child: const Text('Send another submission'),
                ),
              ],
            ),
          ),
        ] else ...[
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: 'Name (Optional)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _contactController,
            decoration: InputDecoration(
              labelText: 'Phone or Email (Optional)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            ),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: category,
            decoration: InputDecoration(
              labelText: 'Category',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            ),
            items: categories.map((c) => DropdownMenuItem(value: c, child: Text(c, style: GoogleFonts.inter(fontSize: 12)))).toList(),
            onChanged: (v) => setState(() => category = v!),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _messageController,
            maxLines: 4,
            decoration: InputDecoration(
              labelText: 'Message / Complaint *',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            ),
          ),
          const SizedBox(height: 12),
          CheckboxListTile(
            title: Text('Mark as urgent matter', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
            value: isUrgent,
            onChanged: (v) => setState(() => isUrgent = v ?? false),
            contentPadding: EdgeInsets.zero,
            controlAffinity: ListTileControlAffinity.leading,
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: sending ? null : _submit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.stationInk,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: Text(sending ? 'Submitting...' : 'Submit to Management', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
          ),
        ],

        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppTheme.stationSand.withOpacity(0.6),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Third-Party Regulatory Escalation',
                style: GoogleFonts.fraunces(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.stationInk),
              ),
              const SizedBox(height: 4),
              Text(
                'Unresolved complaints can be escalated directly to the Malawi Communications Regulatory Authority (MACRA - Toll-free 263) and the Media Council of Malawi (MCM).',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.black87),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
