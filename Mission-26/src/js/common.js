/**
 * Set
 */
function Set() {
    this.items = [];
}

Set.prototype.array = function () {
    return this.items;
}

Set.prototype.put = function (item) {
    var exist = false;
    for (var i = 0, len = this.items.length; i < len; i++) {
        if (this.items[i] == item) {
            exist = true;
        }
    }
    if (!exist) {
        this.items.push(item);
    }
}

Set.prototype.remove = function (item) {
    for (var i = 0, len = this.items.length; i < len; i++) {
        if (this.items == item) {
            this.items.splice(i, 1);
        }
    }
}