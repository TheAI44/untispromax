(function() {
  console.log('UntisProMax 500-IQ: Final Architecture Loading...');

  const firebaseConfig = {
    apiKey: "AIzaSyBVwK1RTQiDwDT7hNieij8lFFXjXubxEUs",
    authDomain: "untispromax.firebaseapp.com",
    projectId: "untispromax",
    storageBucket: "untispromax.firebasestorage.app",
    messagingSenderId: "518480422318",
    appId: "1:518480422318:web:4fed5668df640ca2b7943f"
  };

  if (typeof firebase === 'undefined') return alert('Firebase Load Error!');

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // --- GLOBAL STATE ---
  window.currentUser = null;
  window.homeworkData = [];
  window.eventsData = [];
  window.currentPage = 'home';
  window.hwFilter = 'upcoming';
  const SERVER_URL = 'https://untispromax-server-1.onrender.com';

  // --- AUTH OBSERVER ---
  auth.onAuthStateChanged(async (fbUser) => {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');

    if (fbUser) {
      console.log('Auth: User confirmed ->', fbUser.email);
      if (authScreen) authScreen.classList.add('hidden');
      if (appScreen) appScreen.classList.remove('hidden');
      
      // Set initial identity
      window.currentUser = { 
        name: fbUser.displayName || fbUser.email.split('@')[0], 
        email: fbUser.email, 
        role: 'user',
        photo: fbUser.photoURL || null
      };
      
      updateUIStrings();
      await fetchOrRepairProfile(fbUser);
      startSync();
      initClock();
      window.goTo('home');
    } else {
      if (authScreen) authScreen.classList.remove('hidden');
      if (appScreen) appScreen.classList.add('hidden');
    }
  });

  async function fetchOrRepairProfile(fbUser) {
    try {
      const snap = await db.collection('appdata').doc('users').get();
      let users = snap.exists() ? (snap.data().value || {}) : {};
      const emailKey = fbUser.email.toLowerCase();

      if (users[emailKey]) {
        window.currentUser = users[emailKey];
        console.log('Profile loaded from DB.');
      } else {
        console.log('Profile missing. Auto-repairing...');
        users[emailKey] = window.currentUser;
        await db.collection('appdata').doc('users').set({ value: users });
      }
      updateUIStrings();
    } catch (e) {
      console.error('Profile Fetch Error:', e);
    }
  }

  function startSync() {
    db.collection('homework').onSnapshot(s => {
      window.homeworkData = s.docs.map(d => d.data());
      renderCurrentPage();
    });
    db.collection('events').onSnapshot(s => {
      window.eventsData = s.docs.map(d => d.data());
      if (window.currentPage === 'events') renderEvents();
    });
  }

  function updateUIStrings() {
    const greet = document.getElementById('homeGreeting');
    const avatar = document.getElementById('topbarAvatar');
    if (greet && window.currentUser) greet.textContent = `Hallo, ${window.currentUser.name}!`;
    if (avatar && window.currentUser) {
      if (window.currentUser.photo) avatar.innerHTML = `<img src="${window.currentUser.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      else avatar.textContent = window.currentUser.name[0].toUpperCase();
    }
  }

  function initClock() {
    const tick = () => {
      const now = new Date();
      const d = document.getElementById('homeDate'), c = document.getElementById('homeClock');
      if (d) d.textContent = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
      if (c) c.textContent = now.toLocaleTimeString('de-DE');
    };
    tick(); setInterval(tick, 1000);
  }

  // --- NAVIGATION & RENDERING ---
  window.goTo = (p) => {
    window.currentPage = p;
    document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(p + 'Page')?.classList.add('active');
    document.getElementById('nav-' + p)?.classList.add('active');
    document.getElementById('topbarTitle').textContent = p.toUpperCase();
    
    const fab = document.getElementById('fabBtn');
    if (fab) fab.style.display = (['homework', 'tests', 'events'].includes(p)) ? 'flex' : 'none';
    
    renderCurrentPage();
  };

  function renderCurrentPage() {
    if (window.currentPage === 'home') renderHome();
    if (window.currentPage === 'homework') renderHW();
    if (window.currentPage === 'tests') renderTests();
    if (window.currentPage === 'timetable') renderTimetable();
  }

  window.renderHome = () => {
    const el = document.getElementById('homeHwList');
    if (!el || !window.homeworkData) return;
    const list = window.homeworkData.filter(h => !h.done).sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
    el.innerHTML = list.map(h => `
      <div class="card ${h.type==='Test'?'urgent':''}">
        <div class="card-row">
          <div class="card-title">${h.subject}</div>
          <div class="badge ${h.type==='Test'?'badge-danger':'badge-accent'}">${h.date}</div>
        </div>
        <div class="card-sub">${h.desc}</div>
      </div>
    `).join('') || '<div class="empty-state">Alles erledigt!</div>';
  };

  window.renderHW = () => {
    const el = document.getElementById('hwList');
    if (!el) return;
    const filtered = window.homeworkData.filter(h => h.type !== 'Test' && (window.hwFilter === 'done' ? h.done : !h.done));
    el.innerHTML = filtered.map(h => `<div class="card"><div class="card-title">${h.subject} (${h.date})</div><div class="card-sub">${h.desc}</div></div>`).join('') || '<div class="empty-state">Keine Aufgaben</div>';
  };

  window.renderTests = () => {
    const el = document.getElementById('testList');
    if (el) el.innerHTML = window.homeworkData.filter(h => h.type === 'Test').map(h => `<div class="card urgent"><div class="card-title">${h.subject} (${h.date})</div><div class="card-sub">${h.desc}</div></div>`).join('') || '<div class="empty-state">Keine Tests</div>';
  };

  window.setHwFilter = (f) => {
    window.hwFilter = f;
    document.getElementById('hwFilterUpcoming')?.classList.toggle('active', f==='upcoming');
    document.getElementById('hwFilterDone')?.classList.toggle('active', f==='done');
    window.renderHW();
  };

  async function renderTimetable() {
    const el = document.getElementById('ttContent');
    if (!el) return;
    el.innerHTML = '<div class="spinner"></div>';
    try {
      const res = await fetch(`${SERVER_URL}/timetable`);
      const data = await res.json();
      el.innerHTML = `<pre style="font-size:0.7rem; color:var(--text-secondary); background:rgba(0,0,0,0.2); padding:10px; border-radius:10px;">${JSON.stringify(data, null, 2)}</pre>`;
    } catch(e) { el.innerHTML = '<div class="error-state">Server nicht erreichbar</div>'; }
  }

  // --- AUTH ACTIONS ---
  window.doLogin = async () => {
    const e = document.getElementById('loginEmail').value.trim();
    const p = document.getElementById('loginPassword').value;
    if (!e || !p) return alert('Bitte Felder ausfüllen!');
    try { await auth.signInWithEmailAndPassword(e, p); } catch(err) { alert(err.message); }
  };

  window.signupStep1 = () => {
    const e = document.getElementById('regEmail').value.trim();
    const p = document.getElementById('regPassword').value;
    if(!e || !p) return alert('Pflichtfelder!');
    window.signupTempEmail = e; window.signupTempPw = p; window.showStep(2);
  };

  window.signupStep3 = () => {
    const code = document.getElementById('classCode').value.trim().toUpperCase();
    if (code === 'HLG1' || code === 'ADMIN1') { window.signupIsAdmin = (code === 'ADMIN1'); window.showStep(3); }
    else alert('Falscher Code!');
  };

  window.signupStep3b = async () => {
    const name = document.getElementById('regName').value.trim();
    if(!name) return alert('Name fehlt!');
    try {
      const cred = await auth.createUserWithEmailAndPassword(window.signupTempEmail, window.signupTempPw);
      const snap = await db.collection('appdata').doc('users').get();
      let users = snap.exists() ? snap.data().value : {};
      users[window.signupTempEmail.toLowerCase()] = { email: window.signupTempEmail, name, role: window.signupIsAdmin?'admin':'user', id: cred.user.uid, photo: null };
      await db.collection('appdata').doc('users').set({ value: users });
    } catch(err) { alert(err.message); }
  };

  window.logout = () => auth.signOut().then(() => location.reload());

  // --- UI HELPERS ---
  window.switchTab = (m) => {
    document.getElementById('loginForm').style.display = m === 'login' ? 'block' : 'none';
    document.getElementById('signupFlow').style.display = m === 'signup' ? 'block' : 'none';
    document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', (i === 0) === (m === 'login')));
  };
  window.showStep = (n) => {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById(`step${i}`);
      const dot = document.getElementById(`dot${i}`);
      if (el) el.style.display = i === n ? 'block' : 'none';
      if (dot) dot.className = `step-dot${i < n ? ' done' : i === n ? ' active' : ''}`;
    }
  };
  window.openModal = (id) => document.getElementById(id).classList.remove('hidden');
  window.closeModal = (id) => document.getElementById(id).classList.add('hidden');
  window.closeIfBackdrop = (e, id) => { if (e.target.id === id) window.closeModal(id); };
  window.toggleMehrMenu = () => document.getElementById('mehrPopup').classList.toggle('hidden');
  window.mehrGoTo = (p) => { document.getElementById('mehrPopup').classList.add('hidden'); window.goTo(p); };
  window.openSettings = () => window.openModal('settingsOverlay');

})();
