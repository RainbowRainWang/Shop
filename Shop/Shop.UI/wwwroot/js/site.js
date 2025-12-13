// 1. 基础Toast生成函数
function showBasicToast(message) {
    const toastHtml = `
                <div class="toast custom-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
                    <div class="toast-header bg-success text-white">
                        <i class="bi bi-check-circle me-2"></i>
                        <strong class="me-auto">操作成功</strong>
                        <small>刚刚</small>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

    showDynamicToast(toastHtml);
}

// 3. 错误提示Toast
function showErrorToast(message) {
    const toastHtml = `
                <div class="toast custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong class="me-auto">错误提示</strong>
                        <small class="text-white-50">警告</small>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

    showDynamicToast(toastHtml, 8000); // 8秒后关闭
}

// 通用的Toast显示函数
function showDynamicToast(html, delay = 5000) {
    const container = document.getElementById('toastContainer');

    // 插入Toast到容器
    container.insertAdjacentHTML('beforeend', html);

    // 获取刚添加的Toast元素
    const toastElement = container.lastElementChild;

    // 设置延迟时间
    if (delay) {
        toastElement.setAttribute('data-bs-delay', delay);
    }

    // 初始化并显示Toast
    const toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: delay || 5000
    });

    toast.show();

    // Toast关闭后清理DOM
    toastElement.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}