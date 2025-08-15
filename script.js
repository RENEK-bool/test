// 图片点击放大功能 - 增强版
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const closeBtn = document.getElementsByClassName('close')[0];
            const zoomInBtn = document.getElementById('zoomIn');
            const zoomOutBtn = document.getElementById('zoomOut');
            const resetZoomBtn = document.getElementById('resetZoom');
            const zoomLevel = document.getElementById('zoomLevel');
            const prevBtn = document.getElementById('prevImage');
            const nextBtn = document.getElementById('nextImage');
            
            let currentZoom = 1;
            let isDragging = false;
            let dragStartX, dragStartY;
            let imageStartX, imageStartY;
            let allImages = [];
            let currentImageIndex = 0;
            
            // 获取所有图片
            function initImageList() {
                allImages = Array.from(document.querySelectorAll('.figure-img'));
            }
            
            // 更新导航按钮状态
            function updateNavButtons() {
                prevBtn.classList.toggle('disabled', currentImageIndex === 0);
                nextBtn.classList.toggle('disabled', currentImageIndex === allImages.length - 1);
            }
            
            // 更新缩放显示
            function updateZoomDisplay() {
                zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
                // 设置鼠标样式
                modalImg.style.cursor = isDragging ? 'grabbing' : 'grab';
            }
            
            // 显示指定索引的图片
            function showImageAtIndex(index) {
                if (index >= 0 && index < allImages.length) {
                    currentImageIndex = index;
                    modalImg.src = allImages[index].src;
                    resetZoom();
                    updateNavButtons();
                }
            }
            
            // 重置缩放和位置
            function resetZoom() {
                currentZoom = 1;
                modalImg.style.transform = 'translate(-50%, -50%) scale(1)';
                modalImg.style.left = '50%';
                modalImg.style.top = '50%';
                updateZoomDisplay();
            }
            
            // 缩放函数
            function zoomImage(factor) {
                const oldZoom = currentZoom;
                currentZoom *= factor;
                currentZoom = Math.max(0.1, Math.min(currentZoom, 5));
                
                if (currentZoom !== oldZoom) {
                    // 获取当前位置
                    const rect = modalImg.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // 计算新的位置偏移
                    const viewportCenterX = window.innerWidth / 2;
                    const viewportCenterY = window.innerHeight / 2;
                    
                    const offsetX = centerX - viewportCenterX;
                    const offsetY = centerY - viewportCenterY;
                    
                    // 应用新的变换
                    modalImg.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${currentZoom})`;
                    modalImg.style.left = '50%';
                    modalImg.style.top = '50%';
                    
                    updateZoomDisplay();
                }
            }
            
            // 初始化图片列表
            initImageList();
            
            // 为所有图片添加点击事件
            allImages.forEach(function(img, index) {
                img.addEventListener('click', function() {
                    modal.style.display = 'block';
                    currentImageIndex = index;
                    modalImg.src = this.src;
                    resetZoom();
                    updateNavButtons();
                });
            });
            
            // 导航按钮事件
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentImageIndex > 0) {
                    showImageAtIndex(currentImageIndex - 1);
                }
            });
            
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentImageIndex < allImages.length - 1) {
                    showImageAtIndex(currentImageIndex + 1);
                }
            });
            
            // 缩放控制按钮
            zoomInBtn.addEventListener('click', () => zoomImage(1.2));
            zoomOutBtn.addEventListener('click', () => zoomImage(0.8));
            resetZoomBtn.addEventListener('click', resetZoom);
            
            // 鼠标滚轮缩放
            modalImg.addEventListener('wheel', function(e) {
                e.preventDefault();
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                zoomImage(zoomFactor);
            });
            
            // 改进的拖拽功能 - 任何缩放级别都可以拖拽
            modalImg.addEventListener('mousedown', function(e) {
                e.preventDefault();
                isDragging = true;
                
                // 记录拖拽开始时的鼠标位置
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // 记录拖拽开始时图片的位置
                const rect = modalImg.getBoundingClientRect();
                imageStartX = rect.left + rect.width / 2;
                imageStartY = rect.top + rect.height / 2;
                
                modalImg.classList.add('dragging');
                updateZoomDisplay();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    // 计算鼠标移动的距离
                    const deltaX = e.clientX - dragStartX;
                    const deltaY = e.clientY - dragStartY;
                    
                    // 计算图片新的中心位置
                    const newCenterX = imageStartX + deltaX;
                    const newCenterY = imageStartY + deltaY;
                    
                    // 计算相对于视口中心的偏移
                    const viewportCenterX = window.innerWidth / 2;
                    const viewportCenterY = window.innerHeight / 2;
                    
                    const offsetX = newCenterX - viewportCenterX;
                    const offsetY = newCenterY - viewportCenterY;
                    
                    // 更新图片位置
                    modalImg.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${currentZoom})`;
                    modalImg.style.left = '50%';
                    modalImg.style.top = '50%';
                }
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    modalImg.classList.remove('dragging');
                    updateZoomDisplay();
                }
            });
            
            // 关闭模态框
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                resetZoom();
            });
            
            // 点击模态框外部关闭
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    resetZoom();
                }
            });
            
            // ESC键关闭
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    modal.style.display = 'none';
                    resetZoom();
                }
                // 快捷键支持
                if (modal.style.display === 'block') {
                    if (event.key === '+' || event.key === '=') {
                        event.preventDefault();
                        zoomImage(1.2);
                    } else if (event.key === '-') {
                        event.preventDefault();
                        zoomImage(0.8);
                    } else if (event.key === '0') {
                        event.preventDefault();
                        resetZoom();
                    } else if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        if (currentImageIndex > 0) {
                            showImageAtIndex(currentImageIndex - 1);
                        }
                    } else if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        if (currentImageIndex < allImages.length - 1) {
                            showImageAtIndex(currentImageIndex + 1);
                        }
                    }
                }
            });
            
            // 防止图片拖拽的默认行为
            modalImg.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        });


// ===== Enhanced Sidebar + Theme =====
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        // Apply saved theme or prefer scheme
        try {
            const saved = localStorage.getItem('report-theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = saved || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
        } catch {}

        const tocLinks = Array.from(document.querySelectorAll('.toc-item a'));
        const sections = tocLinks.map(a => document.getElementById(a.getAttribute('data-target'))).filter(Boolean);
        function setActive(link){ tocLinks.forEach(l=>l.classList.remove('active')); if(link) link.classList.add('active'); }

        // Click to scroll
        tocLinks.forEach(link=>{
            link.addEventListener('click', function(e){
                e.preventDefault();
                const id = this.getAttribute('data-target');
                const el = document.getElementById(id);
                if(!el) return;
                const rect = el.getBoundingClientRect();
                const absoluteY = (window.scrollY || window.pageYOffset) + rect.top - 12;
                window.history.replaceState(null, '', '#' + id);
                window.scrollTo({ top: absoluteY, behavior: 'smooth' });
                setActive(this);
            });
        });

        // IntersectionObserver (kept), plus scroll-based rAF highlight for robustness
        if(sections.length){
            const observer = new IntersectionObserver((entries)=>{
                let best=null;
                for(const entry of entries){
                    if(entry.isIntersecting){
                        if(!best || entry.intersectionRatio>best.intersectionRatio) best=entry;
                    }
                }
                if(best){
                    const id = best.target.id;
                    const activeLink = tocLinks.find(a=>a.getAttribute('data-target')===id);
                    setActive(activeLink);
                }
            }, { root:null, rootMargin:'-30% 0px -55% 0px', threshold:[0.1,0.25,0.5,0.75] });
            sections.forEach(sec=>observer.observe(sec));
        }

        // rAF-throttled scroll handler: pick the section nearest viewport center
        let ticking = false;
        function updateActiveByScroll(){
            if(!sections.length) return;
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const viewportCenter = scrollY + window.innerHeight * 0.38; // slightly above center feels better
            let bestSec = null;
            let bestDist = Infinity;
            for(const sec of sections){
                const rect = sec.getBoundingClientRect();
                const secCenter = scrollY + rect.top + (rect.height || 0) / 2;
                const visible = rect.bottom > 80 && rect.top < window.innerHeight * 0.85;
                if(!visible) continue;
                const dist = Math.abs(secCenter - viewportCenter);
                if(dist < bestDist){ bestDist = dist; bestSec = sec; }
            }
            if(bestSec){
                const id = bestSec.id;
                const activeLink = tocLinks.find(a=>a.getAttribute('data-target')===id);
                setActive(activeLink);
            }
        }
        function onScroll(){
            if(!ticking){
                ticking = true;
                requestAnimationFrame(()=>{ updateActiveByScroll(); ticking = false; });
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        // Initial sync
        updateActiveByScroll();

        // Sidebar toggle (mobile)
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if(toggleBtn && sidebar){
            if(!sidebar.id){ sidebar.id = 'sidebar'; }
            toggleBtn.setAttribute('aria-haspopup','true');
            toggleBtn.setAttribute('aria-controls', sidebar.id);
            toggleBtn.setAttribute('aria-expanded','false');
            const toggle = ()=>{
                const opened = sidebar.classList.toggle('open');
                document.body.classList.toggle('sidebar-open', opened);
                toggleBtn.setAttribute('aria-expanded', opened ? 'true':'false');
            };
            toggleBtn.addEventListener('click', (e)=>{ e.stopPropagation(); toggle(); });
            toggleBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'|| e.key===' '){ e.preventDefault(); toggle(); }});
            tocLinks.forEach(l=> l.addEventListener('click', ()=>{ sidebar.classList.remove('open'); document.body.classList.remove('sidebar-open'); toggleBtn.setAttribute('aria-expanded','false'); }));
            // 点击页面空白关闭
            document.addEventListener('click', (e)=>{
                if(!sidebar.contains(e.target) && e.target!==toggleBtn){
                    if(sidebar.classList.contains('open')){ sidebar.classList.remove('open'); document.body.classList.remove('sidebar-open'); toggleBtn.setAttribute('aria-expanded','false'); }
                }
            });
        } else {
            try { console.warn('[report] 未找到 sidebar 或 toggleBtn', {sidebar: !!sidebar, toggle: !!toggleBtn}); } catch {}

        // Add theme toggle button
        const themeBtn = document.createElement('button');
        themeBtn.setAttribute('aria-label','切换主题');
        themeBtn.style.position='fixed'; themeBtn.style.right='16px'; themeBtn.style.bottom='16px'; themeBtn.style.zIndex='1000';
        themeBtn.style.width='44px'; themeBtn.style.height='44px'; themeBtn.style.borderRadius='50%'; themeBtn.style.border='1px solid var(--border)';
        themeBtn.style.background='var(--surface)'; themeBtn.style.color='var(--text)'; themeBtn.style.boxShadow='0 10px 25px rgba(0,0,0,.35)';
        themeBtn.textContent = '🌓';
        themeBtn.addEventListener('click', ()=>{
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('report-theme', next); } catch {}
        });
        document.body.appendChild(themeBtn);
    });
})();
