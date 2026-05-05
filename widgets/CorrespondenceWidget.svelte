<script>
  const items = [
    { from: 'a. linnaeus', subj: 're: lorem ipsum dolor sit amet', age: 'viii m' },
    { from: 'c. darwin', subj: 'consectetur adipiscing elit, sed', age: 'xxii m' },
    { from: 'r. carson', subj: 'eiusmod tempor incididunt', age: 'i hr' },
    { from: 'm. mead', subj: 'ut labore et dolore magna', age: 'ii hr' },
    { from: 'j. goodall', subj: 'aliqua, ut enim ad minim', age: 'iii hr' },
  ];
</script>

<div class="corresp">
  {#each items as m}
    <div class="corr-row">
      <span class="corr-mark">·</span>
      <span class="corr-from">{m.from}</span>
      <span class="corr-subj">{m.subj}</span>
      <span class="corr-age">{m.age}</span>
    </div>
  {/each}
</div>
