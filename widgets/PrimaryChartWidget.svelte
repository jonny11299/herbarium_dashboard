<script>
  import AreaChart from '../charts/AreaChart.svelte';
  import { LOREM_SHORT } from '../lib/chartHelpers.js';
</script>

<div class="content-chart">
  <div class="chart-meta">
    <div class="cm-row"><span class="cm-key">subject</span><span class="cm-dots"></span><span class="cm-val">specimen 0xa42 · ser. xvii</span></div>
    <div class="cm-row"><span class="cm-key">interval</span><span class="cm-dots"></span><span class="cm-val">last lx cycles</span></div>
    <div class="cm-row"><span class="cm-key">σ</span><span class="cm-dots"></span><span class="cm-val">0.0184</span></div>
  </div>
  <AreaChart seed={17} height={170} />
  <p class="caption">fig. i — {LOREM_SHORT}</p>
</div>
