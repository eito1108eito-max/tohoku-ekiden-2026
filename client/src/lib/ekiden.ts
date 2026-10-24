export interface Team {
  rank: number | null;
  school: string;
  time: string | null;
  is_combined: boolean;
  note: string;
}
export interface Source {
  title: string;
  url: string;
  type: string;
  supports: string;
}
export interface Prefecture {
  id: string;
  prefecture: string;
  event_name: string;
  event_date: string | null;
  venue: string;
  status: 'verified_result' | 'scheduled' | 'held_unpublished' | 'unverified';
  is_partial_result?: boolean;
  distance_km: number | null;
  teams: Team[];
  sources: Source[];
  summary: string;
  caveats: string[];
}
export const statusLabels: Record<Prefecture['status'], string> = {
  verified_result: '結果確認済み',
  scheduled: '未開催',
  held_unpublished: '結果未確認',
  unverified: '日程・結果不明',
};
export function dateLabel(date: string | null) {
  if (!date) return '日程未確認';
  const [year, month, day] = date.split('-');
  return `${year}.${month}.${day}`;
}
export function seconds(time: string | null): number {
  if (!time) return Infinity;
  return time.split(':').reduce((total, value) => total * 60 + Number(value), 0);
}
export function gap(first: string | null, second: string | null): string {
  if (!first || !second) return '—';
  const diff = seconds(second) - seconds(first);
  if (!Number.isFinite(diff)) return '—';
  return `${diff < 0 ? '−' : '+'}${Math.floor(Math.abs(diff) / 60)}:${String(Math.abs(diff) % 60).padStart(2, '0')}`;
}
export function sourceLabel(source: Source) {
  if (/未掲載|未公開|未確認|掲載されていない|確認できない/.test(source.supports)) return '公式掲載先を開く';
  if (/結果|記録|リザルト|成績/.test(source.title)) return '結果・記録を開く';
  if (/要項/.test(source.title)) return '大会要項を開く';
  if (/報道|news|放送|記事/.test(source.type)) return '報道記事を開く';
  return '公式情報・掲載先を開く';
}
export function sourceKind(source: Source): string {
  if (/co-organizer/.test(source.type)) return '主催社報道';
  if (/news|報道|放送|新聞|broadcaster/.test(source.type)) return '報道資料';
  if (/official|公式/.test(source.type)) return '公式資料';
  if (/alumni|OB/.test(source.type + source.title)) return '学校関係資料';
  return '補助結果資料';
}
export const externalUrl = (url: string) => url.replaceAll('(', '%28').replaceAll(')', '%29');
