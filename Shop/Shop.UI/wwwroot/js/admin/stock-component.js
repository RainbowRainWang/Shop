// Stock 管理组件：与 /admin/stocks API 对应
// - GET /admin/stocks -> 列出每个产品及其库存
// - POST /admin/stocks -> 为某产品添加库存项
// - PUT /admin/stocks  -> 批量更新库存（接受 UpdateStockDto[]）
// - DELETE /admin/stocks/{id} -> 删除指定库存项
// 依赖：axios、Bootstrap（可回退到 jQuery Modal）、全局 toast 辅助函数 showBasicToast / showErrorToast

const stockComponent = {
    template: `
    <div class="stock-admin">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">库存管理</h5>
            <div>
                <button class="btn btn-sm btn-primary" @click="getProducts" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    刷新
                </button>
            </div>
        </div>

        <div v-if="products.length === 0" class="text-center text-muted">暂无数据</div>

        <div v-for="product in products" :key="product.id" class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <strong>{{ product.name }}</strong>
                        <div class="text-muted small" v-if="product.description">{{ product.description }}</div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-success me-1" @click="openAddStockModal(product)">添加库存</button>
                        <button class="btn btn-sm btn-outline-secondary" @click="saveEditedStocks(product)" :disabled="!hasEdits(product) || submitting">
                            <span v-if="submitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            保存修改
                        </button>
                    </div>
                </div>

                <table class="table table-sm mb-0">
                    <thead>
                        <tr>
                            <th style="width: 48px;">#</th>
                            <th>描述</th>
                            <th style="width:120px;">数量</th>
                            <th style="width:150px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="product.stocks.length === 0">
                            <td colspan="4" class="text-center text-muted">无库存记录</td>
                        </tr>
                        <tr v-for="(s, idx) in product.stocks" :key="s.id">
                            <td>{{ idx + 1 }}</td>
                            <td>
                                <input class="form-control form-control-sm" v-model.trim="s.description" @input="markEdited(s)" />
                            </td>
                            <td>
                                <input type="number" class="form-control form-control-sm" v-model.number="s.qty" min="0" @input="markEdited(s)" />
                            </td>
                            <td>
                                <button class="btn btn-sm btn-danger" @click="confirmDeleteStock(s.id, product)">删除</button>
                                <span class="text-muted ms-2" v-if="s._edited">(已修改)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Stock Modal -->
        <div class="modal fade" id="addStockModal" tabindex="-1" aria-hidden="true" ref="addStockModalEl">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">添加库存 - {{ modalProduct?.name || '' }}</h5>
                        <button type="button" class="btn-close" @click="closeAddStockModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">描述</label>
                            <input class="form-control" v-model.trim="newStock.description" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">数量</label>
                            <input type="number" class="form-control" v-model.number="newStock.qty" min="0" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeAddStockModal">关闭</button>
                        <button class="btn btn-primary" :disabled="adding" @click="addStock">
                            <span v-if="adding" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            添加
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            products: [],               // 每项形如 { id, name, description, stocks: [{ id, description, qty, productId, _edited? }] }
            loading: false,
            submitting: false,
            adding: false,
            modalProduct: null,        // 当前用于添加库存的 product
            newStock: {
                description: '',
                qty: 0
            }
        };
    },
    methods: {
        // 从后端加载产品及其库存
        async getProducts() {
            this.loading = true;
            try {
                const res = await axios.get('/admin/stocks');
                // API 返回 IEnumerable<GetProductStocksDto>
                // 期望每个项： { id, name, stocks: [{ id, description, qty }] }
                this.products = (res?.data?.data || []).map(p => ({
                    id: p.id,
                    name: p.name || ('产品 ' + p.id),
                    description: p.description,
                    stocks: (p.stocks || []).map(s => ({ ...s, productId: p.id, _edited: false }))
                }));
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },

        // 标记库存项为已修改（供批量更新）
        markEdited(stock) {
            stock._edited = true;
        },

        // 判断某产品是否存在待保存的编辑
        hasEdits(product) {
            return product.stocks.some(s => !!s._edited);
        },

        // 批量保存某产品的已编辑库存项（调用 PUT /admin/stocks，发送 UpdateStockDto[]）
        async saveEditedStocks(product) {
            const toUpdate = product.stocks
                .filter(s => s._edited)
                .map(s => ({ id: s.id, description: s.description, qty: s.qty, productId: s.productId }));

            if (toUpdate.length === 0) {
                showBasicToast('没有变更需要保存');
                return;
            }

            this.submitting = true;
            try {
                const res = await axios.put('/admin/stocks', toUpdate);
                // 返回更新后的 IEnumerable<UpdateStockDto>
                const updated = res?.data?.data || [];
                // 将返回结果合并回 UI（根据 id 匹配）
                for (const u of updated) {
                    for (const s of product.stocks) {
                        if (s.id === u.id) {
                            s.description = u.description;
                            s.qty = u.qty;
                            s._edited = false;
                            break;
                        }
                    }
                }
                showBasicToast(res?.data?.message || '保存成功');
            } catch (err) {
                this.handleError(err);
            } finally {
                this.submitting = false;
            }
        },

        // 打开添加库存模态框
        openAddStockModal(product) {
            this.modalProduct = product;
            this.newStock = { description: '', qty: 0 };
            this.showBootstrapModal(this.$refs.addStockModalEl);
        },

        closeAddStockModal() {
            this.modalProduct = null;
            this.newStock = { description: '', qty: 0 };
            this.closeBootstrapModal(this.$refs.addStockModalEl);
        },

        // 添加库存：POST /admin/stocks (CreateStockDto)
        async addStock() {
            if (!this.modalProduct) {
                showErrorToast('目标产品不存在');
                return;
            }
            if (!this.newStock.description || this.newStock.qty == null) {
                showErrorToast('请填写描述和数量');
                return;
            }

            this.adding = true;
            try {
                const payload = {
                    description: this.newStock.description,
                    qty: this.newStock.qty,
                    productId: this.modalProduct.id
                };
                const res = await axios.post('/admin/stocks', payload);
                const created = res?.data?.data;
                if (!created) {
                    // 控制器会在产品不存在时返回 404 与特定消息
                    showErrorToast(res?.data?.message || '创建失败：产品不存在');
                    return;
                }
                // 将新库存加入当前产品的 stocks 列表
                this.modalProduct.stocks.push({ ...created, productId: this.modalProduct.id, _edited: false });
                showBasicToast(res?.data?.message || '添加成功');
                this.closeAddStockModal();
            } catch (err) {
                this.handleError(err);
            } finally {
                this.adding = false;
            }
        },

        // 删除库存：DELETE /admin/stocks/{id}
        async deleteStock(id, product) {
            try {
                const res = await axios.delete(`/admin/stocks/${id}`);
                showBasicToast(res?.data?.message || '删除成功');
                // 从对应产品的 stocks 中移除
                product.stocks = product.stocks.filter(s => s.id !== id);
            } catch (err) {
                this.handleError(err);
            }
        },

        confirmDeleteStock(id, product) {
            if (confirm('确认删除该库存项？')) {
                this.deleteStock(id, product);
            }
        },

        // 统一错误处理
        handleError(err) {
            const msg = err?.response?.data?.message || err?.message || '请求失败';
            showErrorToast(msg);
            console.error(err);
        },

        // Bootstrap 模态工具（优先使用原生 API，回退 jQuery）
        showBootstrapModal(el) {
            if (!el) return;
            if (window.bootstrap && bootstrap.Modal) {
                let ins = bootstrap.Modal.getInstance(el);
                if (!ins) ins = new bootstrap.Modal(el);
                ins.show();
                return;
            }
            if (window.$ && typeof window.$ === 'function') {
                window.$(el).modal('show');
            }
        },
        closeBootstrapModal(el) {
            if (!el) return;
            if (window.bootstrap && bootstrap.Modal) {
                const ins = bootstrap.Modal.getInstance(el);
                if (ins) ins.hide();
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