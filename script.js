// ===================== DATA =====================
const services = [
  { id: 1, icon: '🏠', name: 'Home Deep Cleaning',   desc: 'Complete home sanitization with eco-friendly products', price: 1499, duration: '3-4 hrs', cat: 'home'    },
  { id: 2, icon: '🔧', name: 'AC Servicing',          desc: 'Filter cleaning, gas refill check & performance boost',  price: 799,  duration: '1-2 hrs', cat: 'home'    },
  { id: 3, icon: '💇', name: 'Hair Styling & Spa',    desc: 'Cut, color, keratin treatment by expert stylists',        price: 1299, duration: '2 hrs',   cat: 'beauty'  },
  { id: 4, icon: '💆', name: 'Full Body Massage',     desc: 'Relaxing aromatherapy & deep tissue massage',             price: 1799, duration: '90 min', cat: 'beauty'  },
  { id: 5, icon: '💻', name: 'PC/Laptop Repair',      desc: 'Virus removal, hardware fix, speed optimization',         price: 599,  duration: '1-3 hrs', cat: 'tech'    },
  { id: 6, icon: '📱', name: 'Phone Screen Repair',   desc: 'Cracked screen replacement, battery & charging fix',      price: 899,  duration: '45 min', cat: 'tech'    },
  { id: 7, icon: '🏃', name: 'Personal Training',     desc: '1-on-1 fitness session with certified trainer',           price: 999,  duration: '60 min', cat: 'fitness' },
  { id: 8, icon: '🧘', name: 'Yoga & Meditation',     desc: 'Morning yoga flow + breathing techniques',                price: 699,  duration: '75 min', cat: 'fitness' },
];

const adminData = [
  { ref: 'SX-001842', name: 'Priya Patel',   service: 'Home Deep Cleaning', date: 'May 02, 10:00 AM', amount: '₹1,768', status: 'confirmed' },
  { ref: 'SX-001841', name: 'Arjun Mehta',   service: 'AC Servicing',       date: 'May 02, 11:30 AM', amount: '₹942',   status: 'pending'   },
  { ref: 'SX-001840', name: 'Sneha Joshi',   service: 'Hair Styling & Spa', date: 'May 01, 2:00 PM',  amount: '₹1,533', status: 'confirmed' },
  { ref: 'SX-001839', name: 'Vikram Singh',  service: 'Personal Training',  date: 'May 01, 7:00 AM',  amount: '₹1,178', status: 'confirmed' },
  { ref: 'SX-001838', name: 'Kavya Nair',    service: 'Full Body Massage',  date: 'Apr 30, 4:00 PM',  amount: '₹2,122', status: 'cancelled' },
  { ref: 'SX-001837', name: 'Rohan Gupta',   service: 'PC/Laptop Repair',   date: 'Apr 30, 12:00 PM', amount: '₹706',   status: 'confirmed' },
];

// ===================== STATE =====================
let cart          = [];
let selectedDate  = null;
let selectedTime  = null;
let currentFilter = 'all';
let discount      = 0;

// ===================== NAVIGATION =====================
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');

  if (id === 'booking') renderCart();
  if (id === 'payment') updatePaymentSummary();
  if (id === 'admin')   renderAdmin();
}

// ===================== SERVICES =====================
function renderServices() {
  const grid     = document.getElementById('servicesGrid');
  const filtered = currentFilter === 'all'
    ? services
    : services.filter(s => s.cat === currentFilter);

  grid.innerHTML = filtered.map(s => {
    const inCart = cart.find(c => c.id === s.id);
    return `<div class="service-card">
      <div class="svc-icon">${s.icon}</div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-desc">${s.desc}</div>
      <div class="svc-meta">
        <div class="svc-price">₹${s.price.toLocaleString('en-IN')}<span>/visit</span></div>
        <div class="svc-duration">${s.duration}</div>
      </div>
      <button class="add-btn ${inCart ? 'added' : ''}" onclick="toggleCart(${s.id}, this)">
        ${inCart ? '✓ Added to Cart' : '+ Add to Cart'}
      </button>
    </div>`;
  }).join('');
}

function filterServices(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderServices();
}

function toggleCart(id, btn) {
  const svc = services.find(s => s.id === id);
  const idx  = cart.findIndex(c => c.id === id);

  if (idx > -1) {
    cart.splice(idx, 1);
    btn.textContent = '+ Add to Cart';
    btn.classList.remove('added');
    showToast('Removed from cart');
  } else {
    cart.push({ ...svc });
    btn.textContent = '✓ Added to Cart';
    btn.classList.add('added');
    showToast('Added to cart!');
  }

  document.getElementById('cartCount').textContent = cart.length;
}

// ===================== CART =====================
function renderCart() {
  const el = document.getElementById('cartItems');

  if (!cart.length) {
    el.innerHTML = '<div class="empty-cart">No services added yet</div>';
    updateTotals(0);
    return;
  }

  el.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.icon} ${c.name}</div>
        <div class="cart-item-meta">${c.duration}</div>
      </div>
      <div style="display:flex;align-items:center;gap:4px">
        <div class="cart-item-price">₹${c.price.toLocaleString('en-IN')}</div>
        <button class="remove-btn" onclick="removeFromCart(${c.id})">×</button>
      </div>
    </div>`).join('');

  const sub = cart.reduce((s, c) => s + c.price, 0);
  updateTotals(sub);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  document.getElementById('cartCount').textContent = cart.length;
  renderCart();
  renderServices();
}

function updateTotals(sub) {
  const gst   = Math.round(sub * 0.18);
  const total  = sub + gst;
  document.getElementById('subtotal').textContent   = '₹' + sub.toLocaleString('en-IN');
  document.getElementById('gstAmt').textContent     = '₹' + gst.toLocaleString('en-IN');
  document.getElementById('grandTotal').textContent = '₹' + total.toLocaleString('en-IN');
}

// ===================== DATE & TIME PICKER =====================
function renderDateGrid() {
  const grid  = document.getElementById('dateGrid');
  const days  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = new Date();
  let html    = '';

  for (let i = 0; i < 7; i++) {
    const d       = new Date(today);
    d.setDate(today.getDate() + i);
    const isToday = i === 0;

    html += `<div class="date-cell ${isToday ? 'today' : ''}"
      onclick="selectDate(this, '${d.toDateString()}')">
      <div class="day">${days[d.getDay()]}</div>
      <div class="num">${d.getDate()}</div>
    </div>`;
  }

  grid.innerHTML = html;
}

function selectDate(el, date) {
  document.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedDate = date;
}

function renderTimeGrid() {
  const times = [
    '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
    '1:00 PM','2:00 PM','3:00 PM','4:00 PM',
    '5:00 PM','6:00 PM','7:00 PM','8:00 PM'
  ];
  const taken = [2, 5, 8];

  document.getElementById('timeGrid').innerHTML = times.map((t, i) => `
    <div class="time-slot ${taken.includes(i) ? 'taken' : ''}"
      onclick="${!taken.includes(i) ? `selectTime(this,'${t}')` : ''}">
      ${t}
    </div>`).join('');
}

function selectTime(el, time) {
  document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = time;
}

// ===================== BOOKING =====================
function goToPayment() {
  if (!cart.length) { showToast('Please add services first!'); return; }
  showPage('payment', document.querySelectorAll('.nav-tab')[2]);
}

// ===================== PAYMENT =====================
function updatePaymentSummary() {
  const sub  = cart.reduce((s, c) => s + c.price, 0);
  const gst  = Math.round(sub * 0.18);
  const disc = Math.round(sub * discount);
  const total = sub + gst - disc;

  document.getElementById('paySubtotal').textContent = '₹' + sub.toLocaleString('en-IN');
  document.getElementById('payGst').textContent      = '₹' + gst.toLocaleString('en-IN');
  document.getElementById('payTotal').textContent    = '₹' + total.toLocaleString('en-IN');
  document.getElementById('discountAmt').textContent = '-₹' + disc.toLocaleString('en-IN');
  document.getElementById('discountRow').style.display = disc > 0 ? 'flex' : 'none';
}

function selectMethod(el, type) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('cardSection').style.display   = type === 'card'   ? 'block' : 'none';
  document.getElementById('upiSection').style.display    = type === 'upi'    ? 'block' : 'none';
  document.getElementById('walletSection').style.display = type === 'wallet' ? 'block' : 'none';
}

function formatCard(el) {
  const v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
  document.getElementById('cardNumDisplay').textContent =
    (v + '•'.repeat(Math.max(0, 16 - v.length))).replace(/(.{4})/g, '$1 ').trim();
}

function updateCard() {
  const n = document.getElementById('cardName').value || 'YOUR NAME';
  const e = document.getElementById('cardExp').value  || 'MM/YY';
  document.getElementById('cardNameDisplay').textContent = n.toUpperCase();
  document.getElementById('cardExpDisplay').textContent  = e;
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msg  = document.getElementById('promoMsg');

  if (code === 'SAVE20') {
    discount = 0.2;
    msg.textContent = '✓ 20% discount applied!';
    msg.className   = 'promo-msg success';
  } else if (code === 'FIRST50') {
    discount = 0.5;
    msg.textContent = '✓ 50% first-time discount!';
    msg.className   = 'promo-msg success';
  } else {
    discount = 0;
    msg.textContent = '✗ Invalid promo code';
    msg.className   = 'promo-msg error';
  }
  updatePaymentSummary();
}

function processPayment() {
  const btn = document.getElementById('payBtn');
  btn.classList.add('processing');
  btn.textContent = 'Processing...';

  setTimeout(() => {
    document.getElementById('paymentMain').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');

    const ref = 'SX-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('bookingRef').textContent = ref;

    // Add new booking to admin table
    adminData.unshift({
      ref,
      name:    document.getElementById('custName').value || 'Customer',
      service: cart[0]?.name || 'Service',
      date:    selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : 'Scheduled',
      amount:  '₹' + Math.round(cart.reduce((s, c) => s + c.price, 0) * 1.18 * (1 - discount)).toLocaleString('en-IN'),
      status:  'confirmed',
    });

    cart = [];
    document.getElementById('cartCount').textContent = '0';
  }, 2000);
}

function newBooking() {
  document.getElementById('paymentMain').style.display = 'block';
  document.getElementById('successScreen').classList.remove('show');

  const btn = document.getElementById('payBtn');
  btn.classList.remove('processing');
  btn.innerHTML = '🔒 Pay Now';

  discount = 0;
  document.getElementById('promoInput').value = '';
  document.getElementById('promoMsg').textContent = '';

  renderServices();
  showPage('services', document.querySelectorAll('.nav-tab')[0]);
}

// ===================== ADMIN DASHBOARD =====================
function renderAdmin() {
  const confirmed = adminData.filter(b => b.status === 'confirmed').length;
  const pending   = adminData.filter(b => b.status === 'pending').length;

  document.getElementById('totalBookings').textContent = adminData.length;
  document.getElementById('pendingCount').textContent  = pending;
  document.getElementById('totalRevenue').textContent  = '₹' + (confirmed * 1280).toLocaleString('en-IN');

  renderBarChart();
  renderDonut();
  renderTable(adminData);
}

function renderBarChart() {
  const vals   = [8200, 11400, 9800, 15600, 12300, 18900, 14200];
  const days   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const colors = ['#7c6aff','#7c6aff','#7c6aff','#ff6a9e','#7c6aff','#6affcc','#7c6aff'];
  const max    = Math.max(...vals);

  document.getElementById('barChart').innerHTML = vals.map((v, i) =>
    `<div class="bar" data-val="₹${v.toLocaleString('en-IN')}"
      style="height:${Math.round(v / max * 100)}%;background:${colors[i]};opacity:0.85;"></div>`
  ).join('');

  document.getElementById('barLabels').innerHTML = days.map(d =>
    `<span style="font-size:9px;color:var(--muted);flex:1;text-align:center">${d}</span>`
  ).join('');
}

function renderDonut() {
  const data = [
    { label: 'Home',    val: 35, color: '#7c6aff' },
    { label: 'Beauty',  val: 28, color: '#ff6a9e' },
    { label: 'Tech',    val: 22, color: '#6affcc' },
    { label: 'Fitness', val: 15, color: '#ffcc6a' },
  ];

  const svg  = document.getElementById('donutSvg');
  const legend = document.getElementById('donutLegend');
  let path   = '';
  let start  = 0;
  const cx = 45, cy = 45, r = 35, ir = 22;

  data.forEach(d => {
    const angle = d.val / 100 * Math.PI * 2;
    const x1 = cx + r  * Math.sin(start),        y1 = cy - r  * Math.cos(start);
    const x2 = cx + r  * Math.sin(start + angle), y2 = cy - r  * Math.cos(start + angle);
    const x3 = cx + ir * Math.sin(start + angle), y3 = cy - ir * Math.cos(start + angle);
    const x4 = cx + ir * Math.sin(start),         y4 = cy - ir * Math.cos(start);
    const large = angle > Math.PI ? 1 : 0;

    path += `<path d="M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}
      L${x3},${y3} A${ir},${ir} 0 ${large},0 ${x4},${y4} Z"
      fill="${d.color}" opacity="0.85"/>`;
    start += angle;
  });

  svg.innerHTML = path;
  legend.innerHTML = data.map(d =>
    `<div class="legend-item">
      <div class="legend-dot" style="background:${d.color}"></div>
      <span style="color:var(--muted)">${d.label} <strong style="color:var(--text)">${d.val}%</strong></span>
    </div>`
  ).join('');
}

function renderTable(data) {
  document.getElementById('bookingsTableBody').innerHTML = data.map(b => `
    <tr>
      <td style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--accent)">${b.ref}</td>
      <td>${b.name}</td>
      <td>${b.service}</td>
      <td style="color:var(--muted)">${b.date}</td>
      <td style="font-weight:500">${b.amount}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td>
        <button class="action-btn" onclick="showToast('Details opened')">View</button>
        <button class="action-btn" onclick="showToast('Action applied')">Edit</button>
      </td>
    </tr>`).join('');
}

function filterTable(q) {
  const filtered = adminData.filter(b =>
    b.name.toLowerCase().includes(q.toLowerCase()) ||
    b.service.toLowerCase().includes(q.toLowerCase()) ||
    b.ref.toLowerCase().includes(q.toLowerCase())
  );
  renderTable(filtered);
}

// ===================== TOAST =====================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===================== INIT =====================
renderServices();
renderDateGrid();
renderTimeGrid();
