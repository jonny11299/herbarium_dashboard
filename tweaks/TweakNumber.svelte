<script>
  let { label, value, min, max, step = 1, unit = '', onChange } = $props();

  function clamp(n) {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  }

  let startRef = { x: 0, val: 0 };

  function onScrubStart(e) {
    e.preventDefault();
    startRef = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    function move(ev) {
      const dx = ev.clientX - startRef.x;
      const raw = startRef.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    }
    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
</script>

<div class="twk-num">
  <span class="twk-num-lbl" onpointerdown={onScrubStart}>{label}</span>
  <input type="number" {value} {min} {max} {step}
         oninput={(e) => onChange(clamp(Number(e.target.value)))} />
  {#if unit}<span class="twk-num-unit">{unit}</span>{/if}
</div>
