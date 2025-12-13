// 管理后台商品页面的 Vue 应用脚本
// 说明：通过 axios 与后端 Admin/Product 控制器交互，使用 bootstrap modal 显示编辑/添加表单。
// 依赖：axios、jQuery、Bootstrap 的 modal、全局 toast 辅助函数 showErrorToast/showBasicToast。

const app = Vue.createApp({
    data() {
        return {
            // productVM 用于绑定模态框表单（创建/更新）
            productVM: {
                id: 0,
                name: '',
                description: '',
                value: 0
            },
            // 模态框标题，用于区分添加或修改
            title: '',
            // 页面全局加载状态，避免重复请求或显示加载指示
            loading: false,
            // 从后端加载的商品列表
            products: []
        }
    },
    methods: {
        // GET /admin/products
        // 获取商品列表并填充 products 数组。
        // 成功时将 res.data.data 赋值给 products，失败时展示错误 toast。
        getProducts() {
            this.loading = true;
            axios.get('/admin/products')
                .then(res => {
                    // 返回的 DTO 通常包装在 data 字段内
                    this.products = res.data.data;
                })
                .catch(err => {
                    // 后端返回的错误信息展示
                    showErrorToast(err.response.data.message);
                })
                .then(() => {
                    // 无论成功或失败都将 loading 置为 false
                    this.loading = false;
                });
        },

        // GET /admin/products/{id}
        // 根据 id 获取单个商品详情（用于打开修改模态框时填充表单）
        getProduct(id) {
            this.loading = true;
            axios.get('/admin/products/' + id)
                .then(res => {
                    // 将返回的数据映射到本地的 productVM
                    this.productVM = {
                        id: id,
                        name: res.data.data.name,
                        description: res.data.data.description,
                        value: res.data.data.value
                    };
                })
                .catch(err => {
                    showErrorToast(err.response.data.message);
                })
                .then(() => {
                    this.loading = false;
                });
        },

        // POST /admin/products
        // 提交 productVM 创建新商品
        createProduct() {
            this.loading = true;
            axios.post('/admin/products', this.productVM)
                .then(res => {
                    console.log(res)
                    this.requestSuccess(res)
                })
                .catch(err => {
                    showErrorToast(err.response.data.message);
                })
                .then(() => {
                    this.loading = false;
                });

            // 请求完成后刷新列表（注意：refreshProducts 内有延迟逻辑）
            this.refreshProducts();
        },

        // PUT /admin/products
        // 提交 productVM 更新商品（后端通过 DTO 判断并更新）
        updateProduct() {
            this.loading = true;
            axios.put('/admin/products', this.productVM)
                .then(res => {
                    this.requestSuccess(res)
                })
                .catch(err => {
                    showErrorToast(err.response.data.message);
                })
                .then(() => {
                    this.loading = false;
                });

            // 请求完成后刷新列表
            this.refreshProducts();
        },

        // 设置模态框标题（"添加商品" 或 "修改商品"）
        setTitle(title) {
            this.title = title;
        },

        // 刷新商品列表：如果当前处于 loading，则在 1 秒后尝试获取列表（用于等待后端更新完成）
        // 注意：当前条件是 if (this.loading) 才触发刷新，若希望立即刷新应检查 !this.loading 或直接调用 getProducts。
        refreshProducts() {
            if (this.loading) {
                setTimeout(() => {
                    this.getProducts();
                }, 1000)
            }
        },

        // 通用请求成功处理：显示提示、关闭模态框并重置表单
        requestSuccess(res) {
            showBasicToast(res.data.message);
            $('#productModal').modal('hide');
            this.closeModal()
        },

        // 打开修改模态框：设置标题、加载商品数据并弹出模态框
        openUpdateModal(id) {
            this.setTitle('修改商品');
            this.getProduct(id);
            $('#productModal').modal('show');
        },

        // 根据当前 title 决定保存动作：添加或修改
        saveProduct() {
            switch (this.title) {
                case '添加商品':
                    this.createProduct()
                    break;
                case '修改商品':
                    this.updateProduct()
                    break;
                default:
                    break;
            }
        },

        // 关闭模态框时重置 productVM 为初始状态
        closeModal() {
            this.productVM = {
                id: 0,
                name: '',
                description: '',
                value: 0
            }
        }
    },
    mounted() {
        // 组件挂载后立即获取商品列表
        this.getProducts();
    }
});

app.mount('#app');