<script>
  import TendrilSpark from '../charts/TendrilSpark.svelte';

  const tiles = [
    { k: 'α', label: 'lorem ipsum', v: '12.4', d: '+0.31', s: 3 },
    { k: 'β', label: 'consectetur', v: '0.847', d: '−0.04', s: 5 },
    { k: 'γ', label: 'eiusmod', v: '1,204', d: '+12.7', s: 7 },
    { k: 'δ', label: 'incididunt', v: '34.2°', d: '+1.8', s: 9 },
  ];
</script>

<div class="stat-tiles">
  {#each tiles as t}
    <div class="tile">
      <div class="tile-head">
        <span class="tile-k">{t.k}</span>
        <span class="tile-label">{t.label}</span>
      </div>
      <div class="tile-v">{t.v}</div>
      <div class="tile-foot">
        <TendrilSpark seed={t.s} width={56} height={14} />
        <span class="tile-d" class:neg={t.d.startsWith('−')} class:pos={!t.d.startsWith('−')}>{t.d}</span>
      </div>
    </div>
  {/each}
</div>
