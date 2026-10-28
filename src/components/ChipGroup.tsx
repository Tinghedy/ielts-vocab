interface Props<K extends string | number> {
  label: string;
  options: { key: K; label: string; hint?: string }[];
  value: K[];
  onChange: (v: K[]) => void;
}

/** 多選 chips；全部不選視同全選 */
export function ChipGroup<K extends string | number>({ label, options, value, onChange }: Props<K>) {
  const toggle = (k: K) => onChange(value.includes(k) ? value.filter((v) => v !== k) : [...value, k]);
  return (
    <fieldset className="chip-group">
      <legend>
        {label}
        {value.length > 0 && (
          <button type="button" className="link-btn" onClick={() => onChange([])}>
            清除
          </button>
        )}
      </legend>
      <div className="chips">
        {options.map((o) => (
          <button
            type="button"
            key={o.key}
            className="chip"
            aria-pressed={value.includes(o.key)}
            onClick={() => toggle(o.key)}
          >
            {o.label}
            {o.hint && <span className="chip-hint">{o.hint}</span>}
          </button>
        ))}
      </div>
      {value.length === 0 && <p className="muted small">未選＝全部</p>}
    </fieldset>
  );
}
