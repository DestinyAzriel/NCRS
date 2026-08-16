import 'package:flutter/material.dart';
import 'package:audio_service/audio_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/audio_handler.dart';
import 'screens/home_shell.dart';
import 'theme.dart';

late RadioAudioHandler _audioHandler;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  _audioHandler = await AudioService.init(
    builder: () => RadioAudioHandler(),
    config: const AudioServiceConfig(
      androidNotificationChannelId: 'mw.nyanthepa.radio.channel.audio',
      androidNotificationChannelName: 'Nyanthepa Radio Broadcast',
      androidNotificationOngoing: true,
      androidStopForegroundOnPause: true,
    ),
  );

  runApp(const NyanthepaApp());
}

class NyanthepaApp extends StatefulWidget {
  const NyanthepaApp({super.key});

  @override
  State<NyanthepaApp> createState() => _NyanthepaAppState();
}

class _NyanthepaAppState extends State<NyanthepaApp> {
  bool highContrast = false;
  double textScale = 1.0;

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      highContrast = prefs.getBool('pref_contrast') ?? false;
      textScale = prefs.getDouble('pref_text_scale') ?? 1.0;
    });
  }

  void _toggleContrast(bool val) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('pref_contrast', val);
    setState(() => highContrast = val);
  }

  void _changeTextScale(double scale) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('pref_text_scale', scale);
    setState(() => textScale = scale);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nyanthepa 107.6 FM',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(highContrast: highContrast, textScale: textScale),
      home: HomeShell(
        audioHandler: _audioHandler,
        onToggleContrast: _toggleContrast,
        onTextScaleChange: _changeTextScale,
        isHighContrast: highContrast,
        currentTextScale: textScale,
      ),
    );
  }
}
