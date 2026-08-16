import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../theme.dart';

class LiveTab extends StatefulWidget {
  final VoidCallback onTogglePlay;
  final bool isPlaying;
  final bool isBuffering;
  final String showTitle;
  final String presenter;

  const LiveTab({
    super.key,
    required this.onTogglePlay,
    required this.isPlaying,
    required this.isBuffering,
    required this.showTitle,
    required this.presenter,
  });

  @override
  State<LiveTab> createState() => _LiveTabState();
}

class _LiveTabState extends State<LiveTab> {
  Map<String, dynamic>? status;
  List<dynamic> todaySlots = [];
  bool loading = true;
  final _nameController = TextEditingController();
  final _msgController = TextEditingController();
  bool shoutoutSent = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => loading = true);
    final st = await ApiService.getStatus();
    final sched = await ApiService.getSchedule();
    if (mounted) {
      setState(() {
        status = st;
        todaySlots = sched.take(4).toList();
        loading = false;
      });
    }
  }

  void _sendShoutout() {
    if (_msgController.text.trim().isEmpty) return;
    setState(() => shoutoutSent = true);
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          shoutoutSent = false;
          _nameController.clear();
          _msgController.clear();
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final title = status?['on_air_show_title'] ?? widget.showTitle;
    final presenter = status?['on_air_presenter'] ?? widget.presenter;

    return RefreshIndicator(
      onRefresh: _loadData,
      color: AppTheme.accentLive,
      child: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // Emergency Advisory Banner (if active)
          if (status?['advisory_active'] == true) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.accentLive.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: const Border(
                  left: BorderSide(color: AppTheme.accentLive, width: 4),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppTheme.accentLive,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        status?['advisory_headline'] ?? 'SHIRE VALLEY ADVISORY',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.accentLive,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    status?['advisory_message'] ?? 'Water levels along Chiromo remain steady. Tune into 107.6 FM.',
                    style: GoogleFonts.inter(fontSize: 12, color: AppTheme.stationInk),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Master Radio Studio Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.stationInk,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top tag
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.accentLive.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppTheme.accentLive.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: AppTheme.accentLive,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '107.6 FM LIVE',
                            style: GoogleFonts.ibmPlexMono(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'NSANJE BOMA',
                      style: GoogleFonts.ibmPlexMono(
                        fontSize: 10,
                        color: AppTheme.accentGold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Show Title
                Text(
                  title,
                  style: GoogleFonts.fraunces(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Anchors: $presenter',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 24),

                // Listen Big Button
                Center(
                  child: ElevatedButton.icon(
                    onPressed: widget.onTogglePlay,
                    icon: widget.isBuffering
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : Icon(
                            widget.isPlaying ? Icons.pause : Icons.play_arrow,
                            size: 26,
                          ),
                    label: Text(
                      widget.isBuffering
                          ? 'CONNECTING (3G)...'
                          : widget.isPlaying
                              ? 'PAUSE BROADCAST'
                              : 'LISTEN LIVE NOW',
                      style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.accentLive,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      elevation: 4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Send Shoutout Card
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
                  'Transmit Message to On-Air Studio',
                  style: GoogleFonts.fraunces(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.stationInk,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Appears on presenter monitors in Nsanje Boma.',
                  style: GoogleFonts.inter(fontSize: 11, color: Colors.black54),
                ),
                const SizedBox(height: 12),

                if (shoutoutSent) ...[
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.accentCommunity.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppTheme.accentCommunity.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle, color: AppTheme.accentCommunity, size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Zikomo! Message sent to live studio.',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: AppTheme.accentCommunity,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  TextField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      hintText: 'Your name / village (e.g. Maria from Marka)',
                      hintStyle: GoogleFonts.inter(fontSize: 12),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _msgController,
                    maxLines: 2,
                    decoration: InputDecoration(
                      hintText: 'Greetings or song request...',
                      hintStyle: GoogleFonts.inter(fontSize: 12),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton(
                      onPressed: _sendShoutout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.stationInk,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      child: Text('Send to Studio', style: GoogleFonts.inter(fontSize: 12)),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Today's Lineup Snippet
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
                  "Today's Broadcast Lineup",
                  style: GoogleFonts.fraunces(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.stationInk,
                  ),
                ),
                const SizedBox(height: 12),
                if (todaySlots.isEmpty)
                  const Text('Loading schedule...')
                else
                  ...todaySlots.map((slot) => Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${slot['start_time']} - ${slot['end_time']}',
                              style: GoogleFonts.ibmPlexMono(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.accentLive,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    slot['program_name'] ?? '',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.stationInk,
                                    ),
                                  ),
                                  Text(
                                    slot['presenter'] ?? '',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
