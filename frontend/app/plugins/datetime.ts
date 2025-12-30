import {DateTime} from "luxon";

export function parseDateTime(value?: string | Date | DateTime | undefined): DateTime {
    if (!value) return DateTime.now();

    if (value instanceof DateTime) return value;
    if (value instanceof Date) return DateTime.fromJSDate(value);
    if (typeof value === 'string') return DateTime.fromISO(value);

    // fallback
    return DateTime.now();
}


export default defineNuxtPlugin(() => {
    return {
        provide: {
            date: (value?: string | DateTime | undefined) => {
                value = parseDateTime(value);
                return value.setLocale('th').toFormat('dd LLL yyyy')
            },

            time: (value?: string | DateTime | undefined) => {
                value = parseDateTime(value);
                return value.setLocale('th').toFormat('HH:mm น.');
            },

            datetime: (value?: string | DateTime | undefined) => {
                value = parseDateTime(value);
                return value.setLocale('th').toFormat('dd LLL yyyy - HH:mm')
            },
            /**
             * https://moment.github.io/luxon/#/formatting?id=table-of-tokens
             *
             * @param value
             * @param format
             * @returns
             */
            dateformat: (value: string | DateTime | undefined, format: string) => {
                value = parseDateTime(value);
                return value.setLocale('th').toFormat(format)
            },
            toISODateString: (value?: string | Date | DateTime | undefined) => {
                return parseDateTime(value).toISODate(); // returns 'YYYY-MM-DD'
            }
        }
    }
})
