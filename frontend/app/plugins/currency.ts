import currency from "currency.js";

const formatter = Intl.NumberFormat('th-TH', {
    style: "decimal",
    currency: "THB",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
})

const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

currency.prototype.toString = function () {
    return formatter.format(this.value);
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            currency(value: string | number | currency): currency {
                return currency(value, {precision: 5, separator: ",", symbol: ''})
            },
            currency2(value: string | number): string {
                const result = currency(value, { precision: 2 }).value;
                return formatter.format(result);
            },
            fnumber(value: string | number): string {
                if (value === null || value === undefined || value === "") return "0";

                const num = Number(value);
                if (isNaN(num)) return "0";

                const hasDecimal = num % 1 !== 0;

                return new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: hasDecimal ? 2 : 0,
                    maximumFractionDigits: hasDecimal ? 2 : 0,
                }).format(num);
            }
        }
    }
})
