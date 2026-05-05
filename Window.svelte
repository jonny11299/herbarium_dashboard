<script>
  let {
    id,
    title,
    code = 'fig',
    defaultMinimized = false,
    onMinimize,
    onClose,
    dense = false,
    children,
  } = $props();

  let minimized = $state(defaultMinimized);

  function toggleMin() {
    minimized = !minimized;
    onMinimize?.(!minimized);
  }
</script>

<section
  class="window"
  class:is-min={minimized}
  class:is-dense={dense}
  data-window-id={id}
>
  <header class="win-bar">
    <span class="win-code">{code}</span>
    <span class="win-title">{title}</span>
    <span class="win-dots" aria-hidden="true"></span>
    <button class="win-btn" onclick={toggleMin} aria-label={minimized ? 'expand' : 'minimize'}>
      {minimized ? '＋' : '−'}
    </button>
    {#if onClose}
      <button class="win-btn" onclick={onClose} aria-label="close">×</button>
    {/if}
  </header>
  {#if !minimized}
    <div class="win-body">
      {@render children()}
    </div>
  {/if}
</section>
