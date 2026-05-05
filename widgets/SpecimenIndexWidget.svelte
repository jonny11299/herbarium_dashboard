<script>
  import TendrilSpark from '../charts/TendrilSpark.svelte';

  const rows = [
    { code: 'a · 0142', name: 'lorem ipsum dolor', val: '+0.84', s: 1 },
    { code: 'a · 0148', name: 'consectetur adipiscing', val: '−0.12', s: 2 },
    { code: 'a · 0151', name: 'sed do eiusmod tempor', val: '+1.27', s: 3 },
    { code: 'a · 0163', name: 'incididunt ut labore', val: '+0.31', s: 4 },
    { code: 'b · 0204', name: 'magna aliqua veniam', val: '−0.55', s: 5 },
    { code: 'b · 0211', name: 'quis nostrud exercitation', val: '+0.09', s: 6 },
    { code: 'c · 0309', name: 'ullamco laboris nisi', val: '+2.04', s: 7 },
    { code: 'c · 0314', name: 'aliquip ex ea commodo', val: '−0.38', s: 8 },
  ];
</script>

<div class="specimen-list">
  <div class="sl-head"><span>code</span><span>specimen</span><span>trend</span><span>Δ</span></div>
  {#each rows as r}
    <div class="sl-row">
      <span class="sl-code">{r.code}</span>
      <span class="sl-name">{r.name}</span>
      <TendrilSpark seed={r.s} width={70} height={16} />
      <span class="sl-val" class:neg={r.val.startsWith('−')} class:pos={!r.val.startsWith('−')}>{r.val}</span>
    </div>
  {/each}
</div>
