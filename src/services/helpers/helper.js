export const isEmpty = function (obj) {
    if (!obj) {
        return true;
    }
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

export const filterPastTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
};

// NOTE: won't work for wrapped rows
// TODO: find better solution
export const calculateTextAreaRows = (str) => {
    const l = str.split(/\r\n|\r|\n/).length;
    return l > 5 ? l : 5;
}