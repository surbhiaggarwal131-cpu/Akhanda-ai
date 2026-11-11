(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const STORAGE_KEY = 'akhanda.pwa.preview.v1';
  const state = loadState();
  let currentId = state.currentId;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { chats: Array.isArray(saved.chats) ? saved.chats : [], currentId: saved.currentId || null, theme: saved.theme || 'system' };
    } catch {
      return { chats: [], currentId: null, theme: 'system' };
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, currentId })); }
    catch { showToast('Could not save locally. Your browser storage may be full.'); }
  }
  function uid() { return (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function currentChat() { return state.chats.find(c => c.id === currentId) || null; }
  function createChat() {
    const chat = { id: uid(), title: 'New chat', messages: [], updated: Date.now() };
    state.chats.unshift(chat); currentId = chat.id; save(); render(); closeSidebar(); $('#messageInput').focus();
  }
  function selectChat(id) { currentId = id; save(); render(); closeSidebar(); }
  function addMessage(role, text) {
    let chat = currentChat();
    if (!chat) { chat = { id: uid(), title: 'New chat', messages: [], updated: Date.now() }; state.chats.unshift(chat); currentId = chat.id; }
    chat.messages.push({ role, text, time: Date.now() });
    if (role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1) chat.title = text.replace(/\s+/g, ' ').slice(0, 42) || 'New chat';
    chat.updated = Date.now(); save(); render();
  }
  function renderSidebar() {
    $('#chatList').innerHTML = state.chats.map(c => `<button class="chat-item ${c.id === currentId ? 'active' : ''}" data-chat="${esc(c.id)}" title="${esc(c.title)}">${esc(c.title)}</button>`).join('');
    $('#chatList').querySelectorAll('[data-chat]').forEach(b => b.addEventListener('click', () => selectChat(b.dataset.chat)));
  }
  function renderMessages() {
    const chat = currentChat();
    const welcome = $('#welcome');
    const box = $('#messages');
    if (!chat || chat.messages.length === 0) { welcome.hidden = false; box.innerHTML = ''; return; }
    welcome.hidden = true;
    box.innerHTML = chat.messages.map(m => `<div class="message ${m.role === 'user' ? 'user' : 'notice'}">${m.role === 'notice' ? '<span class="message-label">AKHANDA PREVIEW</span>' : ''}${esc(m.text)}</div>`).join('');
    $('#conversation').scrollTop = $('#conversation').scrollHeight;
  }
  function render() { renderSidebar(); renderMessages(); }
  function showToast(text) {
    const t = $('#toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#sidebarBackdrop').classList.remove('show'); }
  function openSettings() { $('#themeSelect').value = state.theme; $('#settingsDialog').showModal(); }

  $('#newChat').addEventListener('click', createChat);
  $('#openSidebar').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#sidebarBackdrop').classList.add('show'); });
  $('#closeSidebar').addEventListener('click', closeSidebar);
  $('#sidebarBackdrop').addEventListener('click', closeSidebar);
  $('#settingsButton').addEventListener('click', openSettings);
  $('#topSettings').addEventListener('click', openSettings);
  $('#saveSettings').addEventListener('click', () => {
    state.theme = $('#themeSelect').value;
    applyTheme(); save();
    $('#settingsDialog').close(); showToast('Settings saved');
  });
  function applyTheme() {
    const light = state.theme === 'light' || (state.theme === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
  }
  $('#messageInput').addEventListener('input', e => {
    e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    $('#sendButton').disabled = !e.target.value.trim();
  });
  function send() {
    const input = $('#messageInput'); const text = input.value.trim(); if (!text) return;
    addMessage('user', text);
    input.value = ''; input.style.height = 'auto'; $('#sendButton').disabled = true;
    addMessage('notice', 'AI replies are not connected in this preview yet. Your message has been saved on this device. No API key was requested or transmitted.');
  }
  $('#sendButton').addEventListener('click', send);
  $('#messageInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });

  if (!currentChat() && state.chats.length) currentId = state.chats[0].id;
  applyTheme(); render(); save();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
