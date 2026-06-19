// Initial Mock Data
const defaultProducts = [
  { id: 1, name: 'حذاء نايك إير ماكس', price: 450, category: 'رياضي', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'حذاء كلاسيك أكسفورد', price: 620, category: 'كلاسيك', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'حذاء كاجوال بني', price: 380, category: 'كاجوال', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'حذاء رياضي كونفيرس', price: 290, category: 'رياضي', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop' }
];

// App State
let products = JSON.parse(localStorage.getItem('almohammadi_products')) || defaultProducts;

const saveProducts = () => {
  localStorage.setItem('almohammadi_products', JSON.stringify(products));
};

// If no products in local storage, initialize with default
if (!localStorage.getItem('almohammadi_products')) {
  saveProducts();
}

// Router
const appContainer = document.getElementById('app');

const navigate = () => {
  const hash = window.location.hash || '#/';
  appContainer.innerHTML = ''; // Clear current view
  
  if (hash === '#/') {
    renderStoreFront();
  } else if (hash === '#/login') {
    renderAdminLogin();
  } else if (hash === '#/admin') {
    if (sessionStorage.getItem('almohammadi_admin_logged') === 'true') {
      renderAdminDashboard();
    } else {
      window.location.hash = '#/login';
    }
  } else {
    window.location.hash = '#/';
  }
};

window.addEventListener('hashchange', navigate);

// UI Components
const createHeader = (isAdmin = false) => {
  return `
    <header class="glass">
      <div class="logo">
        <i class="fa-solid fa-shoe-prints"></i>
        أحذية المحمدي
      </div>
      <div class="header-actions">
        ${!isAdmin ? `
          <a href="#/login" class="btn btn-icon" title="لوحة التحكم">
            <i class="fa-solid fa-user-shield"></i>
          </a>
          <button class="btn btn-primary btn-icon">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        ` : `
          <a href="#/" class="btn btn-outline">
            <i class="fa-solid fa-store"></i> العودة للمتجر
          </a>
          <button onclick="logout()" class="btn btn-danger">
            <i class="fa-solid fa-right-from-bracket"></i> خروج
          </button>
        `}
      </div>
    </header>
  `;
};

const createFooter = () => {
  return `
    <footer>
      <p>جميع الحقوق محفوظة &copy; 2026 أحذية المحمدي.</p>
    </footer>
  `;
};

const showToast = (message, type = 'success') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
    ${message}
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// StoreFront View
const renderStoreFront = () => {
  appContainer.innerHTML = `
    ${createHeader(false)}
    
    <section class="hero">
      <div class="hero-blob"></div>
      <div class="hero-content">
        <h1>اكتشف الفخامة في <br><span class="text-gradient">كل خطوة</span></h1>
        <p>تشكيلة واسعة من أرقى وأحدث الأحذية تناسب جميع الأذواق. صُممت لراحتك وأناقتك معاً.</p>
        <button class="btn btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior: 'smooth'})">
          تصفح المنتجات <i class="fa-solid fa-arrow-down"></i>
        </button>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" alt="Hero Shoe">
      </div>
    </section>

    <section id="products" class="products-section">
      <h2 class="section-title">أحدث التشكيلات</h2>
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-card glass">
            <div class="product-image-container">
              <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300?text=بدون+صورة'">
            </div>
            <div class="product-info">
              <div class="product-category">${p.category}</div>
              <h3 class="product-title">${p.name}</h3>
              <div class="product-price">${p.price} ريال</div>
              <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart('${p.name}')">
                  <i class="fa-solid fa-cart-plus"></i> إضافة
                </button>
              </div>
            </div>
          </div>
        `).join('')}
        ${products.length === 0 ? '<p style="text-align: center; width: 100%; color: var(--text-secondary);">لا توجد منتجات حالياً.</p>' : ''}
      </div>
    </section>
    
    ${createFooter()}
  `;
};

window.addToCart = (name) => {
  showToast(`تم إضافة ${name} إلى السلة!`);
};

// Admin Login View
const renderAdminLogin = () => {
  appContainer.innerHTML = `
    ${createHeader(false)}
    <div class="admin-login-container">
      <div class="login-box glass">
        <div class="login-icon">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h2 style="margin-bottom: 2rem;">تسجيل الدخول للإدارة</h2>
        <form id="loginForm" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label">كلمة المرور</label>
            <input type="password" id="passwordInput" class="form-control" placeholder="أدخل كلمة المرور" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            دخول <i class="fa-solid fa-arrow-left"></i>
          </button>
        </form>
      </div>
    </div>
  `;
};

window.handleLogin = (e) => {
  e.preventDefault();
  const pass = document.getElementById('passwordInput').value;
  if (pass === 'العالمي') {
    sessionStorage.setItem('almohammadi_admin_logged', 'true');
    showToast('تم تسجيل الدخول بنجاح');
    window.location.hash = '#/admin';
  } else {
    showToast('كلمة المرور غير صحيحة', 'error');
  }
};

window.logout = () => {
  sessionStorage.removeItem('almohammadi_admin_logged');
  window.location.hash = '#/login';
};

// Admin Dashboard View
let editingId = null;

const renderAdminDashboard = () => {
  appContainer.innerHTML = `
    ${createHeader(true)}
    
    <div class="admin-dashboard">
      <div class="admin-header">
        <h2>إدارة المنتجات</h2>
        <button class="btn btn-primary" onclick="openModal()">
          <i class="fa-solid fa-plus"></i> إضافة منتج جديد
        </button>
      </div>
      
      <div class="table-container glass">
        <table>
          <thead>
            <tr>
              <th>صورة</th>
              <th>اسم المنتج</th>
              <th>التصنيف</th>
              <th>السعر</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><img src="${p.image}" class="prod-img-cell" onerror="this.src='https://via.placeholder.com/150?text=No+Img'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.price} ريال</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-icon" onclick="editProduct(${p.id})" style="background: rgba(16, 185, 129, 0.2); color: var(--success); border-color: transparent;">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-icon" onclick="deleteProduct(${p.id})" style="background: rgba(239, 68, 68, 0.2); color: var(--danger); border-color: transparent;">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
            ${products.length === 0 ? '<tr><td colspan="5" style="text-align: center;">لا توجد منتجات.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->
    <div class="modal-overlay" id="productModal">
      <div class="modal-content glass">
        <div class="modal-header">
          <h3 id="modalTitle">إضافة منتج</h3>
          <button class="modal-close" onclick="closeModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="productForm" onsubmit="saveProduct(event)">
          <div class="form-group">
            <label class="form-label">اسم المنتج</label>
            <input type="text" id="prodName" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">التصنيف (رياضي، كلاسيك..)</label>
            <input type="text" id="prodCat" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">السعر (ريال)</label>
            <input type="number" id="prodPrice" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">رابط الصورة (URL)</label>
            <input type="url" id="prodImage" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
            حفظ <i class="fa-solid fa-check"></i>
          </button>
        </form>
      </div>
    </div>
    
    ${createFooter()}
  `;
};

// Modal Logic
window.openModal = () => {
  editingId = null;
  document.getElementById('modalTitle').innerText = 'إضافة منتج جديد';
  document.getElementById('productForm').reset();
  document.getElementById('productModal').classList.add('active');
};

window.closeModal = () => {
  document.getElementById('productModal').classList.remove('active');
};

window.editProduct = (id) => {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  
  editingId = id;
  document.getElementById('modalTitle').innerText = 'تعديل منتج';
  document.getElementById('prodName').value = prod.name;
  document.getElementById('prodCat').value = prod.category;
  document.getElementById('prodPrice').value = prod.price;
  document.getElementById('prodImage').value = prod.image;
  
  document.getElementById('productModal').classList.add('active');
};

window.saveProduct = (e) => {
  e.preventDefault();
  
  const name = document.getElementById('prodName').value;
  const category = document.getElementById('prodCat').value;
  const price = document.getElementById('prodPrice').value;
  const image = document.getElementById('prodImage').value;
  
  if (editingId) {
    // Edit
    const index = products.findIndex(p => p.id === editingId);
    if (index > -1) {
      products[index] = { ...products[index], name, category, price, image };
      showToast('تم تعديل المنتج بنجاح');
    }
  } else {
    // Add
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, category, price, image });
    showToast('تم إضافة المنتج بنجاح');
  }
  
  saveProducts();
  closeModal();
  renderAdminDashboard(); // re-render
};

window.deleteProduct = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    showToast('تم حذف المنتج', 'success');
    renderAdminDashboard(); // re-render
  }
};

// Start the app
navigate();
