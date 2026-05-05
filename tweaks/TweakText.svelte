<script>
  import TweakRow from './TweakRow.svelte';
  let { label, value, placeholder, onChange } = $props();
</script>

<TweakRow {label}>
  {#snippet children()}
    <input class="twk-field" type="text" {value} {placeholder}
           oninput={(e) => onChange(e.target.value)} />
  {/snippet}
</TweakRow>
