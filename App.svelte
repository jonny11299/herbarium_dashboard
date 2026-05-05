<script>
  import { tweaks, setTweak } from './stores/tweaks.js';
  import CornerOrnament from './CornerOrnament.svelte';

  import TweaksPanel from './tweaks/TweaksPanel.svelte';
  import TweakSection from './tweaks/TweakSection.svelte';
  import TweakSelect from './tweaks/TweakSelect.svelte';
  import TweakToggle from './tweaks/TweakToggle.svelte';
  import TweakRadio from './tweaks/TweakRadio.svelte';
  import TweakSlider from './tweaks/TweakSlider.svelte';
  import TweakButton from './tweaks/TweakButton.svelte';

  import MastheadWidget from './widgets/MastheadWidget.svelte';
  import ScheduleWidget from './widgets/ScheduleWidget.svelte';
  import StatTilesWidget from './widgets/StatTilesWidget.svelte';
  import CorrespondenceWidget from './widgets/CorrespondenceWidget.svelte';
  import QuoteWidget from './widgets/QuoteWidget.svelte';
  import NotebookWidget from './widgets/NotebookWidget.svelte';
  import PrimaryChartWidget from './widgets/PrimaryChartWidget.svelte';
  import SpecimenIndexWidget from './widgets/SpecimenIndexWidget.svelte';
  import RadialWidget from './widgets/RadialWidget.svelte';
  import ActivityGridWidget from './widgets/ActivityGridWidget.svelte';
  import ContourWidget from './widgets/ContourWidget.svelte';
  import BarPlotWidget from './widgets/BarPlotWidget.svelte';
  import ArcRibbonWidget from './widgets/ArcRibbonWidget.svelte';
  import FieldNotesWidget from './widgets/FieldNotesWidget.svelte';
  import DialsWidget from './widgets/DialsWidget.svelte';

  const COMP_MAP = {
    MastheadWidget,
    ScheduleWidget,
    StatTilesWidget,
    CorrespondenceWidget,
    QuoteWidget,
    NotebookWidget,
    PrimaryChartWidget,
    SpecimenIndexWidget,
    RadialWidget,
    ActivityGridWidget,
    ContourWidget,
    BarPlotWidget,
    ArcRibbonWidget,
    FieldNotesWidget,
    DialsWidget,
  };

  const WINDOWS = [
    { id: 'masthead',  code: 'i.',       title: 'masthead',                     pane: 'left',  comp: 'MastheadWidget',       defaultMin: false },
    { id: 'schedule',  code: 'ii.',      title: 'agenda · iv·v',                pane: 'left',  comp: 'ScheduleWidget',       defaultMin: false },
    { id: 'tiles',     code: 'iii.',     title: 'indices',                      pane: 'left',  comp: 'StatTilesWidget',      defaultMin: false },
    { id: 'corresp',   code: 'iv.',      title: 'correspondence',               pane: 'left',  comp: 'CorrespondenceWidget', defaultMin: false },
    { id: 'quote',     code: 'v.',       title: 'epigraph',                     pane: 'left',  comp: 'QuoteWidget',          defaultMin: true  },
    { id: 'notebook',  code: 'vi.',      title: 'notebook',                     pane: 'left',  comp: 'NotebookWidget',       defaultMin: true  },
    { id: 'primary',   code: 'fig·i',   title: 'specimen 0xa42 · series xvii', pane: 'right', comp: 'PrimaryChartWidget',   defaultMin: false },
    { id: 'specimens', code: 'fig·ii',  title: 'specimen index',               pane: 'right', comp: 'SpecimenIndexWidget',  defaultMin: false },
    { id: 'radial',    code: 'fig·iii', title: 'polar distribution',           pane: 'right', comp: 'RadialWidget',         defaultMin: false },
    { id: 'activity',  code: 'fig·iv',  title: 'activity · 26 wk',            pane: 'right', comp: 'ActivityGridWidget',   defaultMin: false },
    { id: 'contour',   code: 'fig·v',   title: 'density contours',             pane: 'right', comp: 'ContourWidget',        defaultMin: false },
    { id: 'bars',      code: 'fig·vi',  title: 'distribution',                 pane: 'right', comp: 'BarPlotWidget',        defaultMin: true  },
    { id: 'arc',       code: 'fig·vii', title: 'relations',                    pane: 'right', comp: 'ArcRibbonWidget',      defaultMin: true  },
    { id: 'notes',     code: 'fig·viii',title: 'field notes',                  pane: 'right', comp: 'FieldNotesWidget',     defaultMin: false },
    { id: 'dials',     code: 'fig·ix',  title: 'instruments',                  pane: 'right', comp: 'DialsWidget',          defaultMin: false },
  ];

  let minimized = $state(
    Object.fromEntries(WINDOWS.map(w => [w.id, w.defaultMin]))
  );

  function toggleMin(id) { minimized[id] = !minimized[id]; }
  function restoreAll() { WINDOWS.forEach(w => { minimized[w.id] = false; }); }
  function minimizeAll() { WINDOWS.forEach(w => { minimized[w.id] = true; }); }

  let splitEl;
  let dragging = $state(false);

  function onDragStart(e) {
    e.preventDefault();
    dragging = true;
  }

  $effect(() => {
    if (!dragging) return;
    function onMove(e) {
      if (!splitEl) return;
      const rect = splitEl.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setTweak('leftPct', Math.round(Math.max(15, Math.min(85, pct))));
    }
    function onUp() { dragging = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  });

  function onDividerDouble() {
    const presets = [33, 50, 67];
    let next = presets[0];
    for (const p of presets) {
      if (Math.abs($tweaks.leftPct - p) < 3) {
        next = presets[(presets.indexOf(p) + 1) % presets.length];
        break;
      }
    }
    setTweak('leftPct', next);
  }

  const leftWindows  = $derived(WINDOWS.filter(w => w.pane === 'left'));
  const rightWindows = $derived(WINDOWS.filter(w => w.pane === 'right'));
  const minimizedWindows = $derived(WINDOWS.filter(w => minimized[w.id]));
</script>

<div
  class="aesthetic-{$tweaks.aesthetic} density-{$tweaks.density} font-mono-{$tweaks.monoFont} font-serif-{$tweaks.serifFont}"
  style="height:100%;display:flex;flex-direction:column"
>
  {#if $tweaks.showCorners}
    <div class="corner tl"><CornerOrnament /></div>
    <div class="corner tr"><CornerOrnament /></div>
    <div class="corner bl"><CornerOrnament /></div>
    <div class="corner br"><CornerOrnament /></div>
  {/if}

  <header class="app-bar">
    <div class="app-mark">Herbarium</div>
    <div class="app-meta">
      <div><span class="key">vol</span><span class="val">iv · xii</span></div>
      <div><span class="key">date</span><span class="val">iv · v · mmxxvi</span></div>
      <div><span class="key">obs</span><span class="val">847</span></div>
      <div><span class="key">σ</span><span class="val">0.0184</span></div>
      <div><span class="key">lat</span><span class="val">40.69° n</span></div>
    </div>
    <div class="app-actions">
      <button class="app-btn" onclick={minimizeAll}>collapse</button>
      <button class="app-btn" onclick={restoreAll}>restore</button>
      <button class="app-btn" onclick={() => window.postMessage({ type: '__activate_edit_mode' }, '*')}>tweaks</button>
    </div>
  </header>

  <div class="split" bind:this={splitEl}>
    <div class="pane" style:width="{$tweaks.leftPct}%">
      <div class="pane-tag">verso · l</div>
      <div class="pane-inner" data-screen-label="left-pane">
        {#each leftWindows as w}
          {#if !minimized[w.id]}
            <section class="window" data-window-id={w.id} data-screen-label="{w.code} {w.title}">
              <header class="win-bar">
                <span class="win-code">{w.code}</span>
                <span class="win-title">{w.title}</span>
                <span class="win-dots"></span>
                <button class="win-btn" onclick={() => toggleMin(w.id)} title="minimize">−</button>
              </header>
              <div class="win-body">
                <svelte:component this={COMP_MAP[w.comp]} />
              </div>
            </section>
          {/if}
        {/each}
      </div>
    </div>

    <div
      class="divider"
      class:dragging
      onmousedown={onDragStart}
      ondblclick={onDividerDouble}
      title="drag to resize · double-click to cycle 33/50/67"
    >
      <span class="tick t1"></span>
      <span class="tick t2"></span>
      <div class="divider-hit" onmousedown={onDragStart} ondblclick={onDividerDouble}></div>
    </div>

    <div class="pane" style:width="{100 - $tweaks.leftPct}%">
      <div class="pane-tag">recto · r</div>
      <div class="pane-inner" data-screen-label="right-pane">
        {#each rightWindows as w}
          {#if !minimized[w.id]}
            <section class="window" data-window-id={w.id} data-screen-label="{w.code} {w.title}">
              <header class="win-bar">
                <span class="win-code">{w.code}</span>
                <span class="win-title">{w.title}</span>
                <span class="win-dots"></span>
                <button class="win-btn" onclick={() => toggleMin(w.id)} title="minimize">−</button>
              </header>
              <div class="win-body">
                <svelte:component this={COMP_MAP[w.comp]} />
              </div>
            </section>
          {/if}
        {/each}
      </div>
    </div>
  </div>

  <div class="dock">
    <span class="dock-label">collapsed ·</span>
    {#if minimizedWindows.length === 0}
      <span style="color:var(--text-tertiary);font-style:italic">nil</span>
    {:else}
      {#each minimizedWindows as w}
        <button class="dock-item" onclick={() => toggleMin(w.id)}>
          <span class="dot"></span>{w.title}
        </button>
      {/each}
    {/if}
  </div>

  <TweaksPanel title="Tweaks">
    {#snippet children()}
      <TweakSection label="aesthetic">
        {#snippet children()}
          <TweakSelect
            label="palette"
            value={$tweaks.aesthetic}
            onChange={v => setTweak('aesthetic', v)}
            options={[
              { value: 'herbarium', label: 'herbarium · earth in space' },
              { value: 'nebula',    label: 'nebula · deep purple' },
              { value: 'nocturne',  label: 'nocturne · pure black' },
              { value: 'glass',     label: 'glass pavilion · emerald' },
            ]}
          />
          <TweakToggle
            label="corner ornaments"
            value={$tweaks.showCorners}
            onChange={v => setTweak('showCorners', v)}
          />
        {/snippet}
      </TweakSection>

      <TweakSection label="typography">
        {#snippet children()}
          <TweakSelect
            label="mono"
            value={$tweaks.monoFont}
            onChange={v => setTweak('monoFont', v)}
            options={[
              { value: 'jetbrains', label: 'JetBrains Mono' },
              { value: 'ibm',       label: 'IBM Plex Mono' },
              { value: 'space',     label: 'Space Mono' },
              { value: 'courier',   label: 'Courier New Bold' },
              { value: 'iosevka',   label: 'Iosevka Charon' },
              { value: 'opensans',  label: 'Open Sans (sans)' },
            ]}
          />
          <TweakSelect
            label="serif"
            value={$tweaks.serifFont}
            onChange={v => setTweak('serifFont', v)}
            options={[
              { value: 'cormorant', label: 'Cormorant Garamond' },
              { value: 'eb',        label: 'EB Garamond' },
              { value: 'playfair',  label: 'Playfair Display' },
            ]}
          />
        {/snippet}
      </TweakSection>

      <TweakSection label="layout">
        {#snippet children()}
          <TweakRadio
            label="density"
            value={String($tweaks.density)}
            onChange={v => setTweak('density', Number(v))}
            options={[
              { value: '1', label: 'airy' },
              { value: '2', label: 'standard' },
              { value: '3', label: 'dense' },
            ]}
          />
          <TweakSlider
            label="split (l %)"
            value={$tweaks.leftPct}
            onChange={v => setTweak('leftPct', v)}
            min={15} max={85} step={1}
          />
        {/snippet}
      </TweakSection>

      <TweakSection label="windows">
        {#snippet children()}
          <TweakButton label="restore all" onClick={restoreAll} />
          <TweakButton label="collapse all" onClick={minimizeAll} secondary />
        {/snippet}
      </TweakSection>
    {/snippet}
  </TweaksPanel>
</div>
