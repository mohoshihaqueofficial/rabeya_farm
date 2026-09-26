import { bnNumber } from "@/data/cattle";

type DualRangeProps = {
  min: number;
  max: number;
  step: number;
  lower: number;
  upper: number;
  label: string;
  onChange: (lower: number, upper: number) => void;
};

export default function DualRange({ min, max, step, lower, upper, label, onChange }: DualRangeProps) {
  const low = Math.max(min, Math.min(max, lower));
  const high = Math.max(min, Math.min(max, upper));
  const start = ((low - min) / (max - min)) * 100;
  const end = ((high - min) / (max - min)) * 100;

  return <div className="dual-range">
    <div className="dual-range-track" aria-hidden="true"><span style={{ left: `${start}%`, right: `${100 - Math.max(start, end)}%` }} /></div>
    <input type="range" className="dual-range-input" min={min} max={max} step={step} value={low} aria-label={`ন্যূনতম ${label}`} aria-valuetext={bnNumber(low)} style={{ zIndex: start > 90 ? 3 : 1 }} onChange={event => onChange(Math.min(Number(event.target.value), high), high)} />
    <input type="range" className="dual-range-input" min={min} max={max} step={step} value={high} aria-label={`সর্বোচ্চ ${label}`} aria-valuetext={bnNumber(high)} style={{ zIndex: 2 }} onChange={event => onChange(low, Math.max(Number(event.target.value), low))} />
  </div>;
}
