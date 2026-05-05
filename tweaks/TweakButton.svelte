<script>
  let { label, onClick, secondary = false } = $props();
</script>

<button type="button" class="twk-btn" class:secondary onclick={onClick}>{label}</button>
