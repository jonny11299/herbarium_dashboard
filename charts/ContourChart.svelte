<script>
  import * as d3 from 'd3';
  import { srand } from '../lib/chartHelpers.js';

  let { seed = 1, height = 160 } = $props();

  let svgEl;
  const w = 600;

  $effect(() => {
    if (!svgEl) return;
    const h = height;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const r = srand(seed);
    const points = [];
    for (let c = 0; c < 3; c++) {
      const cx = w * (0.2 + r() * 0.6), cy = h * (0.2 + r() * 0.6);
      for (let i = 0; i < 80; i++) {
        const ang = r() * Math.PI * 2;
        const rad = Math.abs((r() - 0.5) * 60);
        points.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad]);
      }
    }

    const contours = d3.contourDensity()
      .x(d => d[0]).y(d => d[1])
      .size([w, h]).bandwidth(18).thresholds(8)(points);
    svg.append('g').selectAll('path').data(contours).enter().append('path')
      .attr('class', 'contour').attr('d', d3.geoPath());
    svg.append('g').selectAll('circle').data(points).enter().append('circle')
      .attr('cx', d => d[0]).attr('cy', d => d[1]).attr('r', 0.7).attr('class', 'scatter-dot');

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
     class="hairline-chart" style:height="{height}px"></svg>
