<script>
  import TweakRow from './TweakRow.svelte';
  let { label, value, min = 0, max = 100, step = 1, unit = '', onChange } = $props();
</script>

<TweakRow {label} value={`${value}${unit}`}>
  {#snippet children()}
    <input type="range" class="twk-slider" {min} {max} {step}
           {value} oninput={(e) => onChange(Number(e.target.value))} />
  {/snippet}
</TweakRow>
