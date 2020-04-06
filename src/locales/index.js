
import tr from './tr';
import en from './en';
import opts from '../../config';
import * as langStore from '../store/language';

export default () => {
    var lang = langStore.getLanguage();

    if (opts.locales[lang])
        return opts.locales[lang];
    else if (lang == 'tr')
        return tr;
    else if (lang == 'en')
        return en;
    else
        return en;
}
