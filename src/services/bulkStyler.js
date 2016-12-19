
import _ from 'lodash';

var bulkStyler = (stats_bulk) => {
    let speciality = ['none', 'specialist', 'dualist'][_.random(0, 2)];
    let order = Object.keys(stats_bulk).sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

    switch (speciality) {
        case 'none':
            stats_bulk[order[0]] *= 0.8;
            stats_bulk[order[1]] *= 0.9;
            stats_bulk[order[2]] *= 1.1;
            stats_bulk[order[3]] *= 1.2;
            break;
        case 'specialist':
            stats_bulk[order[0]] *= 2;
            stats_bulk[order[1]] *= 0.5;
            stats_bulk[order[2]] *= 0.6;
            stats_bulk[order[3]] *= 0.7;
            break;
        case 'dualist':
            stats_bulk[order[0]] *= 1.5;
            stats_bulk[order[1]] *= 1.7;
            stats_bulk[order[2]] *= 0.5;
            stats_bulk[order[3]] *= 0.7;
            break;
        default:
            console.log('error case: ' + speciality);
    }

    return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
};


export default bulkStyler;