import moment from 'moment';
export function getNow() {
    return moment.now() / 1000
};
export function formatDate(unix, format = 'DD.MM.YYYY HH:mm'){
    return moment.unix(unix).format(format)
};