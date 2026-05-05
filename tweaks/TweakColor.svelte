<script>
  let { label, value, onChange } = $props();
</script>

<div class="twk-row twk-row-h">
  <div class="twk-lbl"><span>{label}</span></div>
  <input type="color" class="twk-swatch" {value} oninput={(e) => onChange(e.target.value)} />
</div>
