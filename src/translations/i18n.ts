import TranslationConstants from './translationConstants';
import {languages} from './index';
import * as browserLanguage from 'in-browser-language';

export default class i18nService {
    private static pickedLanguage = null;

    static translate(token:TranslationConstants):string {
        const translation = this.getTranslation(token);
        if(!translation) {
            console.warn(`translation ${token} not found`);
            return `_${token}`;
        }
        return translation;
    }
    static translateWithDefault(token:TranslationConstants, value:string):string {
        const translation = this.getTranslation(`${token}_${value}`);
        if(!translation) {
            return value;
        }
        return translation;
    }

    private static getTranslation(token:string):string {
        const lng = this.getLanguage();
        return lng[token];
    }
    private static getLanguage() {
        if(!this.pickedLanguage) {
            const availableLanguages = Object.keys(languages);
            const language = browserLanguage.pick(availableLanguages, 'enGB');
            console.log(`user's language is ${language}`);
            this.pickedLanguage = languages[language];
        }
        return this.pickedLanguage;
    }
}