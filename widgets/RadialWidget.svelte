<script>
  import RadialChart from '../charts/RadialChart.svelte';
</script>

<div class="content-chart">
  <div class="chart-meta">
    <div class="cm-row"><span class="cm-key">polar</span><span class="cm-dots"></span><span class="cm-val">36 sectors</span></div>
  </div>
  <div class="radial-wrap">
    <RadialChart seed={13} size={200} />
    <ul class="leaderlist compact">
      <li><span>Σ</span><span class="dots"></span><span>1,247</span></li>
      <li><span>μ</span><span class="dots"></span><span>34.6</span></li>
      <li><span>peak</span><span class="dots"></span><span>θ 11</span></li>
      <li><span>nadir</span><span class="dots"></span><span>θ 27</span></li>
    </ul>
  </div>
</div>
