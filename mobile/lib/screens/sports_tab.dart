import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../theme.dart';

class SportsTab extends StatefulWidget {
  const SportsTab({super.key});

  @override
  State<SportsTab> createState() => _SportsTabState();
}

class _SportsTabState extends State<SportsTab> with SingleTickerProviderStateMixin {
  List<dynamic> leagues = [];
  bool loading = true;
  TabController? _tabController;

  @override
  void initState() {
    super.initState();
    _loadSports();
  }

  Future<void> _loadSports() async {
    setState(() => loading = true);
    final data = await ApiService.getSports();
    if (mounted) {
      setState(() {
        leagues = data;
        loading = false;
        if (leagues.isNotEmpty) {
          _tabController = TabController(length: leagues.length, vsync: this);
        }
      });
    }
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.accentLive));
    }
    if (leagues.isEmpty) {
      return const Center(child: Text('No sports tables available.'));
    }

    return Column(
      children: [
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppTheme.accentLive,
            unselectedLabelColor: Colors.black54,
            indicatorColor: AppTheme.accentLive,
            labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
            tabs: leagues.map((l) => Tab(text: l['league_name'])).toList(),
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: leagues.map((l) {
              final standings = List<Map<String, dynamic>>.from(l['standings_data'] ?? []);
              return RefreshIndicator(
                onRefresh: _loadSports,
                color: AppTheme.accentLive,
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    Text(
                      'Season: ${l['season']}',
                      style: GoogleFonts.ibmPlexMono(fontSize: 11, color: Colors.black54),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.stationBorder),
                      ),
                      child: DataTable(
                        columnSpacing: 14,
                        horizontalMargin: 12,
                        headingRowColor: MaterialStateProperty.all(AppTheme.stationSand.withOpacity(0.5)),
                        headingTextStyle: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.stationInk,
                        ),
                        columns: const [
                          DataColumn(label: Text('#')),
                          DataColumn(label: Text('Club')),
                          DataColumn(label: Text('P'), numeric: true),
                          DataColumn(label: Text('W'), numeric: true),
                          DataColumn(label: Text('PTS'), numeric: true),
                        ],
                        rows: standings.map((row) {
                          return DataRow(
                            cells: [
                              DataCell(Text('${row['pos']}', style: GoogleFonts.ibmPlexMono(fontSize: 11, fontWeight: FontWeight.bold))),
                              DataCell(Text('${row['team']}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600))),
                              DataCell(Text('${row['played']}', style: GoogleFonts.ibmPlexMono(fontSize: 11))),
                              DataCell(Text('${row['won']}', style: GoogleFonts.ibmPlexMono(fontSize: 11))),
                              DataCell(Text('${row['points']}', style: GoogleFonts.ibmPlexMono(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.accentCommunity))),
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
