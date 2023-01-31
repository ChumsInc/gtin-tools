![Chums Logo](https://intranet.chums.com/images/chums/chums-badge-120x120.png)
# GTIN Tools

## Installation
    npm install @chumsinc/gtin-tools

## Usage & Examples

```typescript
import {
    couldBeGTIN, 
    trimUPC, 
    parseCheckDigit, 
    parseUPCA, 
    parseGTINFormat,
    formatGTIN
} from "@chumsinc/gtin-tools";

couldBeGTIN('ASD123') //returns false
couldBeGTIN('01234567890') //returns true
couldBeGTIN('0 12345 67890') //returns true
couldBeGTIN('0 12345 67890 5') //returns true
couldBeGTIN('0 12345 67890 X') //returns false

trimUPC('0 12345 67890 5') // returns '012345678905'
parseCheckDigit('01234567890', 'GTIN-12') // returns '5'

parseGTINFormat('01234567890') // returns 'GTIN-12', gtin-12 without check digit
parseGTINFormat('012345678905') // returns 'GTIN-12'
parseGTINFormat('451234567890') // returns 'GTIN-13' Japan GTIN-13 without check digit

formatGTIN('01234567890') // returns '0 12345 67890 5', corrects check digit & adds spaces 
formatGTIN('012345678908') // returns '0 12345 67890 5', corrects check digit & adds spaces 
formatGTIN('012345678908', true) // returns '012345678905', corrects check digit 

```
