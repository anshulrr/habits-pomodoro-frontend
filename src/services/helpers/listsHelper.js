export function timeToDisplay(total_minutes) {
    if (total_minutes < 60) {
        return Math.floor(total_minutes);
    }
    const minutes = Math.floor(total_minutes % 60);
    const hours = Math.floor(total_minutes / 60);
    // console.debug(total, minutes, hours);

    let time_string = '';
    time_string += hours + ':';
    time_string += minutes > 9 ? minutes : '0' + minutes;

    return time_string;
}

export const truncateString = (str, n = 10) => {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
}

export const truncateParagraph = (para, n = 30) => {
    const words = para.split(" ");
    if (words.length > n) {
        // console.log(words.length);
        const truncated_para = words.splice(0, n).join(" ") + '...';
        return [truncated_para, true];
    } else {
        return [para, false];
    }
}