import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDown, Download, Search, ChevronDown, Check, Clock, CalendarDays, FileText, SlidersHorizontal } from 'lucide-react';
import rawData from '@/data/prefectures.json';
import rules from '@/data/rules.json';
import ContenderComparison from '@/components/ContenderComparison';
import { Prefecture, dateLabel, statusLabels, seconds, externalUrl, sourceLabel, sourceKind, publicAsset } from '@/lib/ekiden';

const prefectures = rawData as Prefecture[];
const checkedAt = '2026.10.24 17時台';
function External({ url, children }: { url: string; children: React.ReactNode }) {
  return <a href={externalUrl(url)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}
function Badge({ status, partial }: { status: Prefecture['status']; partial?: boolean }) {
  return <span className={`status ${status === 'verified_result' ? 'confirmed' : ''}`}>{status === 'verified_result' ? <Check size={12} /> : <Clock size={12} />}{partial ? '一部結果確認' : statusLabels[status]}</span>;
}
export default function Home() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(false);
  const [selected, setSelected] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const confirmed = prefectures.filter(p => p.status === 'verified_result').length;
  const shown = useMemo(() => prefectures.filter(p =>
    (selected === 'all' || selected === p.id) &&
    (filter === 'all' || (filter === 'verified' ? p.status === 'verified_result' : p.status !== 'verified_result')) &&
    (!search || `${p.prefecture} ${p.teams.map(t => t.school).join(' ')}`.includes(search))
  ).sort((a, b) => sort ? seconds(a.teams.find(t => t.rank === 2)?.time ?? null) - seconds(b.teams.find(t => t.rank === 2)?.time ?? null) : 0), [filter, search, sort, selected]);

  return <div className="site-shell">
    <header className="site-header">
      <a href="#top" className="brand"><img src={publicAsset("mark.svg")} alt="" /><span>TOHOKU <b>EKIDEN</b><small>女子高校駅伝リサーチ / 2026</small></span></a>
      <nav aria-label="メインナビゲーション"><a href="#results">県大会結果</a><a href="#contenders">2〜4位を比較</a><a href="#qualification">地区代表枠</a><a href="#sources" className="nav-source">公式資料 <ArrowUpRight size={14} /></a></nav>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-main">
          <div className="eyebrow"><span className="red-line" /> TOHOKU GIRLS EKIDEN 2026</div>
          <h1>もうひとつの、<br /><span>都大路への道。</span></h1>
          <p className="hero-copy">県を越えて、最後の一枠へ。<br />東北6県の女子県予選と地区代表枠を、公式資料から読み解く。</p>
          <a className="primary-button" href="#contenders">2〜4位の一覧を見る <ArrowDown size={17} /></a>
          <div className="hero-meta"><span className="live-dot" /> 確認日 {checkedAt} <span className="divider" /> 女子のみ・2026年度</div>
        </div>
        <aside className="race-panel">
          <div className="race-panel-top"><span>NEXT RACE</span><span>東北大会</span></div>
          <div className="race-date">{rules.date ? rules.date.slice(5).replace('-', '.') : '11月'}<small>2026</small></div>
          <h2>東北高校女子駅伝</h2>
          <div className="race-location"><CalendarDays size={15} />{rules.start || '女子の開始時刻を確認中'}</div>
          <p className="race-location">{rules.venue || '山形県開催・公式要項を確認中'}</p>
          <div className="track-art" aria-hidden="true"><div /><div /><div /><div /><span>TO KYOTO</span></div>
          <div className="race-ticket"><div><span>地区代表枠</span><strong>01</strong></div><p>県代表校を除く<br />東北大会の最上位校へ</p></div>
          <a href="#qualification" className="text-link">選出条件を詳しく <ArrowUpRight size={15} /></a>
        </aside>
      </section>
      <section className="status-strip" aria-label="データの公表状況">
        <div><span>対象エリア</span><strong>6 <small>県</small></strong></div>
        <div><span>結果確認（部分含む）</span><strong>{confirmed} <small>/ 6県</small></strong></div>
        <div><span>未開催・結果待ち等</span><strong>{6 - confirmed} <small>県</small></strong></div>
        <p><FileText size={20} /><span>未開催・未確認の結果は推測せず、<br />過年度の記録とは分けて掲載しています。</span></p>
      </section>
      <section id="results" className="content-section results-section">
        <div className="section-heading"><div><div className="eyebrow">01 / PREFECTURAL RESULTS</div><h2>県大会の現在地</h2><p>優勝校は県代表として区別。県を開くと3・4位を含む確認済み順位を表示します。</p></div><a href={publicAsset("prefectures.json")} download="tohoku-2026-girls.json" className="outline-button"><Download size={15} /> データ保存</a></div>
        <div className="table-toolbar"><div className="filter-tabs" aria-label="開催状況で絞り込み">{[['all','すべて'],['verified','結果確認済み'],['waiting','未開催・結果待ち等']].map(([value,label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</button>)}</div><div className="table-tools"><label className="search-field"><Search size={16} /><input aria-label="県名・高校名を検索" value={search} onChange={e => setSearch(e.target.value)} placeholder="県名・高校名を検索" /></label><label className="prefecture-select"><SlidersHorizontal size={15} /><select aria-label="県を選択" value={selected} onChange={e => setSelected(e.target.value)}><option value="all">全6県</option>{prefectures.map(p => <option key={p.id} value={p.id}>{p.prefecture}</option>)}</select></label></div></div>
        <div className="results-table" role="table" aria-label="東北6県の県大会優勝校と2位校"><div className="table-head" role="row"><span role="columnheader">県 / 開催日</span><span role="columnheader">1位 · 県代表</span><span role="columnheader">2位 · 比較対象例 <button className={sort ? 'sort active' : 'sort'} aria-label="2位校のタイム順に並べ替え" aria-pressed={sort} onClick={() => setSort(!sort)}><ArrowDown size={14}/></button></span><span role="columnheader">確認状況</span><span role="columnheader">詳細</span></div>
          {shown.map(p => { const first = p.teams.find(t => t.rank === 1); const second = p.teams.find(t => t.rank === 2); const expanded = open === p.id; return <div key={p.id} className={`prefecture-block ${expanded ? 'expanded' : ''}`}>
            <button className="result-row" aria-expanded={expanded} aria-controls={`details-${p.id}`} onClick={() => setOpen(expanded ? null : p.id)}><span className="pref-name"><b>{p.prefecture}</b><small>{dateLabel(p.event_date)}</small><span className="mobile-status"><Badge status={p.status} partial={p.is_partial_result}/></span></span><span className="school-cell"><b>{first?.school || '—'}</b><small className="time">{first?.time || (p.status === 'scheduled' ? '開催後に確定' : '結果未確認')}</small></span><span className="school-cell runner-up"><b>{second?.school || '—'}</b><small className="time">{second?.time || (p.status === 'scheduled' ? '開催後に確定' : '結果未確認')}</small></span><span><Badge status={p.status} partial={p.is_partial_result}/></span><ChevronDown size={18} className={expanded ? 'chevron up' : 'chevron'} /></button>
            {expanded && <div id={`details-${p.id}`} className="prefecture-detail"><div className="detail-info"><h3>{p.event_name}</h3><p>{p.venue}{p.distance_km ? ` / 女子 ${p.distance_km}km` : ''}</p><p>{p.summary}</p><small>確認日 {checkedAt} · 2026年度</small></div>{p.teams.length > 0 && <div className="full-ranking"><div className="full-ranking-head"><span>順位</span><span>高校名</span><span>総合記録</span></div>{p.teams.map((t,index) => <div key={`${t.school}-${index}`}><span>{t.rank ?? 'OP'}</span><span>{t.school}{t.is_combined && <small> 合同</small>}{t.note && <small className="team-note">{t.note}</small>}</span><span className="time">{t.time ?? '記録未確認'}</span></div>)}</div>}<div className="detail-sources">{p.sources.map((s,i) => <External key={i} url={s.url}>{sourceLabel(s)}<small>{s.title} / {sourceKind(s)}</small></External>)}</div>{p.caveats.length > 0 && <div className="detail-caveat">{p.caveats.map((c,i) => <p key={i}>{c}</p>)}</div>}</div>}
          </div>; })}
          {!shown.length && <div className="no-results"><Search size={24}/><h3>該当する県・高校がありません</h3><p>検索語や確認状況の絞り込みを変更してください。</p><button onClick={() => { setSearch(''); setFilter('all'); setSelected('all'); }}>絞り込みを解除</button></div>}
        </div>
        <p className="table-note">「一部結果確認」は順位・記録の一部のみ確認できた県です。「結果未確認」は開催済み・開催当日でも、今回の調査で2026年女子の結果本文を確認できていない状態です。未公表と断定するものではありません。</p>
      </section>
      <ContenderComparison />
      <section id="qualification" className="qualification-section"><div className="qualification-intro"><div className="eyebrow">03 / ROAD TO MIYAKOOJI</div><h2>「特別枠」の<br />獲得条件は？</h2><p>正式には全国大会の「地区代表枠」。<br />争うのは、県大会2位校だけではありません。</p><a href={publicAsset("report.md")} download="tohoku-2026-report.md" className="outline-button"><Download size={15}/> 解説レポートを保存</a></div><div className="qualification-body"><div className="rule-item"><span>01</span><div><h3>県大会優勝校は、県代表として全国へ</h3><p>県大会で出場権を得た高校は、東北大会の地区代表選出対象から除かれます。県優勝校が全国出場を辞退した場合は次位校が県代表となるため、除外対象は実際の県代表校です。</p></div></div><div className="rule-item"><span>02</span><div><h3>残る対象校の、東北大会最上位に一枠</h3><p>{rules.condition}</p></div></div><div className="rule-item"><span>03</span><div><h3>2位校以外の出場校も対象に</h3><p>{rules.eligibility || '東北大会の参加資格は、2026年の公式要項で確認してください。'} 上の表は県2〜4位の参考記録順です。追加枠の出場校や全国選考資格は、最終出場名簿と主催者の発表で確認してください。</p></div></div><div className="rule-footer"><span>全国大会 {dateLabel(rules.nationalDate)} 女子10:20</span><span>京都・都大路</span></div></div></section>
      <section id="sources" className="content-section sources-section"><div className="section-heading"><div><div className="eyebrow">04 / VERIFIED SOURCES</div><h2>記録の先に、公式資料を。</h2><p>結果、日程、選出条件。公式資料と補助的な報道・結果サイトを区別して、出典へつなぎます。</p></div></div><div className="source-directory"><div><h3>東北大会・全国大会</h3>{rules.sources.map((s: {title: string; url: string},i) => <External key={i} url={s.url}>{s.title}</External>)}</div><div><h3>県大会の資料・結果掲載先</h3>{prefectures.map(p => <div className="county-source" key={p.id}><span>{p.prefecture}</span><div>{p.sources.map((s,i) => <External key={i} url={s.url}>{s.title}<small>{sourceKind(s)}</small></External>)}</div></div>)}</div></div><div className="update-note"><FileText size={21}/><div><h3>このサイトは、{checkedAt} 時点の調査版です。</h3><p>公式陸協・高体連の資料を優先し、本文で年度と女子の結果を確認して掲載しています。未確認の結果は空欄とし、日程・結果掲載先を案内しています。今後の確定結果は、各県の公式リンクで確認してください。このサイトは自動更新ではありません。</p></div></div></section>
    </main>
    <footer className="site-footer"><a href="#top" className="footer-brand">TOHOKU EKIDEN <span>2026</span></a><p>女子高校駅伝 / 独立リサーチサイト<br /><small>大会主催者の公式サイトではありません。調査・制作：Manus AI</small></p><a href="#top">ページ上部へ ↑</a></footer>
  </div>;
}
