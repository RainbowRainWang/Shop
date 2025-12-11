Vue.createApp({
    data() {
        return {
            price: 0,
            showPrice: true
        }
    },
    computed: {
        formatPrice() {
            return '￥' + this.price;
        }
    },
    methods: {
        togglePrice() {
            this.showPrice = !this.showPrice;
        }
    }
}).mount('#app');