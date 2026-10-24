import { describe, expect, it } from 'vitest';
import { dateLabel, seconds, gap, externalUrl } from './ekiden';

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
});
