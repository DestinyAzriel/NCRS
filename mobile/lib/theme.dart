import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Nyanthepa Exact Design Tokens
  static const Color stationBg = Color(0xFFF7F3EC);        // Warm off-white
  static const Color stationInk = Color(0xFF1B1E23);       // Near-black
  static const Color accentLive = Color(0xFFC4441F);       // Burnt clay / rust
  static const Color accentCommunity = Color(0xFF2E5339);  // Sorghum leaf green
  static const Color accentGold = Color(0xFFE8B94A);       // Dry-season gold
  static const Color stationSand = Color(0xFFEFEAE1);      // Card subtle
  static const Color stationBorder = Color(0xFFE2DDD3);

  static ThemeData lightTheme({bool highContrast = false, double textScale = 1.0}) {
    if (highContrast) {
      return ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.white,
        colorScheme: const ColorScheme.light(
          primary: Colors.black,
          secondary: Color(0xFFC4441F),
          surface: Colors.white,
          onSurface: Colors.black,
        ),
        textTheme: GoogleFonts.interTextTheme().apply(
          bodyColor: Colors.black,
          displayColor: Colors.black,
          fontSizeFactor: textScale,
        ),
      );
    }

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: stationBg,
      colorScheme: const ColorScheme.light(
        primary: stationInk,
        secondary: accentLive,
        tertiary: accentCommunity,
        surface: Colors.white,
        onSurface: stationInk,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: stationInk,
        foregroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.fraunces(
          fontSize: 20 * textScale,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.fraunces(
          fontSize: 28 * textScale,
          fontWeight: FontWeight.bold,
          color: stationInk,
        ),
        displayMedium: GoogleFonts.fraunces(
          fontSize: 22 * textScale,
          fontWeight: FontWeight.bold,
          color: stationInk,
        ),
        titleLarge: GoogleFonts.fraunces(
          fontSize: 18 * textScale,
          fontWeight: FontWeight.bold,
          color: stationInk,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15 * textScale,
          color: stationInk,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 13 * textScale,
          color: stationInk,
        ),
        labelSmall: GoogleFonts.ibmPlexMono(
          fontSize: 11 * textScale,
          fontWeight: FontWeight.w600,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: stationInk,
        selectedItemColor: accentGold,
        unselectedItemColor: Colors.white70,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
