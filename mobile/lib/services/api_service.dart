import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; // Android emulator localhost alias
  static const String fallbackLocalUrl = 'http://127.0.0.1:8000/api/v1'; // Windows native alias

  // Helper for GET requests with offline fallback
  static Future<dynamic> _fetchWithCache(String endpoint, String cacheKey) async {
    final prefs = await SharedPreferences.getInstance();

    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.get(uri).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        await prefs.setString(cacheKey, response.body);
        return data;
      }
    } catch (_) {
      // Try local fallback on desktop/Windows
      try {
        final uriLocal = Uri.parse('$fallbackLocalUrl$endpoint');
        final responseLocal = await http.get(uriLocal).timeout(const Duration(seconds: 2));
        if (responseLocal.statusCode == 200) {
          final data = jsonDecode(utf8.decode(responseLocal.bodyBytes));
          await prefs.setString(cacheKey, responseLocal.body);
          return data;
        }
      } catch (_) {}
    }

    // Load from offline persistent cache
    final cached = prefs.getString(cacheKey);
    if (cached != null) {
      return jsonDecode(cached);
    }

    return null;
  }

  static Future<Map<String, dynamic>?> getStatus() async {
    final data = await _fetchWithCache('/status', 'cache_status');
    return data != null ? Map<String, dynamic>.from(data) : null;
  }

  static Future<List<dynamic>> getNews() async {
    final data = await _fetchWithCache('/news', 'cache_news');
    return data != null ? List<dynamic>.from(data) : [];
  }

  static Future<List<dynamic>> getSchedule() async {
    final data = await _fetchWithCache('/schedule', 'cache_schedule');
    return data != null ? List<dynamic>.from(data) : [];
  }

  static Future<List<dynamic>> getSports() async {
    final data = await _fetchWithCache('/sports', 'cache_sports');
    return data != null ? List<dynamic>.from(data) : [];
  }

  static Future<List<dynamic>> getPodcasts() async {
    final data = await _fetchWithCache('/podcasts', 'cache_podcasts');
    return data != null ? List<dynamic>.from(data) : [];
  }

  static Future<bool> submitFeedback({
    String? name,
    String? contact,
    required String category,
    required String message,
    bool isUrgent = false,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/feedback');
      final res = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'sender_name': name ?? 'Mobile Listener',
          'phone_or_email': contact,
          'category': category,
          'message': message,
          'is_urgent': isUrgent,
        }),
      );
      return res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }
}
