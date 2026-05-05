<script>
  import * as d3 from 'd3';
  import { genSeries } from '../lib/chartHelpers.js';

  let { seed = 1, height = 160 } = $props();

  let svgEl;
  const w = 600;
  const m = { t: 18, r: 14, b: 18, l: 28 };

  $effect(() => {
    if (!svgEl) return;
    const h = height;
    const data = genSeries(80, seed, 100, 6);
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([m.l, w - m.r]);
    const y = d3.scaleLinear().domain(d3.extent(data)).nice().range([h - m.b, m.t]);

    svg.append('g').attr('class', 'axis-g').attr('transform', `translate(0,${h - m.b})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(3).tickFormat(d => `t${d}`));
    svg.append('g').attr('class', 'axis-g').attr('transform', `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(3).tickFormat(d => d.toFixed(0)));

    const area = d3.area().curve(d3.curveCatmullRom)
      .x((d, i) => x(i)).y0(h - m.b).y1(d => y(d));
    svg.append('path').datum(data).attr('class', 'chart-fill').attr('d', area);

    const line = d3.line().curve(d3.curveCatmullRom).x((d, i) => x(i)).y(d => y(d));
    svg.append('path').datum(data).attr('class', 'chart-line').attr('d', line);

    const peaks = [...data.map((d, i) => [d, i])]
      .sort((a, b) => b[0] - a[0]).slice(0, 3)
      .sort((a, b) => a[1] - b[1]);
    peaks.forEach(([v, i], idx) => {
      const cx = x(i), cy = y(v);
      const g = svg.append('g').attr('class', 'annotation');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 1.8).attr('class', 'ann-dot');
      g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', cx).attr('y2', m.t - 4).attr('class', 'ann-leader');
      g.append('text').attr('x', cx + 3).attr('y', m.t - 6).attr('class', 'ann-label')
        .text(`${String.fromCharCode(0x03b1 + idx)} ${v.toFixed(2)}`);
    });

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
     class="hairline-chart" style:height="{height}px"></svg>
