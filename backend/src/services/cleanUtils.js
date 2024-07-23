const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const normalizeString = (string) => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const cleanQuantity = (quantity, min, max) => {
    let qty = parseInt(quantity) || undefined;
    if (qty < min) {
        qty = undefined;
    }
    if (qty > max) {
        qty = undefined;
    }
    return qty;
};

module.exports = {
    escapeRegex,
    normalizeString,
    cleanQuantity,
};