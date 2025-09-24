import i18next from './i18next'
import {defaultNS, headerName} from './settings'
import { headers } from 'next/headers'

export async function getT(ns: string = defaultNS, options?: any) {
    const headerList = await headers()
    const lng = headerList.get(headerName)
    if (lng && i18next.resolvedLanguage !== lng) {
        await i18next.changeLanguage(lng)
    }
    if (ns && !i18next.hasLoadedNamespace(ns)) {
        await i18next.loadNamespaces(ns)
    }
    return {
        // @ts-ignore
        t: i18next.getFixedT(lng ?? i18next.resolvedLanguage, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
        i18n: i18next
    }
}