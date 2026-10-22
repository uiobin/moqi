const KEY = 'moqi.personas.v1';
const $ = id => document.getElementById(id);
const FIELDS = ['name', 'rel', 'tone', 'like', 'note'];
let data = [];
let cur = null;

try { data = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { data = []; }

const esc = s => String(s || '').replace(/[&<>"]/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function saveAll() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function render() {
  const box = $('list');
  if (!data.length) {
    box.innerHTML = '<p class="empty">還沒有人設。<br>點下面按鈕，先記下第一個人的樣子。</p>';
    return;
  }
  box.innerHTML = data.map((p, i) => `
    <article class="card" data-i="${i}">
      <h3>${esc(p.name) || '未命名'}</h3>
      ${p.rel ? `<p class="rel">${esc(p.rel)}</p>` : ''}
      ${p.tone ? `<p>${esc(p.tone)}</p>` : ''}
      ${p.like ? `<p>${esc(p.like)}</p>` : ''}
      ${p.note ? `<p>${esc(p.note)}</p>` : ''}
    </article>`).join('');
  box.querySelectorAll('.card').forEach(el => {
    el.onclick = () => openEditor(Number(el.dataset.i));
  });
}

function openEditor(i) {
  cur = i;
  const p = i === null ? {} : data[i];
  $('etitle').textContent = i === null ? '新增人設' : '編輯人設';
  FIELDS.forEach(f => { $('f-' + f).value = p[f] || ''; });
  $('del').style.display = i === null ? 'none' : '';
  $('editor').classList.remove('hidden');
}

function closeEditor() {
  $('editor').classList.add('hidden');
}

$('add').onclick = () => openEditor(null);
$('cancel').onclick = closeEditor;

$('save').onclick = () => {
  const p = {};
  FIELDS.forEach(f => { p[f] = $('f-' + f).value.trim(); });
  if (!p.name) { alert('先填個名字吧'); return; }
  if (cur === null) data.push(p); else data[cur] = p;
  saveAll(); render(); closeEditor();
};

$('del').onclick = () => {
  if (cur === null) return;
  if (!confirm('刪掉「' + (data[cur].name || '未命名') + '」？')) return;
  data.splice(cur, 1);
  saveAll(); render(); closeEditor();
};

$('editor').onclick = e => { if (e.target.id === 'editor') closeEditor(); };

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
