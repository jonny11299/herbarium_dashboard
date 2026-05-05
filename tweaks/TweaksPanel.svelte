<script>
  let { title = 'Tweaks', children } = $props();

  let open = $state(false);
  let panelEl;
  let offsetRef = { x: 16, y: 16 };
  const PAD = 16;

  function clampToViewport() {
    if (!panelEl) return;
    const w = panelEl.offsetWidth, h = panelEl.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.x = Math.min(maxRight, Math.max(PAD, offsetRef.x));
    offsetRef.y = Math.min(maxBottom, Math.max(PAD, offsetRef.y));
    panelEl.style.right = offsetRef.x + 'px';
    panelEl.style.bottom = offsetRef.y + 'px';
  }

  $effect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  });

  $effect(() => {
    function onMsg(e) {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') open = true;
      else if (t === '__deactivate_edit_mode') open = false;
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  });

  function dismiss() {
    open = false;
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  }

  function onDragStart(e) {
    if (!panelEl) return;
    const r = panelEl.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    function move(ev) {
      offsetRef.x = startRight - (ev.clientX - sx);
      offsetRef.y = startBottom - (ev.clientY - sy);
      clampToViewport();
    }
    function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }
</script>

{#if open}
  <div bind:this={panelEl} class="twk-panel" data-noncommentable=""
       style:right="{offsetRef.x}px" style:bottom="{offsetRef.y}px">
    <div class="twk-hd" onmousedown={onDragStart}>
      <b>{title}</b>
      <button class="twk-x" aria-label="Close tweaks"
              onmousedown={(e) => e.stopPropagation()}
              onclick={dismiss}>✕</button>
    </div>
    <div class="twk-body">
      {@render children()}
    </div>
  </div>
{/if}
