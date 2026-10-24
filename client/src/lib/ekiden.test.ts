import { describe, expect, it } from 'vitest';
import { dateLabel, seconds, gap, externalUrl } from './ekiden';
import comparison from '../data/comparison.json';

describe('県大会記録の表示と比較', () => {
  it('時分秒を数値で比較する', () => {
    expect(seconds('01:10:15')).toBe(4215);
    expect(seconds('01:09:59')).toBeLessThan(seconds('01:10:00'));
    expect(seconds(null)).toBe(Infinity);
  });
  it('未確認タイムを差に変換しない', () => {
    expect(gap(null, '01:10:00')).toBe('—');
    expect(gap('01:09:00', '01:10:15')).toBe('+1:15');
  });
  it('日程とリンクを正しく整える', () => {
    expect(dateLabel('2026-11-14')).toBe('2026.11.14');
    expect(dateLabel(null)).toBe('日程未確認');
    expect(externalUrl('https://example.com/results(2026).pdf')).toBe('https://example.com/results%282026%29.pdf');
  });
  it('県2〜4位の確認済み記録だけを、数値のタイム順で比較する', () => {
    expect(comparison.ranked.every(row => row.prefecture_rank >= 2 && row.prefecture_rank <= 4 && row.time !== null)).toBe(true);
    expect(comparison.ranked.some(row => row.prefecture_rank === 3)).toBe(true);
    expect(comparison.ranked.some(row => row.prefecture_rank === 4)).toBe(true);
    comparison.ranked.forEach((row, index) => {
      expect(row.reference_rank).toBe(index + 1);
      if (index > 0) expect(row.seconds).toBeGreaterThanOrEqual(comparison.ranked[index - 1].seconds);
    });
  });
  it('県4位の古川学園と県2位の秋田北鷹の参考記録差を1秒とする', () => {
    const furukawa = comparison.ranked.find(row => row.school === '古川学園');
    const hokuyo = comparison.ranked.find(row => row.school === '秋田北鷹');
    expect(furukawa?.prefecture_rank).toBe(4);
    expect(hokuyo?.prefecture_rank).toBe(2);
    expect(Math.abs(seconds(furukawa?.time ?? null) - seconds(hokuyo?.time ?? null))).toBe(1);
  });
  it('記録未確認校と追加枠参考を本体の順位から分離する', () => {
    expect(comparison.unranked.every(row => row.time === null)).toBe(true);
    expect(comparison.additional_reference.every(row => row.prefecture_rank === 5)).toBe(true);
    expect(comparison.ranked.some(row => row.school === '明桜')).toBe(false);
  });
});
