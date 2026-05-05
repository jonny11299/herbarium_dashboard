<script>
  import * as d3 from 'd3';
  import { genSeries } from '../lib/chartHelpers.js';

  let { seed = 3, height = 130 } = $props();

  let svgEl;
  const w = 600;
  const m = { t: 8, r: 14, b: 18, l: 28 };

  $effect(() => {
    if (!svgEl) return;
    const h = height;
    const data = genSeries(14, seed, 60, 30).map(v => Math.max(8, v));
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const x = d3.scaleBand().domain(data.map((_, i) => i)).range([m.l, w - m.r]).padding(0.3);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([h - m.b, m.t]);

    svg.append('g').attr('class', 'axis-g').attr('transform', `translate(0,${h - m.b})`)
      .call(d3.axisBottom(x).tickSize(3).tickFormat(d => `c${d}`));
    svg.append('g').attr('class', 'axis-g').attr('transform', `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(3));

    svg.append('g').selectAll('rect').data(data).enter().append('rect')
      .attr('x', (d, i) => x(i)).attr('y', d => y(d))
      .attr('width', x.bandwidth()).attr('height', d => h - m.b - y(d))
      .attr('class', 'chart-bar');

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
     class="hairline-chart" style:height="{height}px"></svg>
