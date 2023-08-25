export const calculateTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(total / 1000 / 60 / 60);// use % 24: if showing day separately

    return {
        total, hours, minutes, seconds
    };
}

export const generateTimer = ({ hours, minutes, seconds }) => {
    let updatedTimer = hours !== 0 ? ((hours > 9 ? hours : '0' + hours) + ':') : ''
    updatedTimer += minutes !== 0 ? ((minutes > 9 ? minutes : '0' + minutes) + ':') : ''
    updatedTimer += (seconds > 9 ? seconds : '0' + seconds);
    return updatedTimer;
}

export const generateInitialTimer = (initialTimeRemaining) => {
    const seconds = initialTimeRemaining % 60;
    const minutes = Math.floor(initialTimeRemaining / 60) % 60;
    const hours = Math.floor(initialTimeRemaining / 60 / 60);

    return generateTimer({ hours, minutes, seconds });
}