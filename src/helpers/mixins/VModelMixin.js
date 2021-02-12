export default {
    props: {
        value: {
            type: [Number, String, Object, Array],
            default: null
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('on-input', value);
            }
        }
    },
    methods: {
        change(value) {
            this.model = value;
        }
    }
};
