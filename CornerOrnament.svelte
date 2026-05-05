<svg viewBox="0 0 80 80">
  {#each { length: 10 } as _, i}
    {@const r = 22 + i * 7}
    <path d={`M0,0 Q ${r * 0.4},${r * 0.1} ${r},${r * 0.7}`} />
  {/each}
  {#each { length: 10 } as _, i}
    {@const r = 22 + i * 7}
    <path d={`M0,0 Q ${r * 0.1},${r * 0.4} ${r * 0.7},${r}`} />
  {/each}
  {#each [20, 35, 50, 65, 80] as r}
    <circle cx="0" cy="0" r={r} stroke-dasharray="1 4" />
  {/each}
</svg>
