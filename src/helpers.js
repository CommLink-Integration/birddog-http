// truncates val to be between min and max
function truncate(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

module.exports = { truncate };
