/* ============ ابزارها ============ */
const $ = id => document.getElementById(id);
const fa = n => n.toLocaleString('fa-IR');

/* ============ تاریخ ============ */
const WEEK_DAYS = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
const WEEK_KEYS = ['sun','mon','tue','wed','thu','fri','sat'];

function todayKey(){
  const d = new Date().getDay(); // 0=Sunday
  return WEEK_KEYS[d];
}

function setDate(){
  const d = new Date();
  const fmt = new Intl.DateTimeFormat('fa-IR',{
    weekday:'long', day:'numeric', month:'long'
  }).format(d);
  $('date').textContent = fmt;
  $('todayName').textContent = WEEK_DAYS[d.getDay()];
}

/* ============ ادعیه هفته ============ */
const DUAS = {
  sat: {
    name:'شنبه',
    title:'یا رَبَّ الْعَالَمِین',
    ar: 'اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِي هَذَا صَلَاحًا وَآخِرَهُ فَلَاحًا، وَ ذَكِّرْنِي بِرَحْمَتِكَ وَ لَا تُنْسِنِي ذِكْرَكَ، يَا رَبَّ الْعَالَمِينَ',
    fa: 'خدایا! آغاز این روزم را نیکی و پایانش را رستگاری قرار ده. مرا به رحمتت یادآور شو و ذکر خود را از یادم مبر. ای پروردگار جهانیان.'
  },
  sun: {
    name:'یکشنبه',
    title:'یا ذَا الْجَلَالِ وَالْإِکْرَام',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الْعَظِيمِ الْأَعْظَمِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، أَنْ تُصَلِّيَ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَ أَنْ تَغْفِرَ لِي ذُنُوبِي',
    fa: 'خدایا! از تو می‌خواهم به بزرگ‌ترین نامت، ای صاحب جلال و بزرگواری، که بر محمد و خاندانش درود فرستی و گناهانم را بیامرزی.'
  },
  mon: {
    name:'دوشنبه',
    title:'یا قَاضِیَ الْحَاجَات',
    ar: 'اللَّهُمَّ اقْضِ لِي فِي هَذَا الْيَوْمِ حَاجَتِي، وَ لَا تُخَيِّبْ فِيهِ رَجَائِي، يَا قَاضِيَ الْحَاجَاتِ',
    fa: 'خدایا! در این روز حاجتم را برآورده کن و امیدم را ناامید مگردان. ای برآورنده حاجات.'
  },
  tue: {
    name:'سه‌شنبه',
    title:'یا أَرْحَمَ الرَّاحِمِین',
    ar: 'اللَّهُمَّ ارْحَمْنِي بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، وَ اغْفِرْ لِي، يَا أَرْحَمَ الرَّاحِمِينَ',
    fa: 'خدایا! به رحمتی که همه چیز را فرا گرفته، بر من رحم کن و مرا ببخش. ای مهربان‌ترین مهربانان.'
  },
  wed: {
    name:'چهارشنبه',
    title:'یا حَیُّ یا قَیُّوم',
    ar: 'يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، فَأَصْلِحْ لِي شَأْنِي كُلَّهُ، وَ لَا تَكِلْنِي إِلَىٰ نَفْسِي',
    fa: 'ای زنده، ای پایدار! به رحمتت پناه می‌آورم. همه کارهایم را سامان ده و مرا به خودم وامگذار.'
  },
  thu: {
    name:'پنجشنبه',
    title:'یا رَازِقَ الرَّازِقِین',
    ar: 'اللَّهُمَّ ارْزُقْنِي رِزْقًا حَلَالًا طَيِّبًا، وَ بَارِكْ لِي فِيمَا رَزَقْتَنِي، يَا رَازِقَ الرَّازِقِينَ',
    fa: 'خدایا! رزقی حلال و پاک روزیم کن و در آنچه روزی‌ام داده‌ای برکت بگذار. ای روزی‌دهنده روزی‌دهندگان.'
  },
  fri: {
    name:'جمعه',
    title:'یا الله یا رَبَّ الْأَرْبَاب',
    ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَ عَجِّلْ فَرَجَهُمْ، وَ اجْعَلْنِي مِنْ أَنْصَارِهِمْ وَ أَشْيَاعِهِمْ',
    fa: 'خدایا! بر محمد و خاندانش درود فرست، در گشایش کارشان تعجیل کن، و مرا از یاران و پیروانشان قرار ده.'
  }
};

function renderWeek(){
  const list = $('weekList');
  list.innerHTML = '';
  const order = ['sat','sun','mon','tue','wed','thu','fri'];

  order.forEach(key => {
    const d = DUAS[key];
    const el = document.createElement('div');
    el.className = 'week-item glass';
    el.innerHTML = `
      <div class="week-head">
        <div>
          <div class="week-name">${d.name}</div>
          <div class="week-title">${d.title}</div>
        </div>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      <div class="week-ar">${d.ar}</div>
      <div class="week-fa">${d.fa}</div>
    `;
    el.addEventListener('click', () => el.classList.toggle('open'));
    list.appendChild(el);
  });

  // دعای امروز
  const t = DUAS[todayKey()];
  if (t){
    $('todayBadge').textContent = `دعای روز ${t.name}`;
    $('todayDuaAr').textContent = t.ar;
    $('todayDuaFa').textContent = t.fa;
  }
}

/* ============ ناوبری تب‌ها ============ */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tab = $('tab-' + name);
  const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  try{ localStorage.setItem('zekr.lastTab', name); }catch{}
}

document.querySelectorAll('.tab-btn').forEach(b => {
  b.addEventListener('click', () => switchTab(b.dataset.tab));
});
document.querySelectorAll('[data-go]').forEach(b => {
  b.addEventListener('click', () => switchTab(b.dataset.go));
});

/* ============ صلوات شمار ============ */
const ST = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }catch{return d;} },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
};

function todayStamp(){ return new Date().toISOString().slice(0,10); }

let salawat = {
  total: ST.get('zekr.salawat.total', 0),
  today: ST.get('zekr.salawat.today', 0),
  todayStamp: ST.get('zekr.salawat.todayStamp', todayStamp()),
  session: 0
};
if (salawat.todayStamp !== todayStamp()){
  salawat.today = 0;
  salawat.todayStamp = todayStamp();
  ST.set('zekr.salawat.today', 0);
  ST.set('zekr.salawat.todayStamp', salawat.todayStamp);
}

function renderSalawat(){
  $('salawatTotal').textContent = fa(salawat.total);
  $('salawatToday').textContent = fa(salawat.today);
  $('salawatSession').textContent = fa(salawat.session);
}

const salawatBtn = $('salawatBtn');
salawatBtn.addEventListener('click', () => {
  salawat.total++; salawat.today++; salawat.session++;
  ST.set('zekr.salawat.total', salawat.total);
  ST.set('zekr.salawat.today', salawat.today);
  renderSalawat();
  vibrate(15);
  salawatBtn.classList.add('pressed');
  setTimeout(()=>salawatBtn.classList.remove('pressed'), 130);
});

$('resetSession').addEventListener('click', () => {
  salawat.session = 0;
  renderSalawat();
});
$('resetAll').addEventListener('click', () => {
  if (!confirm('همه صلوات‌ها پاک شود؟')) return;
  salawat.total = 0; salawat.today = 0; salawat.session = 0;
  ST.set('zekr.salawat.total', 0);
  ST.set('zekr.salawat.today', 0);
  renderSalawat();
});

/* ============ تسبیح ============ */
let tasbih = { count: ST.get('zekr.tasbih.count', 0), round: ST.get('zekr.tasbih.round', 0) };
let currentDhikr = ST.get('zekr.tasbih.dhikr', 'سُبْحَانَ اللَّهِ');

document.querySelectorAll('.pill').forEach(p => {
  if (p.dataset.dhikr === currentDhikr) p.classList.add('active');
  else p.classList.remove('active');
  p.addEventListener('click', () => {
    currentDhikr = p.dataset.dhikr;
    ST.set('zekr.tasbih.dhikr', currentDhikr);
    $('dhikrText').textContent = currentDhikr;
    document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
  });
});
$('dhikrText').textContent = currentDhikr;

function renderTasbih(){
  $('tasbihCount').textContent = fa(tasbih.count);
  $('tasbihRound').textContent = fa(tasbih.round);
}

const tasbihBtn = $('tasbihBtn');
tasbihBtn.addEventListener('click', () => {
  tasbih.count++;
  if (tasbih.count % 33 === 0){
    tasbih.round++;
    vibrate([20,40,20]);
  } else {
    vibrate(12);
  }
  ST.set('zekr.tasbih.count', tasbih.count);
  ST.set('zekr.tasbih.round', tasbih.round);
  renderTasbih();
  tasbihBtn.classList.add('pressed');
  setTimeout(()=>tasbihBtn.classList.remove('pressed'), 130);
});

$('resetTasbih').addEventListener('click', () => {
  if (!confirm('شمارش تسبیح صفر شود؟')) return;
  tasbih.count = 0; tasbih.round = 0;
  ST.set('zekr.tasbih.count', 0);
  ST.set('zekr.tasbih.round', 0);
  renderTasbih();
});

/* ============ لرزش ============ */
function vibrate(p){
  if (navigator.vibrate) try{ navigator.vibrate(p); }catch{}
}

/* ============ ستاره‌ها ============ */
(function makeStars(){
  const wrap = $('stars');
  const n = 40;
  for (let i=0;i<n;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.animationDelay = (Math.random()*3.5) + 's';
    const scale = 0.6 + Math.random()*1.6;
    s.style.transform = `scale(${scale})`;
    wrap.appendChild(s);
  }
})();

/* ============ راه‌اندازی ============ */
setDate();
renderWeek();
renderSalawat();
renderTasbih();

const last = ST.get('zekr.lastTab', 'home');
switchTab(last);

/* ============ Service Worker ============ */
if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
