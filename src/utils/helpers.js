import _ from 'lodash';
import moment from 'moment';

export function humanizeDateTime(dateTime) {
	let out = '';
	const now = Date.now();
	const dateTimeObj = new Date(dateTime);
	let diff = Math.round((now - dateTimeObj.getTime()) / 1000); // difference between the current and the provided datetimes

	if (diff < 60) {// it happened now
		return "Now";

	} else if (diff > 60 && diff < 3600) { // it happened X minutes ago
		out = Math.round(diff / 60);
		if (out < 2)
			return out + " minute ago";
		else
			return out + " minutes ago";

	} else if (diff > 3600 && diff < (3600 * 24)) { // it happened X hours ago
		out = Math.round(diff / 3600);
		if (out < 2)
			return out + " hour ago";
		else
			return out + " hours ago";

	} else if (diff > (3600 * 24) && diff < (3600 * 24 * 1.5)) { // it happened yesterday
		return "Yesterday";

	} else if (diff > (3600 * 24 * 1.5) && diff < (3600 * 24 * 7)) { // it happened days ago
		out = Math.round(diff / (3600 * 24));
		return out + " days ago";

	} else { // falling back on a usual date format as it happened later than yesterday
		return moment(dateTime).format("MMM Do YY");
	}
}
