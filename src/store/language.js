import * as storeUtil from 'jutore';
import opts from '../../config';

var store = storeUtil.setScope('woosocial_language', {
    lang: ''
});

export const LANG = 'lang';

export const setLanguage = (value) => {
    store.set(LANG, value);
}

export const getLanguage = () => {
    return store.get(LANG) || opts.lang;
}

export default store;