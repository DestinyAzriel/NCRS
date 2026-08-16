import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../theme.dart';

class NewsTab extends StatefulWidget {
  const NewsTab({super.key});

  @override
  State<NewsTab> createState() => _NewsTabState();
}

class _NewsTabState extends State<NewsTab> {
  List<dynamic> stories = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  Future<void> _loadNews() async {
    setState(() => loading = true);
    final data = await ApiService.getNews();
    if (mounted) {
      setState(() {
        stories = data;
        loading = false;
      });
    }
  }

  void _openArticleDetail(Map<String, dynamic> story) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        expand: false,
        builder: (_, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppTheme.stationSand,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    story['category'] ?? 'News',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.accentCommunity,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              story['title'] ?? '',
              style: GoogleFonts.fraunces(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppTheme.stationInk,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'By ${story['author']} • Nyanthepa News Desk',
              style: GoogleFonts.inter(fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.stationSand.withOpacity(0.5),
                border: const Border(
                  left: BorderSide(color: AppTheme.accentGold, width: 3),
                ),
              ),
              child: Text(
                story['summary'] ?? '',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.stationInk,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              story['content'] ?? '',
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.stationInk,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _loadNews,
      color: AppTheme.accentLive,
      child: loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.accentLive))
          : stories.isEmpty
              ? const Center(child: Text('No news articles cached.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: stories.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (ctx, i) {
                    final s = stories[i];
                    return InkWell(
                      onTap: () => _openArticleDetail(s),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
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
                                  s['category'] ?? 'District',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.accentCommunity,
                                  ),
                                ),
                                if (s['is_breaking'] == true)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppTheme.accentLive.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      'BREAKING',
                                      style: GoogleFonts.inter(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.accentLive,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              s['title'] ?? '',
                              style: GoogleFonts.fraunces(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.stationInk,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              s['summary'] ?? '',
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
