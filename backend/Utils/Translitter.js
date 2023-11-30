import CyrillicToTranslit from 'cyrillic-to-translit-js';

class Translitter {
    static TranslitterObject = new CyrillicToTranslit();

    static Transform(stroke) {
        return this.TranslitterObject.transform(stroke, '_').toUpperCase();
    }
}

export default Translitter;