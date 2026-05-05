<script>
  import RadialDial from '../charts/RadialDial.svelte';
  import { LOREM_SHORT } from '../lib/chartHelpers.js';
</script>

<div class="content-chart">
  <div class="dials">
    <RadialDial seed={2} label="α" />
    <RadialDial seed={4} label="β" />
    <RadialDial seed={6} label="γ" />
    <RadialDial seed={8} label="δ" />
  </div>
  <p class="caption">fig. iii — {LOREM_SHORT}</p>
</div>
