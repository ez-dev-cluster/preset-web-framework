export default defineNuxtPlugin(() => {
    return {
        provide: {
            rules: {
                required: (v: string) => !!v || 'ช่องนี้จำเป็นต้องกรอก',

                email: (v: string) => !v || /.+@.+\..+/.test(v) || 'รูปแบบอีเมล์ไม่ถูกต้อง',

                integer: (v: string) => Number.isInteger(parseFloat(v)) || 'ต้องเป็นตัวเลข จำนวนเต็ม',

                decimal: (v: string) => (!isNaN(Number(v)) && v !== '' && v !== null) || 'ต้องเป็นตัวเลข (จำนวนเต็มหรือทศนิยม)',

                positive: (v: string | number) => Number(v) > 0 || 'ต้องเป็นจำนวนบวก',

                integerNotRequired: (v: string) => (v == null || v === '' || Number.isInteger(Number(v))) || 'ต้องเป็นจำนวนเต็ม',


                requiredPositive: (v: string | number) => (!!v && Number(v) >= 0) || 'ช่องนี้จำเป็นต้องกรอก และต้องเป็นจำนวนบวก',
                greaterThanZero: (v: string | number) => (!v || Number(v) > 0) || 'ต้องเป็นจำนวนบวกมากกว่า 0'
            }
        }
    }
})
