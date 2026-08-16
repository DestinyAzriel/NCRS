import 'package:audio_service/audio_service.dart';
import 'package:just_audio/just_audio.dart';

class RadioAudioHandler extends BaseAudioHandler with SeekHandler {
  final _player = AudioPlayer();

  RadioAudioHandler() {
    _init();
  }

  void _init() {
    // Forward playback events to AudioService
    _player.playbackEventStream.listen((PlaybackEvent event) {
      final playing = _player.playing;
      playbackState.add(playbackState.value.copyWith(
        controls: [
          if (playing) MediaControl.pause else MediaControl.play,
          MediaControl.stop,
        ],
        systemActions: const {
          MediaAction.seek,
          MediaAction.seekForward,
          MediaAction.seekBackward,
        },
        androidCompactActionIndices: const [0, 1],
        processingState: const {
          ProcessingState.idle: AudioProcessingState.idle,
          ProcessingState.loading: AudioProcessingState.loading,
          ProcessingState.buffering: AudioProcessingState.buffering,
          ProcessingState.ready: AudioProcessingState.ready,
          ProcessingState.completed: AudioProcessingState.completed,
        }[_player.processingState]!,
        playing: playing,
        updatePosition: _player.position,
        bufferedPosition: _player.bufferedPosition,
        speed: _player.speed,
      ));
    });

    // Default metadata
    mediaItem.add(const MediaItem(
      id: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
      album: '107.6 MHz FM Nsanje',
      title: 'Nyanthepa Community Radio Live',
      artist: 'Nsanje & Lower Shire',
    ));
  }

  Future<void> setStreamSource(String url, String showTitle, String presenter) async {
    mediaItem.add(MediaItem(
      id: url,
      album: 'Nyanthepa 107.6 FM',
      title: showTitle,
      artist: presenter,
    ));
    await _player.setUrl(url);
  }

  @override
  Future<void> play() => _player.play();

  @override
  Future<void> pause() => _player.pause();

  @override
  Future<void> stop() => _player.stop();

  AudioPlayer get player => _player;
}
