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
        
        // 2. 将内容注入，但此时<script>标签不会执行
        mainContent.innerHTML = content;

        // 3. 手动处理并执行脚本，确保正确的执行顺序
        const scripts = Array.from(mainContent.getElementsByTagName('script'));
        const externalScripts = scripts.filter(s => s.src);
        const inlineScripts = scripts.filter(s => !s.src);

        // 创建一个Promise来加载外部脚本并等待它们完成
        const loadExternalScripts = Promise.all(
            externalScripts.map(script => {
                return new Promise((resolve, reject) => {
                    const newScript = document.createElement('script');
                    newScript.src = script.src;
                    newScript.onload = resolve; // 脚本加载成功时，Promise完成
                    newScript.onerror = reject;  // 脚本加载失败时，Promise失败
                    document.head.appendChild(newScript);
                });
            })
        );

        // 等待所有外部脚本加载完毕后，再执行内联脚本
        await loadExternalScripts;
        inlineScripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.innerHTML;
            document.body.appendChild(newScript); // 将内联脚本添加到body以执行
        });

        // 4. 根据页面ID分配主题 (这部分逻辑不变)
        let themeFile = '';
        let themeClass = '';

        if (pageId.startsWith('passion_') || pageId.startsWith('wilderness_')) {
            themeFile = 'theme-light-blue.css';
            themeClass = 'theme-light-blue';
        } else if (pageId.startsWith('memo_')) {
            themeFile = 'theme-white.css';
            themeClass = 'theme-white';
        } else {
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
                case 'memories':
                    themeFile = 'theme-white.css';
                    themeClass = 'theme-white';
                    break;
                case 'community':
                case 'invitation':
                case 'resources':
                default:
                    themeFile = 'theme-dark.css';
                    themeClass = 'theme-dark';
                    break;
            }
        }

        // 5. 应用主题样式和body类
        themeStylesheet.href = `css/${themeFile}`;
        body.className = themeClass;

        // 6. 更新导航和页面状态
        updateNavLinks(pageId);
        currentPage = pageId;
        window.scrollTo(0, 0);

    } catch (error) {
        console.error('页面加载或脚本执行失败:', error);
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