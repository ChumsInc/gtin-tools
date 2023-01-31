export declare type BarcodeType = 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'GSIN' | 'SSCC';
export declare type BarcodeTypeDigits = {
    [key in BarcodeType]: number;
};
export declare type BarcodeTypeSplits = {
    [key in BarcodeType]?: RegExp;
};
export declare const barcodeDigits: BarcodeTypeDigits;
export declare const barcodeSplits: BarcodeTypeSplits;
export declare const couldBeGTIN: (gtin: string) => boolean;
export declare function trimUPC(digits: string): string;
export declare function parseCheckDigit(str: string, format?: BarcodeType): string;
export declare function parseUPCA(upc: string): string;
export declare function parseGTINFormat(str: string): BarcodeType | null;
export declare function formatUPC(upc: string, raw?: boolean): string;
