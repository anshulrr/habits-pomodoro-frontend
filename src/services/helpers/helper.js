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