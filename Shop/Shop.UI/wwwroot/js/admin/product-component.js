// 精简、现代化的 product-component（Vue 3 Options API + async/await）
// 特点：统一错误处理、Bootstrap 5 原生 Modal API 优先、表单校验、立即刷新列表

const productComponent = {
    template: `
    <div class="product-admin">
        <div class="d-flex mb-3 gap-2">
            <button class="btn btn-success" @click="getProducts" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                搜索
            </button>

            <button type="button" class="btn btn-primary" @click="openCreateModal">
                添加
            </button>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>商品名</th>
                    <th>价格</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="products.length === 0">
                    <td colspan="4" class="text-center text-muted">暂无数据</td>
                </tr>
                <tr v-for="(p, i) in products" :key="p.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ p.name }}</td>
                    <td>￥ {{ p.value }}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" @click="openUpdateModal(p.id)">修改</button>
                        <button class="btn btn-sm btn-danger" @click="confirmDelete(p.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true" ref="productModalEl">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEdit ? '修改商品' : '添加商品' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <div class="mb-3" v-if="isEdit">
                            <label class="form-label">商品ID</label>
                            <input class="form-control" v-model="productVM.id" disabled />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">商品名</label>
                            <input type="text" class="form-control" v-model.trim="productVM.name" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">价格</label>
                            <input type="number" class="form-control" v-model.number="productVM.value" min="0" step="0.01" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">简介</label>
                            <textarea class="form-control" rows="3" v-model="productVM.description"></textarea>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">关闭</button>
                        <button type="button" class="btn btn-primary" :disabled="submitting" @click="saveProduct">
                            <span v-if="submitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            productVM: this.emptyProduct(),
            products: [],
            loading: false,
            submitting: false
        };
    },
    computed: {
        isEdit() {
            return !!(this.productVM && this.productVM.id && this.productVM.id > 0);
        }
    },
    methods: {
        emptyProduct() {
            return { id: 0, name: '', description: '', value: 0 };
        },

        async getProducts() {
            this.loading = true;
            try {
                const res = await axios.get('/admin/products');
                this.products = (res?.data?.data) || [];
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },

        async getProduct(id) {
            this.loading = true;
            try {
                const res = await axios.get(`/admin/products/${id}`);
                const d = res?.data?.data;
                if (d) {
                    this.productVM = {
                        id: d.id ?? id,
                        name: d.name ?? '',
                        description: d.description ?? '',
                        value: d.value ?? 0
                    };
                } else {
                    showErrorToast('未找到商品数据');
                }
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },

        validateProduct() {
            if (!this.productVM.name || !this.productVM.name.trim()) {
                showErrorToast('请填写商品名');
                return false;
            }
            if (this.productVM.value == null || isNaN(this.productVM.value)) {
                showErrorToast('请填写正确的价格');
                return false;
            }
            return true;
        },

        async createProduct() {
            if (!this.validateProduct()) return;
            this.submitting = true;
            try {
                const res = await axios.post('/admin/products', this.productVM);
                showBasicToast(res?.data?.message || '创建成功');
                this.closeBootstrapModal();
                await this.getProducts();
            } catch (err) {
                this.handleError(err);
            } finally {
                this.submitting = false;
            }
        },

        async updateProduct() {
            if (!this.validateProduct()) return;
            this.submitting = true;
            try {
                const res = await axios.put('/admin/products', this.productVM);
                showBasicToast(res?.data?.message || '更新成功');
                this.closeBootstrapModal();
                await this.getProducts();
            } catch (err) {
                this.handleError(err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteProduct(id) {
            this.loading = true;
            try {
                const res = await axios.delete(`/admin/products/${id}`);
                showBasicToast(res?.data?.message || '删除成功');
                await this.getProducts();
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },

        openCreateModal() {
            this.productVM = this.emptyProduct();
            this.showBootstrapModal();
        },

        async openUpdateModal(id) {
            await this.getProduct(id);
            this.showBootstrapModal();
        },

        confirmDelete(id) {
            if (confirm('确定要删除此商品吗？')) {
                this.deleteProduct(id);
            }
        },

        saveProduct() {
            if (this.isEdit) {
                this.updateProduct();
            } else {
                this.createProduct();
            }
        },

        closeModal() {
            this.productVM = this.emptyProduct();
            this.closeBootstrapModal();
        },

        handleError(err) {
            const message = err?.response?.data?.message || err?.message || '请求失败';
            showErrorToast(message);
            console.error(err);
        },

        // Bootstrap 5 原生 Modal API 优先，回退 jQuery
        showBootstrapModal() {
            const el = this.$refs.productModalEl;
            if (!el) return;
            if (window.bootstrap && bootstrap.Modal) {
                let instance = bootstrap.Modal.getInstance(el);
                if (!instance) instance = new bootstrap.Modal(el);
                instance.show();
                return;
            }
            if (window.$ && typeof window.$ === 'function') {
                window.$(el).modal('show');
            }
        },

        closeBootstrapModal() {
            const el = this.$refs.productModalEl;
            if (!el) return;
            if (window.bootstrap && bootstrap.Modal) {
                const instance = bootstrap.Modal.getInstance(el);
                if (instance) instance.hide();
                return;
            }
            if (window.$ && typeof window.$ === 'function') {
                window.$(el).modal('hide');
            }
        }
    },
    mounted() {
        this.getProducts();
    }
};