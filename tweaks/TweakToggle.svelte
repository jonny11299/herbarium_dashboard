<script>
  let { label, value, onChange } = $props();
</script>

<div class="twk-row twk-row-h">
  <div class="twk-lbl"><span>{label}</span></div>
  <button type="button" class="twk-toggle" data-on={value ? '1' : '0'}
          role="switch" aria-checked={!!value}
          onclick={() => onChange(!value)}><i></i></button>
</div>
