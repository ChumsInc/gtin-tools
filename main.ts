export type BarcodeType = 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'GSIN' | 'SSCC';

export type BarcodeTypeDigits = {
    [key in BarcodeType]: number;
};

export type BarcodeTypeSplits = {
    [key in BarcodeType]?: RegExp;
}


export const barcodeDigits:BarcodeTypeDigits = {
    // ['GTIN-8']: 8,
    ['GTIN-12']: 12,
    ['GTIN-13']: 13,
    ['GTIN-14']: 14,
    ['GSIN']: 17,
    ['SSCC']: 18,
}

export const barcodeSplits:BarcodeTypeSplits = {
    ['GTIN-12']: /(\d)(\d{5})(\d{5})(\d)/,
    ['GTIN-13']: /(\d)(\d{6})(\d{6})/,
    ['GTIN-14']: /(\d)(\d{2})(\d{5})(\d{5})(\d)/,
}

export const couldBeGTIN = (gtin:string) => /^[0-9 ]+$/.test(gtin);

export function trimUPC(digits:string):string {
    return digits.trim().replace(/\D/g, '');
}


export function parseCheckDigit(str: string, format: BarcodeType = 'GTIN-12'):string {
    const digitSum = [0, 0];
    let digits = trimUPC(str);
    const stdDigits = barcodeDigits[format];
    if (!digits || (digits.length < (stdDigits - 1)) || (digits.length > stdDigits)) {
        return '';
    } else if (digits.length === stdDigits || digits.length === stdDigits - 1) {
        digits = digits.slice(0, stdDigits - 1);
    } else {
        return '';
    }

    const checkSum = digits.split('')
        .reverse()
        .map((digit, index) => index % 2 === 0 ? Number(digit) * 3 : Number(digit))
        .reduce((pv, cv) => pv + cv, 0);

    return ((10 - checkSum % 10) % 10).toString();
}


export function parseUPCA(upc:string):string {
    const digits = trimUPC(upc);
    if (!digits || digits.length < 11 || digits.length > 12) {
        return upc;
    }
    return digits.slice(0, 11) + parseCheckDigit(digits, 'GTIN-12');
}

export function parseGTINFormat(str:string):BarcodeType|null {
    const digits = trimUPC(str);
    switch (digits.length) {
    case barcodeDigits["GTIN-12"] - 1:
        return 'GTIN-12';
    case barcodeDigits['GTIN-12']:
        if (/^4[59]/.test(digits)) {
            return 'GTIN-13';
        }
        return 'GTIN-12';
    case barcodeDigits['GTIN-13']:
        return 'GTIN-13';
    case barcodeDigits['GTIN-14']:
        return 'GTIN-14';
    case barcodeDigits.GSIN:
        return 'GSIN';
    case barcodeDigits.SSCC:
        return 'SSCC';
    default:
        return null;
    }
}

export function formatUPC(upc:string, raw:boolean = false) {
    if (!couldBeGTIN(upc)) {
        return upc;
    }

    const format = parseGTINFormat(upc);
    if (!format) {
        return upc;
    }
    const digits = trimUPC(upc).slice(0, barcodeDigits[format] - 1) + parseCheckDigit(upc, format);
    if (raw) {
        return digits;
    }

    const splitRegExp = barcodeSplits[format];
    if (!splitRegExp) {
        return digits;
    }

    switch (format) {
    case 'GTIN-12':
        const gtin12 = splitRegExp.exec(digits);
        if (!gtin12) {
            return upc;
        }
        return `${gtin12[1]} ${gtin12[2]} ${gtin12[3]} ${gtin12[4]}`;
    case 'GTIN-13':
        const gtin13 = splitRegExp.exec(digits);
        if (!gtin13) {
            return upc;
        }
        return `${gtin13[1]} ${gtin13[2]} ${gtin13[3]}`;

    case 'GTIN-14':
        const gtin14 = splitRegExp.exec(digits);
        if (!gtin14) {
            return upc;
        }
        return `${gtin14[1]} ${gtin14[2]} ${gtin14[3]} ${gtin14[4]} ${gtin14[5]}`;

    default:
        return digits;
    }
}
