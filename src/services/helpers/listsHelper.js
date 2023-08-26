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