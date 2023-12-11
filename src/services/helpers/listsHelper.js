import moment from "moment";

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

export const formatDate = (date) => {
    let format = 'yyyy MMM D, H:mm';
    if (moment(date).isSame(new Date(), 'day')) {
        format = 'H:mm';
    } else if (moment(date).isSame(new Date(), 'year')) {
        format = 'MMM D, H:mm'
    }
    return moment(date).format(format);
}

export const generateDateColor = (date) => {
    if (moment().diff(moment(date)) > 0) {
        return "text-danger";
    } else if (moment(date).isSame(new Date(), 'day')) {
        return "text-primary";
    } else {
        return "text-secondary";
    }
}