<script>
  import TweakRow from './TweakRow.svelte';

  let { label, value, options, onChange } = $props();

  const opts = $derived(options.map(o => typeof o === 'object' ? o : { value: o, label: o }));
  const idx = $derived(Math.max(0, opts.findIndex(o => o.value === value)));
  const n = $derived(opts.length);

  let trackEl;
  let dragging = $state(false);
  let currentValue = $derived(value);

  function segAt(clientX) {
    const r = trackEl.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  }

  function onPointerDown(e) {
    dragging = true;
    const v0 = segAt(e.clientX);
    if (v0 !== currentValue) onChange(v0);

    function move(ev) {
      if (!trackEl) return;
      const v = segAt(ev.clientX);
      if (v !== currentValue) onChange(v);
    }
    function up() {
      dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
</script>

<TweakRow {label}>
  {#snippet children()}
    <div bind:this={trackEl} role="radiogroup" onpointerdown={onPointerDown}
         class="twk-seg" class:dragging>
      <div class="twk-seg-thumb"
           style:left="calc(2px + {idx} * (100% - 4px) / {n})"
           style:width="calc((100% - 4px) / {n})"></div>
      {#each opts as o}
        <button type="button" role="radio" aria-checked={o.value === value}>{o.label}</button>
      {/each}
    </div>
  {/snippet}
</TweakRow>
