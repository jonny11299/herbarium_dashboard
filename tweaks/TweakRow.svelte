<script>
  let { label, value = null, inline = false, children } = $props();
</script>

<div class="twk-row" class:twk-row-h={inline}>
  <div class="twk-lbl">
    <span>{label}</span>
    {#if value != null}<span class="twk-val">{value}</span>{/if}
  </div>
  {@render children()}
</div>
