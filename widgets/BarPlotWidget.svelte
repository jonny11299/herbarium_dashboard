<script>
  import BarPlot from '../charts/BarPlot.svelte';
  import { LOREM_SHORT } from '../lib/chartHelpers.js';
</script>

<div class="content-chart">
  <div class="chart-meta">
    <div class="cm-row"><span class="cm-key">distribution</span><span class="cm-dots"></span><span class="cm-val">cycles c0–c13</span></div>
  </div>
  <BarPlot seed={5} height={140} />
  <p class="caption">fig. ii — {LOREM_SHORT}</p>
</div>
