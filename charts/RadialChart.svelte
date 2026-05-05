<script>
  import * as d3 from 'd3';
  import { genSeries } from '../lib/chartHelpers.js';

  let { seed = 1, size = 180 } = $props();

  let svgEl;

  $effect(() => {
    if (!svgEl) return;
    const data = genSeries(36, seed, 50, 18).map(v => Math.max(8, v));
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const cx = size / 2, cy = size / 2;
    const inner = size * 0.18, outer = size * 0.46;
    const angle = d3.scaleLinear().domain([0, data.length]).range([0, Math.PI * 2]);
    const r = d3.scaleLinear().domain([0, d3.max(data)]).range([inner, outer]);

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);
    [0.33, 0.66, 1].forEach(t => {
      g.append('circle').attr('r', inner + (outer - inner) * t).attr('class', 'radial-ring');
    });

    const arc = d3.arc().innerRadius(inner).startAngle((d, i) => angle(i)).endAngle((d, i) => angle(i + 1) - 0.02);
    g.selectAll('path.radial-bar').data(data).enter().append('path')
      .attr('class', 'radial-bar')
      .attr('d', (d, i) => arc.outerRadius(r(d))(d, i));

    g.append('circle').attr('r', 1.6).attr('class', 'ann-dot');

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${size} ${size}`} class="radial-chart"
     style:width="{size}px" style:height="{size}px"></svg>
