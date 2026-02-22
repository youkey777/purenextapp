// ===== PureNext App =====
const appState = {
    profile: { name: '', address: '', birth: '', sex: '未選択', heightCm: 0, weightKg: 0, activity: 'ふつう' },
    settings: { goalMl: 2000, notifyEnabled: true, paceThreshold: -0.15 },
    powerSave: { enabled: false, timerEnabled: false, startTime: '22:00', endTime: '06:00', activeDays: [0, 1, 2, 3, 4, 5, 6] },
    filter: { lastReplacementDate: '2024-09-01', intervalMonths: 6, nextReplacementDate: '', model: 'PureNext Filter PRO' },
    today: { dateStr: new Date().toISOString().split('T')[0], totalMl: 0, bufferMl: 0, pouring: false, history: [] },
    onboardingCompleted: false
};

// Column articles data
const columnArticles = [
    {
        id: 1, icon: '✨', title: 'PureNext浄水器の魅力', preview: 'なぜPureNext浄水器が選ばれるのか。高性能フィルターで99.9%の不純物を除去し…',
        body: '<p><strong>✨ なぜPureNext浄水器が選ばれるのか</strong></p><ul><li><strong>高性能フィルター：</strong>99.9%の不純物を除去し、安全でおいしい水を提供</li><li><strong>ミネラル保持：</strong>必要なミネラルはしっかり残して、健康的な水質を実現</li><li><strong>長期コスパ：</strong>ペットボトル水と比較して約80%のコスト削減</li><li><strong>環境配慮：</strong>プラスチック削減で地球にやさしい選択</li></ul>'
    },
    {
        id: 2, icon: '🌟', title: '水分補給の健康効果', preview: '適切な水分摂取で代謝促進、美肌効果、デトックスなど多くのメリットが…',
        body: '<p><strong>🌟 適切な水分摂取の重要性</strong></p><ul><li><strong>代謝促進：</strong>基礎代謝が向上し、ダイエット効果も期待</li><li><strong>美肌効果：</strong>肌の潤いを保ち、老化防止に効果的</li><li><strong>デトックス：</strong>体内の老廃物排出を促進</li><li><strong>集中力向上：</strong>脳の働きが活発になり、仕事効率UP</li><li><strong>疲労回復：</strong>血流改善により疲れにくい体質へ</li></ul>'
    },
    {
        id: 3, icon: '⏰', title: '効果的な水分補給のコツ', preview: '朝起きた直後、食事前30分、運動前後…ベストタイミングを解説',
        body: '<p><strong>⏰ 水分補給のベストタイミング</strong></p><ul><li><strong>朝起きた直後：</strong>就寝中の水分不足を解消（500ml推奨）</li><li><strong>食事前30分：</strong>消化を助け、満腹感もアップ</li><li><strong>運動前後：</strong>脱水症状の予防と疲労回復</li><li><strong>入浴前後：</strong>発汗による水分ロス対策</li><li><strong>就寝前：</strong>夜間の血液濃縮を防ぐ（ただし適量で）</li></ul>'
    },
    {
        id: 4, icon: '🌸', title: '季節別・水分補給のポイント', preview: '春は花粉症対策、夏は熱中症予防、秋は乾燥対策、冬は冷え性改善に…',
        body: '<p><strong>🌸 春：花粉症対策にも効果的</strong></p><p>新陳代謝が活発になる季節。体内の浄化作用を高めるため、こまめな水分補給を。</p><p><strong>☀️ 夏：熱中症予防が最重要</strong></p><p>発汗量が増えるため、通常の1.5倍の水分摂取を目標に。</p><p><strong>🍂 秋：乾燥対策で美肌維持</strong></p><p>空気が乾燥し始める時期。肌や喉の潤いを保つため、温かい水分も積極的に。</p><p><strong>❄️ 冬：冷え性改善と風邪予防</strong></p><p>白湯やハーブティーで体を温めながら水分補給を。</p>'
    },
    {
        id: 5, icon: '🔬', title: '水質と健康の関係', preview: 'pH値、ミネラル、塩素除去など、良質な水が体に与える影響を解説',
        body: '<p><strong>🔬 良質な水が体に与える影響</strong></p><ul><li><strong>pH値：</strong>弱アルカリ性の水は体の酸化を中和</li><li><strong>ミネラル：</strong>カルシウム、マグネシウムなど必須ミネラルを供給</li><li><strong>塩素除去：</strong>肌荒れやアトピーの改善に効果</li><li><strong>重金属除去：</strong>長期的な健康リスクを軽減</li></ul>'
    }
];

// ===== Utility =====
const sessionSeedOffset = Math.random() * 10000;
const todayDummyData = {};
[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].forEach(h => { todayDummyData[h] = Math.floor(Math.random() * 500); });
function seededRandom(seed) { const x = Math.sin(seed + sessionSeedOffset) * 10000; return x - Math.floor(x); }

function showToast(msg, dur = 3000) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), dur);
}

function playBeep() {
    if (!appState.settings.notifyEnabled) return;
    try {
        const ac = new (window.AudioContext || window.webkitAudioContext)(), o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination); o.frequency.value = 800; o.type = 'sine';
        g.gain.setValueAtTime(.1, ac.currentTime); g.gain.exponentialRampToValueAtTime(.01, ac.currentTime + .1);
        o.start(ac.currentTime); o.stop(ac.currentTime + .1);
    } catch (e) { }
}

function calculateRecommendedGoal() {
    const w = appState.profile.weightKg || 60;
    const c = { '低め': 1.0, 'ふつう': 1.1, '高め': 1.2 }[appState.profile.activity] || 1.1;
    return Math.max(800, Math.min(5000, Math.round(w * 35 * c)));
}

// ===== Keypad =====
function showKeypad(title, unit, onConfirm, allowDecimal = false) {
    let val = '';
    const overlay = document.createElement('div'); overlay.className = 'keypad-overlay';
    overlay.innerHTML = `<div class="keypad-panel">
    <div class="keypad-title">${title}</div>
    <div class="keypad-display"><span class="kp-val">0</span><span>${unit}</span></div>
    <div class="keypad-grid">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="keypad-btn" data-n="${n}">${n}</button>`).join('')}
      <button class="keypad-btn delete" data-n="del">⌫</button>
      <button class="keypad-btn" data-n="0">0</button>
      <button class="keypad-btn" data-n="${allowDecimal ? '.' : '00'}">${allowDecimal ? '.' : '00'}</button>
    </div>
    <div class="keypad-actions">
      <button class="btn btn-secondary kp-cancel">キャンセル</button>
      <button class="btn btn-primary kp-confirm">決定</button>
    </div></div>`;
    document.body.appendChild(overlay);
    const disp = overlay.querySelector('.kp-val');
    overlay.querySelectorAll('.keypad-btn').forEach(b => b.addEventListener('click', () => {
        const n = b.dataset.n;
        if (n === 'del') val = val.slice(0, -1);
        else if (n === '.' && val.includes('.')) return;
        else if (val.length < 7) val += n;
        disp.textContent = val || '0';
    }));
    overlay.querySelector('.kp-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.kp-confirm').addEventListener('click', () => {
        const num = parseFloat(val);
        if (num > 0) onConfirm(num);
        overlay.remove();
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ===== Share Group Popup =====
function showSharePopup() {
    const popup = document.createElement('div'); popup.className = 'share-popup';
    popup.innerHTML = `<div class="share-popup-content">
    <h3>👥 グループで記録を共有</h3>
    <p>水分摂取の記録を家族や友人と共有しませんか？<br>グループに参加すると、お互いの飲水量を確認し合えます。</p>
    <div class="share-popup-actions">
      <button class="btn btn-primary" id="popupCreateGroup">新しいグループを作成</button>
      <button class="btn btn-success" id="popupJoinGroup">既存のグループに参加</button>
      <button class="btn btn-secondary" id="popupShareRecord">今日の記録をSNSで共有</button>
      <button class="btn btn-secondary" id="popupClose" style="background:transparent;color:var(--text-muted);">閉じる</button>
    </div></div>`;
    document.body.appendChild(popup);
    popup.querySelector('#popupClose').addEventListener('click', () => popup.remove());
    popup.querySelector('#popupCreateGroup').addEventListener('click', () => {
        popup.remove(); showScreen('profile');
        document.getElementById('enableGroupSharing').checked = true;
        document.getElementById('enableGroupSharing').dispatchEvent(new Event('change'));
        showToast('グループ共有設定を開きました');
    });
    popup.querySelector('#popupJoinGroup').addEventListener('click', () => {
        popup.remove(); showScreen('profile');
        document.getElementById('enableGroupSharing').checked = true;
        document.getElementById('enableGroupSharing').dispatchEvent(new Event('change'));
        setTimeout(() => document.getElementById('joinGroupId')?.focus(), 300);
    });
    popup.querySelector('#popupShareRecord').addEventListener('click', () => { popup.remove(); shareRecords(); });
    popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
}

// ===== QR Code Generator (simple) =====
function generateQRCode(text, container) {
    container.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className = 'qr-container';
    const qrDiv = document.createElement('div'); qrDiv.className = 'qr-code';
    const canvas = document.createElement('canvas');
    const size = 160; canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    // Simple QR-like pattern (demo)
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
    const cellSize = size / 21;
    for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
        const isFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
        const isData = !isFinder && seededRandom(r * 21 + c + text.charCodeAt(0)) > .45;
        if (isFinder || isData) { ctx.fillStyle = '#1e293b'; ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize); }
    }
    // Finder patterns
    [[0, 0], [0, 14], [14, 0]].forEach(([sr, sc]) => {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(sc * cellSize, sr * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#fff'; ctx.fillRect((sc + 1) * cellSize, (sr + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#1e293b'; ctx.fillRect((sc + 2) * cellSize, (sr + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    });
    qrDiv.appendChild(canvas);
    const label = document.createElement('div'); label.className = 'qr-label';
    label.textContent = `グループID: ${text}`;
    const actions = document.createElement('div'); actions.className = 'qr-actions';
    const copyBtn = document.createElement('button'); copyBtn.className = 'btn btn-primary'; copyBtn.textContent = 'IDをコピー';
    copyBtn.addEventListener('click', () => { navigator.clipboard.writeText(text).then(() => showToast('コピーしました')); });
    const shareBtn = document.createElement('button'); shareBtn.className = 'btn btn-secondary'; shareBtn.textContent = '招待を送る';
    shareBtn.addEventListener('click', () => {
        const url = `https://purenext-app.com/join/${text}`;
        const popup = document.createElement('div'); popup.className = 'share-popup';
        popup.innerHTML = `<div class="share-popup-content">
            <h3>招待リンクを生成しました</h3>
            <p>以下のリンクを使ってメンバーを招待、または自分で開いてテストできます。</p>
            <a href="#" style="display:block;margin:15px 0;word-break:break-all;color:var(--primary);font-weight:bold;" id="mockScanLink">${url}</a>
            <div class="share-popup-actions">
              <button class="btn btn-primary" id="copyLinkBtn">リンクをコピー</button>
              <button class="btn btn-secondary" id="closeInviteBtn">閉じる</button>
            </div></div>`;
        document.body.appendChild(popup);
        popup.querySelector('#mockScanLink').addEventListener('click', (e) => {
            e.preventDefault(); popup.remove();
            showToast('QRコードを読み取りました。連携します...');
            setTimeout(() => {
                document.getElementById('joinGroupId').value = text;
                document.getElementById('joinGroupBtn').click();
            }, 800);
        });
        popup.querySelector('#copyLinkBtn').addEventListener('click', () => { navigator.clipboard.writeText(url).then(() => showToast('コピーしました')); });
        popup.querySelector('#closeInviteBtn').addEventListener('click', () => popup.remove());
    });
    actions.appendChild(copyBtn); actions.appendChild(shareBtn);
    wrap.appendChild(qrDiv); wrap.appendChild(label); wrap.appendChild(actions);
    container.appendChild(wrap);
}

// ===== Core UI Updates =====
function updateUI() { updateHomeStats(); updateWaterFill(); updateHeaderCenter(); checkPaceAndNotify(); if (!appState.today.pouring) updateTodayChart(); }

function updateHomeStats() {
    const total = appState.today.totalMl + appState.today.bufferMl;
    const rate = appState.settings.goalMl > 0 ? Math.round((total / appState.settings.goalMl) * 100) : 0;
    const remain = Math.max(0, appState.settings.goalMl - total);
    document.getElementById('todayTotal').textContent = `${Math.round(total)}ml`;
    document.getElementById('goalDisplay').textContent = `${Math.round(appState.settings.goalMl)}ml`;
    document.getElementById('rateDisplay').textContent = `${rate}%`;
    document.getElementById('remainDisplay').textContent = `${Math.round(remain)}ml`;
    document.getElementById('bufferDisplay').textContent = `現在 ${Math.round(appState.today.bufferMl)}ml`;
    const logTotal = document.getElementById('todayLogTotal');
    if (logTotal) logTotal.textContent = `合計: ${Math.round(appState.today.totalMl)}ml`;
}

function updateWaterFill() {
    const total = appState.today.totalMl + appState.today.bufferMl;
    const pct = Math.min(100, (total / appState.settings.goalMl) * 100);
    const wf = document.getElementById('waterFill');
    if (wf) { const h = (pct / 100) * 220; wf.setAttribute('y', 220 - h); wf.setAttribute('height', h); }
}

function updateHeaderCenter() {
    const r = Math.max(0, appState.settings.goalMl - appState.today.totalMl);
    document.getElementById('headerCenter').textContent = `今日はあと${r}mlで100%！`;
}

function checkPaceAndNotify() {
    if (!appState.settings.notifyEnabled) return;
    const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const elapsed = (now - start) / 60000, expected = appState.settings.goalMl * (elapsed / 1440);
    const ratio = (appState.today.totalMl - expected) / appState.settings.goalMl;
    const el = document.getElementById('paceNotification');
    el.style.display = ratio < appState.settings.paceThreshold ? 'block' : 'none';
}

// ===== Pouring (Modified: auto-record on release) =====
let pourInterval, pourStartTime;

function startPouring(btn) {
    if (appState.today.pouring) return;
    appState.today.pouring = true; pourStartTime = Date.now();
    if (btn) btn.classList.add('pressing');
    pourInterval = setInterval(() => { appState.today.bufferMl += 1; updateUI(); }, 10);
}

function stopPouring() {
    if (!appState.today.pouring) return;
    appState.today.pouring = false; clearInterval(pourInterval);
    document.querySelectorAll('.side-pour-button').forEach(b => b.classList.remove('pressing'));
    // Auto-record on release
    if (appState.today.bufferMl > 0) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const ml = Math.round(appState.today.bufferMl);
        appState.today.history.unshift({ time: timeStr, ml, source: '取水', id: Date.now() });
        appState.today.totalMl += ml;
        showToast(`${ml}ml 記録しました ✓`);
        playBeep();
        appState.today.bufferMl = 0;
        updateUI();
    }
}

function addPreset(ml) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    appState.today.history.unshift({ time: timeStr, ml, source: 'プリセット', id: Date.now() });
    appState.today.totalMl += ml;
    showToast(`${ml}ml 記録しました ✓`);
    playBeep(); updateUI();
}

// ===== Screen Navigation =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id + 'Screen') || document.getElementById(id + 'Screen');
    if (screen) screen.classList.add('active');
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`[data-screen="${id}"]`);
    if (tab) tab.classList.add('active');
    if (id === 'records') { updateRecordsContent(getCurrentTab()); updateMilkRecords(); }
    if (id === 'goal') updateGoalDisplay();
    if (id === 'profile') { loadProfileToForm(false); updateWeightChart(); }
    if (id === 'powerSave') updatePowerSaveUI();
    if (id === 'contract') updateFilterDates();
    if (id === 'column') renderColumnCards();
}

function getCurrentTab() { const t = document.querySelector('.records-tab.active'); return t ? t.dataset.tab : 'daily'; }

// ===== Records =====
function updateRecordsContent(tab) {
    if (tab === 'daily') setTimeout(() => updateDailyRecords(), 50);
    else if (tab === 'week') setTimeout(() => updateWeekRecords(), 100);
    else if (tab === 'month') setTimeout(() => updateMonthRecords(), 100);
}

// Random data generation
function generateRandomDataForDay(dayKey) {
    const dayIndex = ['today', 'yesterday', '3daysago', '4daysago', '5daysago', '6daysago', '7daysago'].indexOf(dayKey);
    const sv = (dayIndex + 1) * 1000;
    const hours = [], amounts = [];
    const num = Math.floor(seededRandom(sv * 13) * 4) + 4;
    const possible = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const selected = [];
    for (let i = 0; i < num; i++) {
        let a = 0; while (a < 20) {
            const ri = Math.floor(seededRandom(sv * 101 + i * 37) * possible.length);
            const h = possible[ri];
            if (!selected.includes(h)) { selected.push(h); hours.push(h); amounts.push(Math.floor(seededRandom(sv * 203 + i * 73) * 500) + 10); break; }
            a++;
        }
    }
    const c = hours.map((h, i) => ({ hour: h, amount: amounts[i] })); c.sort((a, b) => a.hour - b.hour);
    return { hours: c.map(x => x.hour), amounts: c.map(x => x.amount) };
}

const globalDayPatterns = {};
['today', 'yesterday', '3daysago', '4daysago', '5daysago', '6daysago', '7daysago'].forEach(k => globalDayPatterns[k] = generateRandomDataForDay(k));

function updateDailyRecords() {
    const canvas = document.getElementById('dailyChart');
    const sel = document.querySelector('#dailyTab .daily-selector .period-btn.active')?.dataset.daily || 'today';
    const slots = Array.from({ length: 24 }, (_, i) => ({ hour: i, ml: 0, hasData: false, isDummy: false }));
    if (sel === 'today') {
        appState.today.history.forEach(e => { const h = parseInt(e.time.split(':')[0]); if (h >= 0 && h < 24) { slots[h].ml += e.ml; slots[h].hasData = true; } });
        const ch = new Date().getHours();
        for (let h = 6; h < ch; h++) {
            if (slots[h] && !slots[h].hasData && todayDummyData[h]) {
                slots[h].ml = todayDummyData[h];
                slots[h].hasData = true; slots[h].isDummy = true;
            }
        }
    } else {
        const p = globalDayPatterns[sel] || globalDayPatterns.today;
        p.hours.forEach((h, i) => { if (h < 24) { slots[h].ml = p.amounts[i]; slots[h].hasData = true; slots[h].isDummy = true; } });
    }
    drawBarChart(canvas, slots.filter(s => s.hasData), s => `${s.hour}:00`, s => s.ml, 'ml');
}

function drawBarChart(canvas, data, labelFn, valFn, unit, colorTheme = 'blue') {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) { setTimeout(() => drawBarChart(canvas, data, labelFn, valFn, unit, colorTheme), 200); return; }
    const ctx = canvas.getContext('2d');
    canvas.width = rect.width * 2; canvas.height = rect.height * 2; ctx.scale(2, 2);
    const w = rect.width, h = rect.height, p = 40;
    const cw = w - p * 2, ch = h - p * 2;
    ctx.clearRect(0, 0, w, h);
    if (!data.length) { ctx.fillStyle = '#94a3b8'; ctx.font = '13px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.fillText('データがありません', w / 2, h / 2); return; }
    const max = Math.max(...data.map(valFn), 100);
    const bw = Math.min(cw / data.length * .7, 28);
    const sp = cw / data.length;
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p, h - p); ctx.lineTo(w - p, h - p); ctx.stroke();
    data.forEach((d, i) => {
        const x = p + (i + .5) * sp; const v = valFn(d); const bh = (v / max) * ch; const y = h - p - bh;
        const grad = ctx.createLinearGradient(x, y, x, h - p);
        if (colorTheme === 'orange') {
            grad.addColorStop(0, d.isDummy ? 'rgba(249,115,22,.4)' : '#fb923c');
            grad.addColorStop(1, d.isDummy ? 'rgba(249,115,22,.15)' : '#f97316');
        } else {
            grad.addColorStop(0, d.isDummy ? 'rgba(14,165,233,.4)' : '#38bdf8');
            grad.addColorStop(1, d.isDummy ? 'rgba(14,165,233,.15)' : '#0ea5e9');
        }
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(x - bw / 2, y, bw, bh, [4, 4, 0, 0]); ctx.fill();
        ctx.fillStyle = d.isDummy ? '#94a3b8' : (colorTheme === 'orange' ? '#ea580c' : '#0284c7'); ctx.font = 'bold 9px Inter,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`${v}${unit}`, x, y - 4);
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter,sans-serif';
        ctx.fillText(labelFn(d), x, h - p + 14);
    });
    if (data.some(d => d.isDummy)) { ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.fillText('※ サンプルデータ', w / 2, 18); }
}

// Week chart
function updateWeekRecords() {
    const canvas = document.getElementById('weekChart');
    const data = generateAllWeeksData();
    drawBarChart(canvas, data, d => d.label, d => d.value, 'ml');
}
function generateAllWeeksData() {
    const data = [], today = new Date();
    for (let wo = 3; wo >= 0; wo--) {
        const ws = new Date(today); ws.setDate(today.getDate() - (wo * 7) - today.getDay());
        const we = new Date(ws); we.setDate(ws.getDate() + 6);
        const label = `${ws.getMonth() + 1}/${ws.getDate()}-${we.getMonth() + 1}/${we.getDate()}`;
        let val;
        if (wo === 0) val = Math.round(appState.today.totalMl || 2000);
        else { const sv = wo * 12345; val = Math.round(2000 + (Math.sin(wo * 2.5) * 150) + (seededRandom(sv) * 150 - 75)); }
        data.push({ label, value: val, isDummy: wo > 0 });
    }
    return data;
}

// Month chart (FIXED: bar chart with month labels)
function updateMonthRecords() {
    const canvas = document.getElementById('monthChart');
    const data = generateAllMonthsData();
    drawBarChart(canvas, data, d => d.label, d => d.value, 'ml');
}
function generateAllMonthsData() {
    const data = [], today = new Date(), cm = today.getMonth();
    const baselines = {};
    for (let i = 5; i >= 0; i--) {
        let m = cm - i; let y = today.getFullYear();
        if (m < 0) { m += 12; y--; }
        const mName = `${m + 1}月`;
        const isCurrent = i === 0;
        let val;
        if (isCurrent) val = Math.round(appState.today.totalMl || 2000);
        else { const base = 1800 + Math.round(Math.sin(m * .8) * 200); const sv = m * 54321; val = Math.round(base + (seededRandom(sv) * 200 - 100)); }
        val = Math.max(1200, Math.min(2800, val));
        data.push({ label: mName, value: val, isDummy: !isCurrent });
    }
    return data;
}

// Milk chart
function generateMilkDataForDay(dk) {
    const seeds = { today: 12345, yesterday: 23456, '3daysago': 34567, '4daysago': 45678, '5daysago': 56789, '6daysago': 67890, '7daysago': 78901 };
    const s = seeds[dk] || 12345; const times = [], amounts = [];
    const n = Math.floor(seededRandom(s * 7) * 3) + 5;
    const ph = [6, 8, 10, 12, 14, 16, 18, 20, 22];
    for (let i = 0; i < n && i < ph.length; i++) {
        const min = Math.floor(seededRandom(s * 31 + i * 17) * 60);
        times.push(`${String(ph[i]).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
        amounts.push(Math.floor(seededRandom(s * 43 + i * 29) * 100) + 100);
    }
    return { times, amounts };
}
const globalMilkPatterns = {};
['today', 'yesterday', '3daysago', '4daysago', '5daysago', '6daysago', '7daysago'].forEach(k => globalMilkPatterns[k] = generateMilkDataForDay(k));

function updateMilkRecords() {
    const activeTab = document.querySelector('.milk-tab.active')?.dataset.milkTab || 'daily';
    document.querySelectorAll('.milk-tab-content').forEach(c => c.style.display = 'none');

    if (activeTab === 'daily') {
        document.getElementById('milkDailyTab').style.display = 'block';
        const canvas = document.getElementById('milkDailyChart');
        const sel = document.querySelector('.milk-independent-section .period-btn.active')?.dataset.milkDaily || 'today';
        const p = globalMilkPatterns[sel] || globalMilkPatterns.today;
        const data = p.times.map((t, i) => ({ label: t, value: p.amounts[i], isDummy: true }));
        if (canvas) drawBarChart(canvas, data, d => d.label, d => d.value, 'ml', 'orange');
    } else if (activeTab === 'week') {
        document.getElementById('milkWeekTab').style.display = 'block';
        const canvas = document.getElementById('milkWeekChart');
        const data = generateAllWeeksData().map(d => ({ ...d, value: Math.max(100, d.value - 800) }));
        if (canvas) drawBarChart(canvas, data, d => d.label, d => d.value, 'ml', 'orange');
    } else if (activeTab === 'month') {
        document.getElementById('milkMonthTab').style.display = 'block';
        const canvas = document.getElementById('milkMonthChart');
        const data = generateAllMonthsData().map(d => ({ ...d, value: Math.max(200, d.value - 1200) }));
        if (canvas) drawBarChart(canvas, data, d => d.label, d => d.value, 'ml', 'orange');
    } else if (activeTab === 'detail') {
        document.getElementById('milkDetailTab').style.display = 'block';
    }
}

// Today chart
function updateTodayChart() {
    const canvas = document.getElementById('todayChart'); if (!canvas) return;
    const slots = Array.from({ length: 24 }, (_, i) => ({ hour: i, ml: 0, hasData: false, isDummy: false }));
    appState.today.history.forEach(e => { const h = parseInt(e.time.split(':')[0]); if (h >= 0 && h < 24) { slots[h].ml += e.ml; slots[h].hasData = true; } });
    const ch = new Date().getHours();
    for (let h = 6; h < ch; h++) {
        if (slots[h] && !slots[h].hasData && todayDummyData[h]) {
            slots[h].ml = todayDummyData[h];
            slots[h].hasData = true; slots[h].isDummy = true;
        }
    }
    const active = slots.filter(s => s.hasData);
    drawBarChart(canvas, active, s => `${s.hour}:00`, s => s.ml, 'ml');
}

// Detail history with random data
function loadDetailHistory(date, isMilk = false) {
    const elId = isMilk ? 'milkHistoryContent' : 'historyContent';
    const canvasId = isMilk ? 'milkDetailChart' : 'detailChart';
    const containerId = isMilk ? 'milkDetailChartContainer' : 'detailChartContainer';
    const colorTheme = isMilk ? 'orange' : 'blue';
    const el = document.getElementById(elId);

    const d = new Date(date); const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const numEntries = Math.floor(seededRandom(seed * 7) * 5) + 4;
    const entries = [];
    for (let i = 0; i < numEntries; i++) {
        const h = Math.floor(seededRandom(seed * 11 + i * 37) * 16) + 6;
        const m = Math.floor(seededRandom(seed * 13 + i * 41) * 60);
        const ml = Math.floor(seededRandom(seed * 17 + i * 53) * 490) + 10;
        entries.push({ time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, ml, type: isMilk ? 'ミルク' : '水分' });
    }
    entries.sort((a, b) => a.time.localeCompare(b.time));
    const total = entries.reduce((s, e) => s + e.ml, 0);
    const dateStr = d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    el.innerHTML = `<div style="text-align:center;margin-bottom:12px;">
    <h4 style="color:var(--primary);font-size:14px;margin-bottom:6px;">${dateStr}の記録</h4>
    <span style="font-size:13px;font-weight:600;color:var(--primary);">合計: ${total}ml</span>
    <span style="font-size:11px;color:var(--text-muted);margin-left:8px;">※ サンプルデータ</span></div>
    <div style="border-top:1px solid var(--border);padding-top:8px;">
    ${entries.map(e => `<div class="history-entry"><span class="entry-time">${e.time}</span>
      <div class="entry-amount"><span>${e.ml}ml</span><span class="entry-type ${isMilk ? 'milk' : ''}">${isMilk ? '🥛' : '💧'} ${e.type}</span></div></div>`).join('')}
    </div>`;

    const container = document.getElementById(containerId);
    if (container) container.style.display = 'block';
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const slots = Array.from({ length: 24 }, (_, i) => ({ hour: i, ml: 0, hasData: false, isDummy: true }));
        entries.forEach(e => {
            const h = parseInt(e.time.split(':')[0]);
            if (h >= 0 && h < 24) { slots[h].ml += e.ml; slots[h].hasData = true; }
        });
        const active = slots.filter(s => s.hasData);
        drawBarChart(canvas, active, s => `${s.hour}:00`, s => s.ml, 'ml', colorTheme);
    }
}

// ===== Goal =====
function updateGoalDisplay() {
    const el = document.getElementById('currentGoalValue'); if (el) el.textContent = appState.settings.goalMl;
    const rec = document.getElementById('recommendedGoal'); if (rec) rec.textContent = calculateRecommendedGoal();
}

// ===== Power Save =====
function togglePowerSave() {
    appState.powerSave.enabled = !appState.powerSave.enabled;
    updatePowerSaveUI(); applyPowerSaveMode();
    showToast(`節電モードを${appState.powerSave.enabled ? 'ON' : 'OFF'}にしました`);
}
function updatePowerSaveUI() {
    const sl = document.getElementById('statusLight'), st = document.getElementById('statusText'),
        tb = document.getElementById('powerToggleBtn'), tt = document.getElementById('toggleText');
    if (appState.powerSave.enabled) { sl.className = 'status-light on'; st.textContent = '節電モード: ON'; tb.className = 'power-toggle-btn on'; tt.textContent = '節電モードをOFFにする'; }
    else { sl.className = 'status-light off'; st.textContent = '節電モード: OFF'; tb.className = 'power-toggle-btn'; tt.textContent = '節電モードをONにする'; }
    const toggle = document.getElementById('timerToggle');
    if (toggle) { if (appState.powerSave.timerEnabled) toggle.classList.add('active'); else toggle.classList.remove('active'); }
}
function applyPowerSaveMode() { const a = document.querySelector('.app'); appState.powerSave.enabled ? a.classList.add('power-save-mode') : a.classList.remove('power-save-mode'); }

// ===== Filter =====
function updateFilterDates() {
    const d = new Date(appState.filter.lastReplacementDate); d.setMonth(d.getMonth() + appState.filter.intervalMonths);
    appState.filter.nextReplacementDate = d.toISOString().split('T')[0];
    document.getElementById('filterModel').textContent = appState.filter.model;
    document.getElementById('lastReplacementDate').textContent = appState.filter.lastReplacementDate;
    document.getElementById('nextReplacementDate').textContent = appState.filter.nextReplacementDate;
}

// ===== Profile =====
function loadProfileToForm(isOb) {
    const pf = isOb ? 'onboarding' : 'profile';
    const map = { Name: 'name', Address: 'address', Birth: 'birth', Sex: 'sex', Height: 'heightCm', Weight: 'weightKg', Activity: 'activity' };
    Object.entries(map).forEach(([k, v]) => { const el = document.getElementById(`${pf}${k}`); if (el) el.value = appState.profile[v] || ''; });
}
function saveProfileFromForm(isOb) {
    const pf = isOb ? 'onboarding' : 'profile';
    const map = { Name: 'name', Address: 'address', Birth: 'birth', Sex: 'sex', Height: 'heightCm', Weight: 'weightKg', Activity: 'activity' };
    Object.entries(map).forEach(([k, v]) => {
        const el = document.getElementById(`${pf}${k}`); if (el) {
            if (v === 'heightCm' || v === 'weightKg') appState.profile[v] = parseInt(el.value) || 0;
            else appState.profile[v] = el.value;
        }
    });
    if (appState.profile.weightKg > 0) { appState.settings.goalMl = calculateRecommendedGoal(); updateUI(); }
}

// ===== Weight Chart =====
function updateWeightChart() {
    const canvas = document.getElementById('weightChartCanvas'); if (!canvas) return;
    const today = new Date(); const data = [];
    // Realistic weight data: gradual change with small daily fluctuations
    const baseWeight = appState.profile.weightKg || 65;
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        // Slow downward trend (-0.05kg/day) with daily noise
        const trend = -0.05 * (29 - i) / 29;
        const noise = Math.sin(i * 0.5) * 0.3 + (seededRandom(i * 123) - 0.5) * 0.8;
        data.push({ date: d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }), weight: parseFloat((baseWeight + trend + noise).toFixed(1)) });
    }
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth, h = canvas.height = 200, p = 40;
    const cw = w - p * 2, ch = h - p * 2;
    ctx.clearRect(0, 0, w, h);
    const weights = data.map(d => d.weight), minW = Math.min(...weights) - 0.5, maxW = Math.max(...weights) + 0.5, range = maxW - minW;
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p, h - p); ctx.lineTo(w - p, h - p); ctx.stroke();
    // Line
    ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2; ctx.beginPath();
    data.forEach((d, i) => { const x = p + (i / (data.length - 1)) * cw, y = h - p - ((d.weight - minW) / range) * ch; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    // Points
    data.forEach((d, i) => {
        const x = p + (i / (data.length - 1)) * cw, y = h - p - ((d.weight - minW) / range) * ch;
        ctx.fillStyle = '#0ea5e9'; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    // Labels
    ctx.fillStyle = '#64748b'; ctx.font = '9px Inter,sans-serif'; ctx.textAlign = 'center';
    for (let i = 0; i < data.length; i += 7) { const x = p + (i / (data.length - 1)) * cw; ctx.fillText(data[i].date, x, h - 8); }
    ctx.textAlign = 'right'; ctx.fillText(`${maxW.toFixed(1)}kg`, p - 4, p + 4); ctx.fillText(`${minW.toFixed(1)}kg`, p - 4, h - p + 4);
    ctx.fillStyle = '#0ea5e9'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.fillText('過去30日間の体重変化', w / 2, 16);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter,sans-serif'; ctx.fillText('※ サンプルデータ', w / 2, h - 2);
}

// ===== Column Cards =====
function renderColumnCards() {
    const container = document.getElementById('columnCardsList'); if (!container) return;
    container.innerHTML = columnArticles.map(a => `<div class="column-card" data-article-id="${a.id}">
    <h4>${a.icon} ${a.title}</h4><p class="preview">${a.preview}</p>
    <span class="read-more">もっと見る →</span></div>`).join('');
    container.querySelectorAll('.column-card').forEach(card => card.addEventListener('click', () => {
        const id = parseInt(card.dataset.articleId); const art = columnArticles.find(a => a.id === id); if (!art) return;
        document.getElementById('columnListView').classList.add('hidden');
        const dv = document.getElementById('columnDetailView'); dv.classList.remove('hidden');
        document.getElementById('columnDetailTitle').textContent = `${art.icon} ${art.title}`;
        document.getElementById('columnDetailBody').innerHTML = art.body;
    }));
}

// ===== Share Records =====
function shareRecords() {
    const msg = `💧 PureNext水分管理\n今日の摂取量: ${appState.today.totalMl}ml / ${appState.settings.goalMl}ml\n達成率: ${Math.round((appState.today.totalMl / appState.settings.goalMl) * 100)}%\n#PureNext`;
    if (navigator.share) navigator.share({ title: 'PureNext', text: msg }).catch(() => { });
    else navigator.clipboard.writeText(msg).then(() => showToast('クリップボードにコピーしました'));
}

// ===== Group ID =====
function generateGroupId() { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let r = ''; for (let i = 0; i < 8; i++)r += c[Math.floor(Math.random() * c.length)]; return r; }

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', function () {
    // Onboarding
    if (!appState.onboardingCompleted) { document.getElementById('onboardingModal').classList.remove('hidden'); loadProfileToForm(true); }

    // Footer nav
    document.querySelectorAll('[data-screen]').forEach(tab => tab.addEventListener('click', function () { showScreen(this.dataset.screen); }));

    // Notify toggle
    document.getElementById('notifyToggle').addEventListener('click', function () {
        appState.settings.notifyEnabled = !appState.settings.notifyEnabled;
        this.textContent = appState.settings.notifyEnabled ? '通知' : 'OFF';
        this.style.opacity = appState.settings.notifyEnabled ? '1' : '.6';
        showToast(appState.settings.notifyEnabled ? '通知ON' : '通知OFF');
    });

    // Pour button
    const spb = document.getElementById('sidePourButton');
    if (spb) {
        let pt;
        spb.addEventListener('mousedown', function () { pt = setTimeout(() => startPouring(this), 100); });
        spb.addEventListener('mouseup', () => { clearTimeout(pt); stopPouring(); });
        spb.addEventListener('mouseleave', () => { clearTimeout(pt); stopPouring(); });
        spb.addEventListener('touchstart', function (e) { e.preventDefault(); pt = setTimeout(() => startPouring(this), 100); });
        spb.addEventListener('touchend', e => { e.preventDefault(); clearTimeout(pt); stopPouring(); });
    }

    // Preset buttons
    document.querySelectorAll('.side-preset-btn[data-ml]').forEach(btn => btn.addEventListener('click', function () { addPreset(parseInt(this.dataset.ml)); }));

    // Custom (keypad) button
    document.getElementById('sideCustomBtn')?.addEventListener('click', () => {
        showKeypad('飲んだ量を入力', 'ml', (val) => {
            const ml = Math.round(val); if (ml > 0) addPreset(ml);
        });
    });

    // Onboarding
    document.getElementById('saveOnboardingBtn').addEventListener('click', () => {
        saveProfileFromForm(true); appState.onboardingCompleted = true;
        document.getElementById('onboardingModal').classList.add('hidden');
        showToast('プロフィールを保存しました');
    });
    document.getElementById('skipOnboardingBtn').addEventListener('click', () => {
        appState.onboardingCompleted = true; document.getElementById('onboardingModal').classList.add('hidden');
    });

    // Records tabs (upper only)
    document.querySelectorAll('.records-header .records-tab').forEach(tab => tab.addEventListener('click', function () {
        document.querySelectorAll('.records-header .records-tab').forEach(t => t.classList.remove('active')); this.classList.add('active');
        document.querySelectorAll('.records-content > .tab-content').forEach(c => c.classList.remove('active'));
        const targetTab = document.getElementById(`${this.dataset.tab}Tab`);
        if (targetTab) targetTab.classList.add('active');
        updateRecordsContent(this.dataset.tab);
    }));

    // Period buttons
    document.querySelectorAll('.period-btn').forEach(btn => btn.addEventListener('click', function () {
        const cont = this.closest('.daily-selector,.week-selector,.month-selector,.milk-independent-section');
        if (cont) {
            cont.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');
            if (cont.classList.contains('milk-independent-section') || this.dataset.milkDaily) updateMilkRecords();
            else updateRecordsContent(getCurrentTab());
        }
    }));

    // Goal
    const gs = document.getElementById('goalSlider'), gi = document.getElementById('goalInput');
    if (gs && gi) {
        gs.addEventListener('input', function () { gi.value = this.value; appState.settings.goalMl = parseInt(this.value); updateGoalDisplay(); updateUI(); });
        gi.addEventListener('input', function () { const v = parseInt(this.value); if (v >= 800 && v <= 5000) { gs.value = v; appState.settings.goalMl = v; updateGoalDisplay(); updateUI(); } });
    }
    document.getElementById('saveGoalBtn')?.addEventListener('click', () => showToast('目標を保存しました'));

    // Power save
    document.getElementById('powerToggleBtn')?.addEventListener('click', togglePowerSave);
    document.getElementById('timerToggle')?.addEventListener('click', function () {
        appState.powerSave.timerEnabled = !appState.powerSave.timerEnabled;
        this.classList.toggle('active');
        showToast(`タイマー${appState.powerSave.timerEnabled ? 'ON' : 'OFF'}`);
    });
    document.getElementById('saveTimerBtn')?.addEventListener('click', () => {
        appState.powerSave.startTime = document.getElementById('startTime').value;
        appState.powerSave.endTime = document.getElementById('endTime').value;
        appState.powerSave.timerEnabled = true;
        document.getElementById('timerToggle')?.classList.add('active');
        const days = []; document.querySelectorAll('.weekday-btn.active').forEach(b => days.push(parseInt(b.dataset.day)));
        appState.powerSave.activeDays = days;
        showToast('タイマー設定を保存しました');
    });
    document.getElementById('clearTimerBtn')?.addEventListener('click', () => {
        appState.powerSave.timerEnabled = false;
        document.getElementById('timerToggle')?.classList.remove('active');
        document.getElementById('startTime').value = '22:00'; document.getElementById('endTime').value = '06:00';
        document.querySelectorAll('.weekday-btn').forEach(b => b.classList.add('active'));
        showToast('タイマーをクリアしました');
    });
    document.querySelectorAll('.weekday-btn').forEach(b => b.addEventListener('click', function () { this.classList.toggle('active'); }));

    // Profile
    document.getElementById('saveProfileBtn')?.addEventListener('click', () => { saveProfileFromForm(false); showToast('保存しました'); });
    document.getElementById('recalcBtn')?.addEventListener('click', () => {
        const rec = calculateRecommendedGoal(); appState.settings.goalMl = rec;
        if (gs) gs.value = rec; if (gi) gi.value = rec; updateGoalDisplay(); updateUI();
        showToast(`推奨値 ${rec}ml を適用しました`);
    });

    // Weight keypad
    document.getElementById('openWeightKeypad')?.addEventListener('click', () => {
        showKeypad('今日の体重を入力', 'kg', (val) => {
            document.getElementById('weightDisplayValue').textContent = `${val} kg`;
            showToast('体重を記録しました');
            updateWeightChart();
        }, true);
    });

    // Detail history
    document.getElementById('loadHistoryBtn')?.addEventListener('click', () => {
        const d = document.getElementById('historyDate').value;
        if (!d) { showToast('日付を選択してください'); return; }
        loadDetailHistory(d, false);
    });
    document.getElementById('historyDate').value = new Date().toISOString().split('T')[0];

    document.getElementById('loadMilkHistoryBtn')?.addEventListener('click', () => {
        const d = document.getElementById('milkHistoryDate').value;
        if (!d) { showToast('日付を選択してください'); return; }
        loadDetailHistory(d, true);
    });
    const mDate = document.getElementById('milkHistoryDate');
    if (mDate) mDate.value = new Date().toISOString().split('T')[0];

    // Milk Tabs
    document.querySelectorAll('.milk-tab').forEach(tab => tab.addEventListener('click', function () {
        document.querySelectorAll('.milk-tab').forEach(t => t.classList.remove('active')); this.classList.add('active');
        updateMilkRecords();
    }));

    // Share button
    document.getElementById('shareRecordsBtn')?.addEventListener('click', showSharePopup);

    // Group sharing
    document.getElementById('enableGroupSharing')?.addEventListener('change', function () {
        const show = this.checked;
        ['groupIdSection', 'joinGroupSection', 'groupMembersSection'].forEach(id => {
            const el = document.getElementById(id); if (el) show ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
    });
    document.getElementById('generateGroupIdBtn')?.addEventListener('click', () => {
        const gid = generateGroupId();
        document.getElementById('groupId').value = gid;
        generateQRCode(gid, document.getElementById('qrCodeArea'));
        showToast('グループIDを生成しました');
    });
    document.getElementById('joinGroupBtn')?.addEventListener('click', () => {
        const jid = document.getElementById('joinGroupId').value.trim();
        if (!jid || jid.length !== 8) { showToast('有効なグループIDを入力してください'); return; }
        document.getElementById('groupId').value = jid;
        document.getElementById('joinGroupId').value = '';
        document.getElementById('groupMembersList').innerHTML = `
      <div class="member-item"><span class="member-name">自分</span><span class="member-status">オンライン</span></div>
      <div class="member-item"><span class="member-name">グループオーナー</span><span class="member-status">オンライン</span></div>`;
        showToast('グループに参加しました');
    });

    // Filter & contract buttons
    document.getElementById('filterPurchaseBtn')?.addEventListener('click', () => showToast('購入ページに移動します'));
    document.getElementById('repairRequestBtn')?.addEventListener('click', () => showToast('修理依頼を受け付けました'));
    document.getElementById('contractContactBtn')?.addEventListener('click', () => showToast('メールアプリが開きます'));
    document.getElementById('contractInviteBtn')?.addEventListener('click', () => {
        const msg = 'PureNext水分管理アプリを使ってみませんか？\nhttps://purenext-app.com';
        if (navigator.share) navigator.share({ title: 'PureNext', text: msg }).catch(() => { });
        else navigator.clipboard.writeText(msg).then(() => showToast('招待メッセージをコピーしました'));
    });

    // Column back buttons
    const goBack = () => {
        document.getElementById('columnDetailView').classList.add('hidden');
        document.getElementById('columnListView').classList.remove('hidden');
    };
    document.getElementById('columnBackBtn')?.addEventListener('click', goBack);
    document.getElementById('columnBackBtnBottom')?.addEventListener('click', goBack);

    // Init
    updateUI(); updateGoalDisplay(); updateWeightChart();
    updatePowerSaveUI(); applyPowerSaveMode();
    renderColumnCards();
    setInterval(() => {/* timer check */
        if (!appState.powerSave.timerEnabled) return;
        const now = new Date(), ct = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (!appState.powerSave.activeDays.includes(now.getDay())) return;
        const s = appState.powerSave.startTime, e = appState.powerSave.endTime;
        let on = s <= e ? (ct >= s && ct < e) : (ct >= s || ct < e);
        if (on !== appState.powerSave.enabled) { appState.powerSave.enabled = on; updatePowerSaveUI(); applyPowerSaveMode(); }
    }, 60000);
});
