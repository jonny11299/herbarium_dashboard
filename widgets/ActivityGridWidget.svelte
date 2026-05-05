<script>
  import HeatGrid from '../charts/HeatGrid.svelte';
</script>

<div class="content-chart">
  <div class="chart-meta">
    <div class="cm-row"><span class="cm-key">cycles</span><span class="cm-dots"></span><span class="cm-val">26 wk × 7</span></div>
    <div class="cm-row"><span class="cm-key">total</span><span class="cm-dots"></span><span class="cm-val">847 events</span></div>
  </div>
  <HeatGrid cols={26} rows={7} seed={11} height={90} />
  <div class="legend-row">
    <span>nil</span>
    <span class="legend-cell hg-0"></span>
    <span class="legend-cell hg-1"></span>
    <span class="legend-cell hg-2"></span>
    <span class="legend-cell hg-3"></span>
    <span class="legend-cell hg-4"></span>
    <span>peak</span>
  </div>
</div>
