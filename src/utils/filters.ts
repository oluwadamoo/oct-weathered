export function formatDate(date: Date) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "April",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    return `${months[parseInt(month) - 1]} ${day}, ${year} ${hours}:${minutes}${amPm}`;
}

export function sortData(data: any[], sortColumn: string) {
    const hasKey = data.some((obj) => obj.hasOwnProperty(sortColumn));
    if (!hasKey || !data.length) {
        return []
    }

    const result: any = data.sort((a, b) => {
        const colA = a[sortColumn].toLowerCase();
        const colB = b[sortColumn].toLowerCase();
        return colA.localeCompare(colB);
    });
    return result;

}

export function generateUUID() {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789-";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function kelvinToCelsius(temp: number | undefined) {

    if (temp) {
        return (temp - 273).toFixed(2)

    }
    return temp

}

export function getCoordinateDirection(angle: number | undefined) {
    angle = angle ? (angle % 360 + 360) % 360 : 0;

    if ((angle >= 337.5 && angle < 360) || (angle >= 0 && angle < 22.5)) {
        return "North";
    } else if (angle >= 22.5 && angle < 67.5) {
        return "North-East";
    } else if (angle >= 67.5 && angle < 112.5) {
        return "East";
    } else if (angle >= 112.5 && angle < 157.5) {
        return "South-East";
    } else if (angle >= 157.5 && angle < 202.5) {
        return "South";
    } else if (angle >= 202.5 && angle < 247.5) {
        return "South-West";
    } else if (angle >= 247.5 && angle < 292.5) {
        return "West";
    } else if (angle >= 292.5 && angle < 337.5) {
        return "North-West";
    } else {
        return "Invalid Angle";
    }
}