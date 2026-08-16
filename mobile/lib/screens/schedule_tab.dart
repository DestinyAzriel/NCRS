import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../theme.dart';

class ScheduleTab extends StatefulWidget {
  const ScheduleTab({super.key});

  @override
  State<ScheduleTab> createState() => _ScheduleTabState();
}

class _ScheduleTabState extends State<ScheduleTab> {
  List<dynamic> allSlots = [];
  String selectedDay = 'Monday';
  bool loading = true;

  final days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  @override
  void initState() {
    super.initState();
    _loadSchedule();
  }

  Future<void> _loadSchedule() async {
    setState(() => loading = true);
    final data = await ApiService.getSchedule();
    if (mounted) {
      setState(() {
        allSlots = data;
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final daySlots = allSlots.where((s) => s['day_of_week'] == selectedDay).toList();

    return Column(
      children: [
        // Day selector chips
        Container(
          height: 48,
          color: Colors.white,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            scrollDirection: Axis.horizontal,
            itemCount: days.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (ctx, i) {
              final d = days[i];
              final isSel = selectedDay == d;
              return ChoiceChip(
                label: Text(d, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600)),
                selected: isSel,
                selectedColor: AppTheme.stationInk,
                labelStyle: TextStyle(color: isSel ? Colors.white : AppTheme.stationInk),
                onSelected: (_) => setState(() => selectedDay = d),
              );
            },
          ),
        ),

        // Schedule items
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadSchedule,
            color: AppTheme.accentLive,
            child: loading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.accentLive))
                : daySlots.isEmpty
                    ? const Center(child: Text('No schedule slots found.'))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: daySlots.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (ctx, i) {
                          final slot = daySlots[i];
                          return Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.stationBorder),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppTheme.stationSand,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    '${slot['start_time']}\n${slot['end_time']}',
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.ibmPlexMono(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.accentLive,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        slot['program_name'] ?? '',
                                        style: GoogleFonts.fraunces(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.stationInk,
                                        ),
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        'Anchors: ${slot['presenter']}',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: AppTheme.accentCommunity,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        slot['description'] ?? '',
                                        style: GoogleFonts.inter(fontSize: 11, color: Colors.black54),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ),
      ],
    );
  }
}
