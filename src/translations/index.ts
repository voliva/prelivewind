export {default as TranslationConstants} from './translationConstants';
export {default as i18nService} from './i18n';

import caES from './caES';
import enGB from './enGB';
import esES from './esES';
const languages = {
    caES, esES, enGB,
    ca: caES,
    es: esES,
    en: enGB
};
export {languages};