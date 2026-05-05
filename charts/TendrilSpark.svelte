<script>
  import * as d3 from 'd3';
  import { genSeries } from '../lib/chartHelpers.js';

  let { seed = 1, width = 80, height = 18 } = $props();

  let svgEl;

  $effect(() => {
    if (!svgEl) return;
    const data = genSeries(24, seed, 50, 14);
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data)).range([height - 1, 1]);
    const line = d3.line().curve(d3.curveCatmullRom).x((d, i) => x(i)).y(d => y(d));
    svg.append('path').datum(data).attr('class', 'spark-line').attr('d', line);

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} width={width} height={height} class="spark"></svg>
