const STREAM_START_TIME = document.querySelector('#stream-start-time');

const CAMERA_PREVIEW_TOGGLE = document.querySelector('#camera-preview-toggle');
const CAMERA_PREVIEW_WINDOW = document.querySelector('#camera-preview-window');
const CAMERA_PREVIEW_OFF = document.querySelector('#camera-preview-off');

CAMERA_PREVIEW_TOGGLE.addEventListener('change', (e) => {
    if (e.target.checked) {
        CAMERA_PREVIEW_OFF.classList.add('hidden');
    } else {
        CAMERA_PREVIEW_OFF.classList.remove('hidden');
    }
})

function formatRoundedDate() {
    const now = new Date();

    // Round to the nearest 5 minutes
    const minutes = now.getMinutes();
    const roundedMinutes = Math.round(minutes / 5) * 5;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // Format the date
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'shortOffset' // To get 'EST' or similar
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);

    // Add the ordinal suffix to the day (e.g., 1st, 2nd, 3rd)
    const day = now.getDate();
    const nth = (d) => {
        const last = +String(d).slice(-2);
        if (last > 3 && last < 21) return 'th';
        const remainder = last % 10;
        if (remainder === 1) return "st";
        if (remainder === 2) return "nd";
        if (remainder === 3) return "rd";
        return "th";
    };

    // Replace the day number with the day number + suffix
    return formattedDate.replace(/(\d+)/, `$1${nth(day)}`).replace(' at ', ' - ');
}

STREAM_START_TIME.innerHTML = formatRoundedDate();