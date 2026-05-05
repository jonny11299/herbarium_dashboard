<script>
  import TweakRow from './TweakRow.svelte';
  let { label, value, options, onChange } = $props();
</script>

<TweakRow {label}>
  {#snippet children()}
    <select class="twk-field" {value} onchange={(e) => onChange(e.target.value)}>
      {#each options as o}
        {@const v = typeof o === 'object' ? o.value : o}
        {@const l = typeof o === 'object' ? o.label : o}
        <option value={v}>{l}</option>
      {/each}
    </select>
  {/snippet}
</TweakRow>
