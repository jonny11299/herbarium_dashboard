<script>
  import ContourChart from '../charts/ContourChart.svelte';
  import { LOREM_SHORT } from '../lib/chartHelpers.js';
</script>

<div class="content-chart">
  <div class="chart-meta">
    <div class="cm-row"><span class="cm-key">density</span><span class="cm-dots"></span><span class="cm-val">3 clusters · n=240</span></div>
  </div>
  <ContourChart seed={23} height={160} />
  <p class="caption">fig. iv — {LOREM_SHORT}</p>
</div>
