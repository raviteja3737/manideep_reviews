"use client";

export default function WritingScale({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
      <div className="min-w-0 max-w-full flex-1 sm:max-w-[22rem]">
        <input
          id="writing-scale"
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="writing-slider"
          aria-describedby="writing-scale-endpoints"
        />
        <div
          id="writing-scale-endpoints"
          className="mt-1 flex justify-between text-xs text-ink/70 sm:max-w-[22rem]"
          aria-hidden="true"
        >
          <span className="tabular-nums">1</span>
          <span className="tabular-nums">10</span>
        </div>
      </div>
      <output
        htmlFor="writing-scale"
        className="font-display text-2xl font-medium tabular-nums text-ink sm:min-w-[5.5rem] sm:text-right"
      >
        {value} / 10
      </output>
    </div>
  );
}
