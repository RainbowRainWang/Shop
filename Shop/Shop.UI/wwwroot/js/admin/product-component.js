// product-component - 与 /admin/products API 对应
// 依赖：axios，Bootstrap（可回退 jQuery），全局 showBasicToast/showErrorToast

const productComponent = {
    template: `
    <div class="product-admin">
        <div class="d-flex mb-3 gap-2">
            <button class="btn btn-success" @click="getProducts" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                刷新
            </button>
            <button class="btn btn-primary" @click="openCreateModal">添加</button>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th style="width:56px">#</th>
                    <th>商品名</th>
                    <th style="width:140px">价格</th>
                    <th style="width:160px">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="products.length === 0">
                    <td colspan="4" class="text-center text-muted">暂无数据</td>
                </tr>
                <tr v-for="(p, i) in products" :key="p.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ p.name }}</td>
                    <td>￥ {{ formatMoney(p.value) }}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" @click="openUpdateModal(p.id)">修改</button>
                        <button class="btn btn-sm btn-danger" @click="confirmDelete(p.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" ref="productModalEl" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEdit ? '修改商品' : '添加商品' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="isEdit" class="mb-3">
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
                        <button class="btn btn-secondary" @click="closeModal">关闭</button>
                        <button class="btn btn-primary" :disabled="submitting" @click="saveProduct">
                            <span v-if="submitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
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
            products: [],
            productVM: this.emptyProduct(),
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

        // 安全格式化价格（后端可能返回 string 或 number）
        formatMoney(v) {
            try {
                const cleaned = (typeof v === 'string') ? v.replace(/,/g, '').trim() : v;
                const n = Number(cleaned);
                if (!Number.isFinite(n)) return '0.00';
                return n.toFixed(2);
            } catch {
                return '0.00';
            }
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
                if (!d) {
                    showErrorToast(res?.data?.message || '未找到商品');
                    return;
                }
                // 兼容 value 为 string 或 number
                this.productVM = {
                    id: d.id ?? id,
                    name: d.name ?? '',
                    description: d.description ?? '',
                    value: (typeof d.value === 'string') ? Number(d.value.replace(/,/g, '')) : (d.value ?? 0)
                };
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
                // CreateProductDto shape: { name, description, value }
                const payload = {
                    name: this.productVM.name.trim(),
                    description: this.productVM.description?.trim() ?? '',
                    value: this.productVM.value
                };
                const res = await axios.post('/admin/products', payload);
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
                // UpdateProductDto shape expected by backend
                const payload = {
                    id: this.productVM.id,
                    name: this.productVM.name.trim(),
                    description: this.productVM.description?.trim() ?? '',
                    value: this.productVM.value
                };
                const res = await axios.put('/admin/products', payload);
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
            if (!confirm('确定要删除此商品吗？')) return;
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

        saveProduct() {
            if (this.isEdit) return this.updateProduct();
            return this.createProduct();
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

        // Bootstrap 5 Modal 原生 API 优先，回退 jQuery
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