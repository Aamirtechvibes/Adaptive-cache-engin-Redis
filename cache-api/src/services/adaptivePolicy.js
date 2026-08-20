export function calculateTTL(requestsPerMinute) {

    if (requestsPerMinute >= 500) {
        return 3600; // hot -1 hour
    }

    if (requestsPerMinute >= 100) {
        return 900; // warm - 15 minutes
    }

    if (requestsPerMinute >= 20) {
        return 300; // cold - 5 minutes
    }

    return 60; // 1 minute
}

export function getTrafficStatus(requestsPerMinute) {

    if (requestsPerMinute >= 500) {
        return "HOT";
    }

    if (requestsPerMinute >= 100) {
        return "WARM";
    }

    return "COLD";
}

// export function getTTL(score) {

//     if (score >= 0.7) {
//         return 600;
//     }

//     if (score >= 0.3) {
//         return 120;
//     }

//     return 20;
// }