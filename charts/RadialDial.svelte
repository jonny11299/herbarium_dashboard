<script>
  import * as d3 from 'd3';
  import { srand } from '../lib/chartHelpers.js';

  let { seed = 1, label = 'α' } = $props();

  let svgEl;
  const size = 90;

  $effect(() => {
    if (!svgEl) return;
    const pct = 0.2 + srand(seed)() * 0.7;
    const cx = size / 2, cy = size / 2 + 5, rad = size * 0.36;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const arc = d3.arc().innerRadius(rad - 3).outerRadius(rad).startAngle(-Math.PI * 0.7);
    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);
    g.append('path').attr('class', 'dial-track').attr('d', arc.endAngle(Math.PI * 0.7));
    g.append('path').attr('class', 'dial-fill').attr('d', arc.endAngle(-Math.PI * 0.7 + Math.PI * 1.4 * pct));
    g.append('text').attr('class', 'dial-num').attr('y', 4).attr('text-anchor', 'middle').text(Math.round(pct * 100));
    g.append('text').attr('class', 'dial-cap').attr('y', 22).attr('text-anchor', 'middle').text(label);

    return () => svg.selectAll('*').remove();
  });
</script>

<svg bind:this={svgEl} viewBox={`0 0 ${size} ${size}`} class="dial-svg"
     style:width="{size}px" style:height="{size}px"></svg>
