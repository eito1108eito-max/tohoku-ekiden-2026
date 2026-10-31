import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Download, Search } from 'lucide-react';
import comparison from '@/data/comparison.json';
import { externalUrl, publicAsset } from '@/lib/ekiden';

const downloadUrl = (name: string) => `${publicAsset(name)}?v=${comparison.checked_at.replace(/\D/g, '')}`;
const pending: Array<{ prefecture: string; event_date: string; note: string }> = comparison.pending;

function diff(value: number) {
  return value === 0 ? '—' : `+${Math.floor(value / 60)}分${String(value % 60).padStart(2, '0')}秒`;
}

export default function ContenderComparison() {
  const [prefecture, setPrefecture] = useState('all');
  const [rank, setRank] = useState('all');
  const [query, setQuery] = useState('');
  const rows = useMemo(() => comparison.ranked.filter(row =>
    (prefecture === 'all' || row.prefecture === prefecture) &&
    (rank === 'all' || String(row.prefecture_rank) === rank) &&
    (!query || `${row.prefecture} ${row.school}`.includes(query))
  ), [prefecture, rank, query]);
  const prefectures = ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'];

  return <section id="contenders" className="content-section contender-section">
    <div className="section-heading">
      <div><div className="eyebrow">02 / ALL CONTENDERS</div><h2>県2〜4位を、タイム順で。</h2><p>県1位を除き、確認できた記録を速い順に表示。東北大会の予想順位ではありません。</p></div>
      <span className="reference-tag">参考タイム順 / {comparison.ranked.length}校</span>
    </div>
    <div className="comparison-downloads">
      <a className="outline-button" href={downloadUrl('comparison.xlsx')} download><Download size={15}/> Excelで一覧を見る</a>
      <a className="outline-button" href={downloadUrl('comparison.txt')} download><Download size={15}/> テキスト保存</a>
      <a className="outline-button" href={downloadUrl('comparison.csv')} download><Download size={15}/> CSV保存</a>
      <small>更新：{comparison.checked_at} / 公式結果と補助資料を区別</small>
    </div>
    <div className="table-toolbar comparison-toolbar">
      <div className="filter-tabs" aria-label="県内順位で比較対象を絞り込み">
        {[['all','2〜4位すべて'],['2','県2位'],['3','県3位'],['4','県4位']].map(([value,label]) => <button key={value} className={rank === value ? 'active' : ''} onClick={() => setRank(value)} aria-pressed={rank === value}>{label}</button>)}
      </div>
      <div className="table-tools">
        <label className="search-field"><Search size={16}/><input aria-label="比較表の高校名・県名を検索" value={query} onChange={event => setQuery(event.target.value)} placeholder="高校名・県名を検索"/></label>
        <label className="prefecture-select">県<select aria-label="比較表の県を選択" value={prefecture} onChange={event => setPrefecture(event.target.value)}><option value="all">全6県</option>{prefectures.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
    </div>
    <div className="comparison-scroll" tabIndex={0} aria-label="県2〜4位の参考タイム順。横にスクロールできます。">
      <table className="contender-table"><caption className="sr-only">確認済み県2〜4位校の参考タイム順</caption>
        <thead><tr><th scope="col">参考順</th><th scope="col">県</th><th scope="col">高校名</th><th scope="col">県内順位</th><th scope="col">総合タイム</th><th scope="col">先頭との差</th><th scope="col">確認資料</th></tr></thead>
        <tbody>{rows.map(row => <tr key={`${row.prefecture_id}-${row.prefecture_rank}`}>
          <td className="reference-number">{row.reference_rank}</td><td>{row.prefecture}</td><th scope="row">{row.school}</th>
          <td><span className={`county-rank rank-${row.prefecture_rank}`}>{row.prefecture_rank}位</span></td>
          <td className="japanese-time">{row.time_jp}</td><td className="difference-cell">{diff(row.leader_gap_seconds)}</td>
          <td><a className="evidence-link" href={externalUrl(row.source_url)} target="_blank" rel="noopener noreferrer">{row.evidence_level}<ArrowUpRight size={13}/></a></td>
        </tr>)}</tbody>
      </table>
      {rows.length === 0 && <div className="no-results"><p>この条件で記録確認済みの高校はありません。検索条件を変更してください。記録未確認校がある場合は下に別記しています。</p><button onClick={() => { setPrefecture('all'); setRank('all'); setQuery(''); }}>全校を表示</button></div>}
    </div>
    <p className="table-note">絞り込んだ場合も「参考順」は全確認校の中での番号を維持します。県ごとのコース・気象・レース展開が違うため、同じ条件で競った順位ではありません。</p>
    {comparison.rank_exclusions.length > 0 && <div className="comparison-pending">
      <h3>「正式順位なし」と「記録未確認」を区別します。</h3>
      {comparison.rank_exclusions.map(row => <p key={row.prefecture}><b>{row.prefecture}</b>　{row.note} <a className="evidence-link" href={externalUrl(row.source_url)} target="_blank" rel="noopener noreferrer">公式結果を確認<ArrowUpRight size={13}/></a></p>)}
    </div>}
    {(comparison.unranked.length > 0 || pending.length > 0) && <div className="comparison-pending">
      <h3>参考順に入れていない、未確認情報</h3>
      {comparison.unranked.map(row => <p key={row.school}><b>{row.prefecture} {row.school} / 県{row.prefecture_rank}位</b>　学校名・順位は確認済み。タイムは未確認のため、ゼロや前年値で補いません。</p>)}
      {pending.map(row => <p key={row.prefecture}><b>{row.prefecture}</b>　{row.event_date.replaceAll('-', '.')}開催予定。2〜4位の学校名・タイムは未確定。</p>)}
    </div>}
    <div className="additional-slots">
      <h3>山形の追加1枠は、通常の2〜4位と分けて見る。</h3>
      <p>公式要項10⑻は開催県からの「オープン参加」1チームを認めています。山形の通常上位4枠に加わるOP枠と、県予選参加数15チーム以上の場合の1枠追加は別の規定です。実際のOP出場校・全国選考資格は、主催者の正式発表前に確定扱いしていません。</p>
      <div className="comparison-scroll"><table className="extra-table"><thead><tr><th>追加枠の参考</th><th>高校名</th><th>県内順位</th><th>総合タイム</th><th>扱い</th></tr></thead><tbody>{comparison.additional_reference.map(row => <tr key={row.prefecture}><td>{row.prefecture}</td><td>{row.school}</td><td>5位</td><td className="japanese-time">{row.time_jp}</td><td>{row.note}</td></tr>)}</tbody></table></div>
    </div>
    <div className="comparison-analysis"><h3>3位・4位を含めると、どう見えるか。</h3>{comparison.analysis.map((text,index) => <p key={index}>{text}</p>)}<a href={downloadUrl('report.md')} download>出典付きの考察を保存 <ArrowUpRight size={14}/></a></div>
  </section>;
}
