// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'light',
        },
        defaults: {
            global: {
                ripple: false,
            },
        },
        display: {
            mobileBreakpoint: 'sm',
        },
    })
    app.vueApp.use(vuetify)
})
