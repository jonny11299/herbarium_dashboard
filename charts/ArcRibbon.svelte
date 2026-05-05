<script>
  import * as d3 from 'd3';
  import { srand } from '../lib/chartHelpers.js';

  let { seed = 1, height = 140 } = $props();

  let svgEl;
  const w = 600;

  $effect(() => {
    if (!svgEl) return;
    const h = height;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const r = srand(seed);
    const N = 14;
    const pts = d3.range(N).map(i => ({ x: (i + 0.5) * (w / N), label: String.fromCharCode(97 + i) }));

    svg.append('line').attr('x1', 14).attr('y1', h - 14).attr('x2', w - 14).attr('y2', h - 14).attr('class', 'axis');

    for (let i = 0; i < 18; i++) {
      const a = Math.floor(r() * N), b = Math.floor(r() * N);
      if (a === b) continue;
      const x1 = pts[a].x, x2 = pts[b].x;
      const cx = (x1 + x2) / 2;
      const rad = Math.abs(x2 - x1) / 2;
      svg.append('path').attr('class', 'arc-ribbon')
        .attr('d', `M${x1},${h - 14} A${rad},${rad} 0 0 1 ${x2},${h - 14}`)
        .attr('opacity', 0.3 + r() * 0.5);
    }

    svg.append('g').selectAll('circle').data(pts).enter().append('circle')
      .attr('cx', d => d.x).attr('cy', h - 14).attr('r', 1.6).attr('class', 'ann-dot');
    svg.append('g').selectAll('text').data(pts).enter().append('text')
      .attr('x', d => d.x).attr('y', h - 4).attr('class', 'ann-label').attr('text-anchor', 'middle').text(d => d.label);

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
     class="hairline-chart" style:height="{height}px"></svg>
