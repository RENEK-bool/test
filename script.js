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


// ===== Enhanced Sidebar + Theme (WeChat Compatible) =====
(function(){
    // 兼容性检查和polyfill
    function isWeChatBrowser() {
        return /micromessenger/i.test(navigator.userAgent);
    }
    
    // Array.from polyfill for older browsers
    if (!Array.from) {
        Array.from = function(arrayLike) {
            var result = [];
            for (var i = 0; i < arrayLike.length; i++) {
                result.push(arrayLike[i]);
            }
            return result;
        };
    }
    
    function initApp() {
        // Apply saved theme or prefer scheme
        try {
            var saved = null;
            try {
                saved = localStorage.getItem('report-theme');
            } catch (e) {
                // localStorage may not be available in some environments
            }
            var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = saved || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
            // Fallback to light theme
            document.documentElement.setAttribute('data-theme', 'light');
        }

        var tocLinks = Array.from(document.querySelectorAll('.toc-item a'));
        var sections = tocLinks.map(function(a) { 
            return document.getElementById(a.getAttribute('data-target')); 
        }).filter(function(el) { return el !== null; });
        
        function setActive(link) { 
            tocLinks.forEach(function(l) { l.classList.remove('active'); }); 
            if(link) link.classList.add('active'); 
        }

        // Click to scroll - 微信兼容版本
        tocLinks.forEach(function(link) {
            // 使用多种事件来确保兼容性
            var events = ['click', 'touchend'];
            events.forEach(function(eventType) {
                link.addEventListener(eventType, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var id = this.getAttribute('data-target');
                    var el = document.getElementById(id);
                    if(!el) return;
                    
                    var rect = el.getBoundingClientRect();
                    var absoluteY = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) + rect.top - 12;
                    
                    // 更新URL hash
                    try {
                        window.history.replaceState(null, '', '#' + id);
                    } catch (e) {
                        // Fallback for environments where history API is not available
                        window.location.hash = id;
                    }
                    
                    // 滚动到目标位置 - 兼容多种方式
                    if (window.scrollTo) {
                        try {
                            window.scrollTo({ top: absoluteY, behavior: 'smooth' });
                        } catch (e) {
                            // Fallback for browsers that don't support smooth scrolling
                            window.scrollTo(0, absoluteY);
                        }
                    } else {
                        document.documentElement.scrollTop = absoluteY;
                        document.body.scrollTop = absoluteY;
                    }
                    
                    setActive(this);
                }, false);
            });
        });

        // IntersectionObserver (kept), plus scroll-based rAF highlight for robustness
        if(sections.length){
            // 检查 IntersectionObserver 支持
            if (window.IntersectionObserver) {
                try {
                    var observer = new IntersectionObserver(function(entries) {
                        var best = null;
                        for(var i = 0; i < entries.length; i++) {
                            var entry = entries[i];
                            if(entry.isIntersecting){
                                if(!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
                            }
                        }
                        if(best){
                            var id = best.target.id;
                            var activeLink = tocLinks.find(function(a) { return a.getAttribute('data-target') === id; });
                            setActive(activeLink);
                        }
                    }, { root: null, rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });
                    sections.forEach(function(sec) { observer.observe(sec); });
                } catch (e) {
                    // IntersectionObserver failed, fallback to scroll-based detection
                }
            }
        }

        // rAF-throttled scroll handler: pick the section nearest viewport center
        var ticking = false;
        function updateActiveByScroll(){
            if(!sections.length) return;
            var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var viewportCenter = scrollY + (window.innerHeight || document.documentElement.clientHeight) * 0.38;
            var bestSec = null;
            var bestDist = Infinity;
            for(var i = 0; i < sections.length; i++) {
                var sec = sections[i];
                var rect = sec.getBoundingClientRect();
                var secCenter = scrollY + rect.top + (rect.height || 0) / 2;
                var visible = rect.bottom > 80 && rect.top < (window.innerHeight || document.documentElement.clientHeight) * 0.85;
                if(!visible) continue;
                var dist = Math.abs(secCenter - viewportCenter);
                if(dist < bestDist){ bestDist = dist; bestSec = sec; }
            }
            if(bestSec){
                var id = bestSec.id;
                var activeLink = tocLinks.find(function(a) { return a.getAttribute('data-target') === id; });
                setActive(activeLink);
            }
        }
        function onScroll(){
            if(!ticking){
                ticking = true;
                if (window.requestAnimationFrame) {
                    requestAnimationFrame(function() { updateActiveByScroll(); ticking = false; });
                } else {
                    setTimeout(function() { updateActiveByScroll(); ticking = false; }, 16);
                }
            }
        }
        window.addEventListener('scroll', onScroll, false);
        // Initial sync
        updateActiveByScroll();

        // Sidebar toggle with overlay support - 微信兼容版本
        var sidebar = document.querySelector('.sidebar');
        var toggleBtn = document.querySelector('.sidebar-toggle');
        
        // Create overlay for mobile
        var overlay = null;
        if ((window.innerWidth || document.documentElement.clientWidth) <= 1024) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
        
        function toggleSidebar() {
            if (sidebar && toggleBtn) {
                var isOpen = sidebar.classList.contains('open');
                if (isOpen) {
                    sidebar.classList.remove('open');
                } else {
                    sidebar.classList.add('open');
                }
                if (overlay) {
                    if (isOpen) {
                        overlay.classList.remove('show');
                    } else {
                        overlay.classList.add('show');
                    }
                }
            }
        }
        
        function closeSidebar() {
            if (sidebar) {
                sidebar.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('show');
                }
            }
        }
        
        if (toggleBtn && sidebar) { 
            // 为微信浏览器添加多种事件监听
            var events = ['click', 'touchend'];
            events.forEach(function(eventType) {
                toggleBtn.addEventListener(eventType, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSidebar();
                }, false);
            });
            
            // Close sidebar when clicking TOC links
            tocLinks.forEach(function(l){ 
                l.addEventListener('click', function(){
                    setTimeout(closeSidebar, 100); // Small delay for smooth transition
                }); 
                // 为触摸设备添加touchend事件
                l.addEventListener('touchend', function(){
                    setTimeout(closeSidebar, 100);
                });
            });
            
            // Close sidebar when clicking overlay
            if (overlay) {
                overlay.addEventListener('click', function(){
                    closeSidebar();
                });
                overlay.addEventListener('touchend', function(){
                    closeSidebar();
                });
            }
            
            // Close sidebar on escape key
            document.addEventListener('keydown', function(e){
                if (e.key === 'Escape' || e.keyCode === 27) {
                    closeSidebar();
                }
            });
        }

        // Add theme toggle button - 微信兼容版本
        var themeBtn = document.createElement('button');
        themeBtn.setAttribute('aria-label','切换主题');
        themeBtn.style.position='fixed'; 
        themeBtn.style.right='16px'; 
        themeBtn.style.bottom='16px'; 
        themeBtn.style.zIndex='1000';
        themeBtn.style.width='44px'; 
        themeBtn.style.height='44px'; 
        themeBtn.style.borderRadius='50%'; 
        themeBtn.style.border='1px solid var(--border)';
        themeBtn.style.background='var(--surface)'; 
        themeBtn.style.color='var(--text)'; 
        themeBtn.style.boxShadow='0 10px 25px rgba(0,0,0,.35)';
        themeBtn.style.cursor='pointer';
        themeBtn.textContent = '🌓';
        
        var themeEvents = ['click', 'touchend'];
        themeEvents.forEach(function(eventType) {
            themeBtn.addEventListener(eventType, function(e){
                e.preventDefault();
                e.stopPropagation();
                var current = document.documentElement.getAttribute('data-theme') || 'light';
                var next = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                try { 
                    localStorage.setItem('report-theme', next); 
                } catch (e) {
                    // localStorage not available
                }
            }, false);
        });
        document.body.appendChild(themeBtn);
    }
    
    // 兼容不同的DOM加载状态
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // DOM already loaded
        initApp();
    }
})();
