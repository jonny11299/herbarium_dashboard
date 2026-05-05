<script>
  const items = [
    { t: 'ix · 00', label: 'lorem ipsum dolor sit', meta: 'xv min' },
    { t: 'x · 30', label: 'consectetur adipiscing elit', meta: 'xlv min' },
    { t: 'xii · 30', label: 'sed do eiusmod tempor', meta: 'i hr' },
    { t: 'xiv · 00', label: 'incididunt ut labore', meta: 'ii hr' },
    { t: 'xvi · 30', label: 'magna aliqua veniam', meta: 'xxx min' },
    { t: 'xix · 00', label: 'quis nostrud exercitation', meta: 'i.v hr' },
  ];
</script>

<div class="schedule">
  {#each items as e}
    <div class="sched-row">
      <span class="sched-t">{e.t}</span>
      <span class="sched-label">{e.label}</span>
      <span class="sched-dots"></span>
      <span class="sched-meta">{e.meta}</span>
    </div>
  {/each}
</div>
