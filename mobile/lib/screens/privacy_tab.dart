import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class PrivacyTab extends StatelessWidget {
  const PrivacyTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Privacy & Data Protection',
          style: GoogleFonts.fraunces(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.stationInk,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Compliance with Data Protection Act 2024 (Malawi)',
          style: GoogleFonts.inter(fontSize: 11, color: AppTheme.accentCommunity, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppTheme.stationBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '1. Minimum Data Processing',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                'Nyanthepa Community Radio does not track your personal location or sell listener data. Feedback submissions collect name and contact details strictly on an optional basis.',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.black87),
              ),
              const SizedBox(height: 14),
              Text(
                '2. Offline Data Storage',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                'News articles, schedule grids, and sports tables are cached locally on your device storage to save mobile data on 2G/3G connections across the Lower Shire.',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.black87),
              ),
              const SizedBox(height: 14),
              Text(
                '3. Data Retention',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                'Listener requests are retained for 90 days. Formal complaints are retained for 12 months for statutory MACRA regulatory inspection.',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.black87),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
