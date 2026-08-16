import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/audio_handler.dart';
import '../theme.dart';
import 'live_tab.dart';
import 'news_tab.dart';
import 'schedule_tab.dart';
import 'sports_tab.dart';
import 'podcasts_tab.dart';
import 'feedback_tab.dart';
import 'privacy_tab.dart';

class HomeShell extends StatefulWidget {
  final RadioAudioHandler audioHandler;
  final Function(bool) onToggleContrast;
  final Function(double) onTextScaleChange;
  final bool isHighContrast;
  final double currentTextScale;

  const HomeShell({
    super.key,
    required this.audioHandler,
    required this.onToggleContrast,
    required this.onTextScaleChange,
    required this.isHighContrast,
    required this.currentTextScale,
  });

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _currentIndex = 0;
  bool isPlaying = false;
  bool isBuffering = false;
  String currentShowTitle = 'Morning Shire Horizon';
  String currentPresenter = 'Chifundo Banda & Maria Nyasulu';

  @override
  void initState() {
    super.initState();
    // Listen to playback state
    widget.audioHandler.playbackState.listen((state) {
      if (mounted) {
        setState(() {
          isPlaying = state.playing;
          isBuffering = state.processingState == AudioProcessingState.buffering ||
              state.processingState == AudioProcessingState.loading;
        });
      }
    });

    widget.audioHandler.mediaItem.listen((item) {
      if (mounted && item != null) {
        setState(() {
          currentShowTitle = item.title;
          currentPresenter = item.artist ?? 'Nyanthepa 107.6 FM';
        });
      }
    });
  }

  void _togglePlay() {
    if (isPlaying) {
      widget.audioHandler.pause();
    } else {
      widget.audioHandler.play();
    }
  }

  void _playSpecificAudio(String url, String title, String presenter) {
    widget.audioHandler.setStreamSource(url, title, presenter);
    widget.audioHandler.play();
    setState(() => _currentIndex = 0); // Switch to live tab
  }

  void _showMoreMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.headphones, color: AppTheme.accentGold),
              title: Text('Podcasts & Audio Downloads', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(ctx);
                setState(() => _currentIndex = 4);
              },
            ),
            ListTile(
              leading: const Icon(Icons.message_outlined, color: AppTheme.accentLive),
              title: Text('Feedback & Complaints Channel', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
              subtitle: const Text('MACRA / Media Council routing', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(ctx);
                setState(() => _currentIndex = 5);
              },
            ),
            ListTile(
              leading: const Icon(Icons.shield_outlined, color: AppTheme.accentCommunity),
              title: Text('Privacy Policy (Data Protection Act 2024)', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(ctx);
                setState(() => _currentIndex = 6);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tabs = [
      LiveTab(
        onTogglePlay: _togglePlay,
        isPlaying: isPlaying,
        isBuffering: isBuffering,
        showTitle: currentShowTitle,
        presenter: currentPresenter,
      ),
      const NewsTab(),
      const ScheduleTab(),
      const SportsTab(),
      PodcastsTab(onPlayAudio: _playSpecificAudio),
      const FeedbackTab(),
      const PrivacyTab(),
    ];

    final titles = [
      'Nyanthepa 107.6 FM',
      'Shire Valley News',
      'Broadcast Timetable',
      'Sports Standings',
      'Audio Podcasts',
      'Feedback & Complaints',
      'Privacy Policy',
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_currentIndex]),
        actions: [
          // Text size cycling button
          IconButton(
            icon: const Icon(Icons.text_fields),
            tooltip: 'Text Size',
            onPressed: () {
              final next = widget.currentTextScale >= 1.3
                  ? 1.0
                  : widget.currentTextScale == 1.0
                      ? 1.15
                      : 1.3;
              widget.onTextScaleChange(next);
            },
          ),
          // High contrast toggle
          IconButton(
            icon: Icon(widget.isHighContrast ? Icons.visibility : Icons.contrast),
            tooltip: 'High Contrast Mode',
            onPressed: () => widget.onToggleContrast(!widget.isHighContrast),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(child: tabs[_currentIndex]),

          // Persistent Mini-Player Bar (When not on Live tab)
          if (_currentIndex != 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: const BoxDecoration(
                color: AppTheme.stationInk,
                border: Border(top: BorderSide(color: Colors.white24)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isPlaying ? AppTheme.accentLive : Colors.white30,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          currentShowTitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          currentPresenter,
                          maxLines: 1,
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            color: Colors.white60,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      isPlaying ? Icons.pause_circle_filled : Icons.play_circle_fill,
                      color: AppTheme.accentLive,
                      size: 32,
                    ),
                    onPressed: _togglePlay,
                  ),
                ],
              ),
            ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex > 3 ? 4 : _currentIndex,
        onTap: (index) {
          if (index == 4) {
            _showMoreMenu();
          } else {
            setState(() => _currentIndex = index);
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.radio), label: 'Live'),
          BottomNavigationBarItem(icon: Icon(Icons.newspaper), label: 'News'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_month), label: 'Schedule'),
          BottomNavigationBarItem(icon: Icon(Icons.emoji_events), label: 'Sports'),
          BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'More'),
        ],
      ),
    );
  }
}
