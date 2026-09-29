/**
 * 404 Advisory landing page visitor tracker.
 * Anonymous visitor ID only (no name/PII) - modeled on the KYZN tracker pattern but with no
 * name gate. Tracks pageview + click events site-wide, buffers, flushes to the standalone
 * Visitors service (separate from any other app on that domain).
 */
(function () {
  'use strict';

  var API_BASE = window.VISITOR_TRACKER_URL || 'https://doomsday.404advisory.live';
  var FLUSH_INTERVAL = 5000;
  var FLUSH_MAX_EVENTS = 30;

  function getOrCreate(storage, key, gen) {
    try {
      var v = storage.getItem(key);
      if (!v) { v = gen(); storage.setItem(key, v); }
      return v;
    } catch (e) { return gen(); }
  }

  function genId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }

  function getVisitorToken() {
    return getOrCreate(localStorage, 'landing_visitor_token', function () { return genId('v'); });
  }

  function getSessionId() {
    return getOrCreate(sessionStorage, 'landing_session_id', function () { return genId('s'); });
  }

  // ─── Event buffer ────────────────────────────────────────────────
  var buffer = [];
  var flushTimer = null;
  var currentPageLabel = window.location.pathname + window.location.hash;

  function push(eventType, label) {
    buffer.push({ event_type: eventType, label: label, page: currentPageLabel, ts: new Date().toISOString() });
    if (buffer.length >= FLUSH_MAX_EVENTS) {
      flush();
    } else if (!flushTimer) {
      flushTimer = setTimeout(flush, FLUSH_INTERVAL);
    }
  }

  function flush() {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    if (buffer.length === 0) return;
    var batch = buffer.splice(0, buffer.length);
    var payload = {
      visitor_token: getVisitorToken(),
      session_id: getSessionId(),
      page: currentPageLabel,
      events: batch,
    };
    fetch(API_BASE + '/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(function () {});
  }

  function describeEl(el) {
    if (!el) return '';
    var label = (el.id ? '#' + el.id : '') || (el.textContent || '').trim().slice(0, 60);
    return (el.tagName ? el.tagName.toLowerCase() : '') + (label ? ' - ' + label : '');
  }

  function handleClick(e) {
    var el = e.target;
    var clickable = el.closest ? el.closest('button, a, [role="button"], input[type="button"], input[type="submit"]') : null;
    if (!clickable) return;
    push('click', describeEl(clickable));
  }

  function handleHashChange() {
    currentPageLabel = window.location.pathname + window.location.hash;
    push('page_view', currentPageLabel);
    flush();
  }

  function init() {
    document.addEventListener('click', handleClick, true);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);

    push('page_view', currentPageLabel);
    flush();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.VisitorTracker = { flush: flush };
})();
