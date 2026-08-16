import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../theme.dart';

class PodcastsTab extends StatefulWidget {
  final Function(String url, String title, String presenter) onPlayAudio;

  const PodcastsTab({super.key, required this.onPlayAudio});

  @override
  State<PodcastsTab> createState() => _PodcastsTabState();
}

class _PodcastsTabState extends State<PodcastsTab> {
  List<dynamic> podcasts = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadPodcasts();
  }

  Future<void> _loadPodcasts() async {
    setState(() => loading = true);
    final data = await ApiService.getPodcasts();
    if (mounted) {
      setState(() {
        podcasts = data;
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _loadPodcasts,
      color: AppTheme.accentLive,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Copyright notice banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.stationSand,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.stationBorder),
            ),
            child: Row(
              children: [
                const Icon(Icons.shield_outlined, color: AppTheme.accentCommunity, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Audio downloads are station-produced or rights-cleared per Malawi Copyright Act.',
                    style: GoogleFonts.inter(fontSize: 10, color: AppTheme.stationInk),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          if (loading)
            const Center(child: CircularProgressIndicator(color: AppTheme.accentLive))
          else if (podcasts.isEmpty)
            const Center(child: Text('No podcasts found.'))
          else
            ...podcasts.map((p) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.stationBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            p['category'] ?? 'Culture',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.accentCommunity,
                            ),
                          ),
                          Text(
                            p['duration'] ?? '',
                            style: GoogleFonts.ibmPlexMono(fontSize: 10, color: Colors.black54),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        p['title'] ?? '',
                        style: GoogleFonts.fraunces(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.stationInk,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        p['description'] ?? '',
                        style: GoogleFonts.inter(fontSize: 11, color: Colors.black54),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Host: ${p['presenter']}',
                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w500),
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              widget.onPlayAudio(
                                p['audio_url'] ?? '',
                                p['title'] ?? '',
                                p['presenter'] ?? '',
                              );
                            },
                            icon: const Icon(Icons.play_arrow, size: 16),
                            label: const Text('Play'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.stationInk,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                )),
        ],
      ),
    );
  }
}
