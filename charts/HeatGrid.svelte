<script>
  import * as d3 from 'd3';
  import { srand } from '../lib/chartHelpers.js';

  let { cols = 26, rows = 7, seed = 9, height = 90 } = $props();

  let svgEl;

  $effect(() => {
    if (!svgEl) return;
    const r = srand(seed);
    const data = d3.range(cols * rows).map(() => {
      const v = r();
      return v < 0.4 ? 0 : v < 0.65 ? 1 : v < 0.85 ? 2 : v < 0.96 ? 3 : 4;
    });

    const w = cols * 14;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const cw = w / cols, ch = height / rows;
    svg.append('g').selectAll('rect').data(data).enter().append('rect')
      .attr('x', (d, i) => (i % cols) * cw + 1)
      .attr('y', (d, i) => Math.floor(i / cols) * ch + 1)
      .attr('width', cw - 2).attr('height', ch - 2)
      .attr('class', d => `hg-rect hg-${d}`);

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${cols * 14} ${height}`} preserveAspectRatio="none"
     class="hairline-chart" style:height="{height}px"></svg>
