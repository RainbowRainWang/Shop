// 创建 app，注册组件，暴露到全局，最后挂载
const app = Vue.createApp({});

// 确保 productComponent 在全局作用域（product-component.js 已先被加载）
if (typeof productComponent !== 'undefined') {
    app.component('product-component', productComponent);
} else {
    console.warn('productComponent 未定义：请确保 product-component.js 在 main.js 之前加载。');
}

// 暴露 app 以便在控制台或其它脚本中访问（可选）
window.app = app;

// 挂载应用
app.mount('#app');