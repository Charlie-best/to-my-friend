let currentPage = '';
const navLinks = document.querySelectorAll('.nav-link');
const mainContent = document.getElementById('main-content');
const themeStylesheet = document.getElementById('page-theme-stylesheet');
const body = document.body;

/**
 * 异步加载并显示页面内容及其专属主题样式
 * @param {string} pageId - 要加载的页面的ID
 */
async function loadPage(pageId) {
    if (currentPage === pageId) return;

    try {
        // 1. 加载HTML内容片段
        const response = await fetch(`html/${pageId}.html`);
        if (!response.ok) throw new Error(`无法加载 html/${pageId}.html`);
        const content = await response.text();
        mainContent.innerHTML = content;

        // 2. 根据页面ID分配主题
        // 2. 根据页面ID分配主题
        let themeFile = '';
        let themeClass = '';

        // 新增逻辑：如果是文章页，则使用白色主题
        if (pageId.startsWith('passion_')) {
            themeFile = 'theme-light-blue.css';
            themeClass = 'theme-light-blue';
        }else if(pageId.startsWith('memo_')){
            themeFile = 'theme-white.css';
            themeClass = 'theme-white';
        }else {
            // 否则，使用原来的逻辑
            switch (pageId) {
                case 'home':
                    themeFile = 'theme-summer.css';
                    themeClass = 'theme-summer';
                    break;
                case 'passion':
                case 'wilderness':
                    themeFile = 'theme-light-blue.css';
                    themeClass = 'theme-light-blue';
                    break;
                case 'memories': // 让回忆列表页也使用白色主题
                    themeFile = 'theme-white.css';
                    themeClass = 'theme-white';
                    break;
                case 'invitation':
                case 'resources':
                default:
                    themeFile = 'theme-dark.css';
                    themeClass = 'theme-dark';
                    break;
            }
        }

        // 3. 应用主题样式和body类
        themeStylesheet.href = `css/${themeFile}`;
        body.className = themeClass;

        // 4. 更新导航和页面状态
        updateNavLinks(pageId);
        currentPage = pageId;
        window.scrollTo(0, 0);

    } catch (error) {
        console.error('页面加载失败:', error);
        mainContent.innerHTML = `<div class="page text-center"><h2 class="text-3xl text-red-400">页面加载失败</h2><p class="text-gray-400">请检查文件是否存在或网络连接是否正常。</p></div>`;
    }
}

function updateNavLinks(activePageId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') === `loadPage('${activePageId}')`) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});