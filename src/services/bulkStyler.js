
import _ from 'lodash';

class bulkStyler {
    static speciality(stats_bulk) {
        let speciality = ['none', 'specialist', 'dualist'][_.random(0, 2)];
        let order = Object.keys(stats_bulk).sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

        switch (speciality) {
            case 'none':
                stats_bulk[order[0]] *= 0.7;
                stats_bulk[order[1]] *= 0.9;
                stats_bulk[order[2]] *= 1.1;
                stats_bulk[order[3]] *= 1.3;
                break;
            case 'specialist':
                stats_bulk[order[0]] *= 2;
                stats_bulk[order[1]] *= 0.7;
                stats_bulk[order[2]] *= 0.8;
                stats_bulk[order[3]] *= 0.9;
                break;
            case 'dualist':
                stats_bulk[order[0]] *= 1.5;
                stats_bulk[order[1]] *= 1.7;
                stats_bulk[order[2]] *= 0.6;
                stats_bulk[order[3]] *= 0.9;
                break;
            default:
                console.log('error case: ' + speciality);
        }
        return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
    }

    static background(stats_bulk, background) {
        let order = _.shuffle(Object.keys(stats_bulk)); //.sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

        switch (background) {
            case 'specialist': // med like 8
                stats_bulk[order[0]] += 5;
                stats_bulk[order[1]] += 1;
                stats_bulk[order[2]] += 1;
                stats_bulk[order[3]] += 1;
                break;
            case 'comprehensive': // high like 12
                stats_bulk[order[0]] += 3;
                stats_bulk[order[1]] += 3;
                stats_bulk[order[2]] += 3;
                stats_bulk[order[3]] += 3;
                break;
            case 'coworker': // low like 6
                stats_bulk[order[0]] += 2;
                stats_bulk[order[1]] += 2;
                stats_bulk[order[2]] += 1;
                stats_bulk[order[3]] += 1;
                break;
            default:
                console.log('error case: ' + background);
        }
        return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
    }

    static education(stats_bulk, education) {
        let order = Object.keys(stats_bulk).sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

        switch (education) {
            case 'autodidact': // high like 10
                stats_bulk[order[0]] += 3;
                stats_bulk[order[1]] += 5;
                stats_bulk[order[2]] += 0;
                stats_bulk[order[3]] += 2;
                break;
            case 'university': // mid like 8
                stats_bulk[order[0]] += 2;
                stats_bulk[order[1]] += 2;
                stats_bulk[order[2]] += 2;
                stats_bulk[order[3]] += 2;
                break;
            case 'businessman': // low like 4
                stats_bulk[order[0]] += 1;
                stats_bulk[order[1]] += 1;
                stats_bulk[order[2]] += 1;
                stats_bulk[order[3]] += 1;
                break;
            default:
                console.log('error case: ' + education);
        }
        return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
    }

    static projectKind(stats_bulk, kind) {
        switch (kind) {
            case 'application':
                return stats_bulk;
            case 'game':
                stats_bulk['design'] *= 2;
                stats_bulk['manage'] *= 1;
                stats_bulk['program'] *= 1;
                stats_bulk['admin'] *= 0.7;
                break;
            case 'service':
                stats_bulk['design'] *= 1;
                stats_bulk['manage'] *= 2;
                stats_bulk['program'] *= 0.7;
                stats_bulk['admin'] *= 1;
                break;
            case 'system':
                stats_bulk['design'] *= 1;
                stats_bulk['manage'] *= 0.7;
                stats_bulk['program'] *= 2;
                stats_bulk['admin'] *= 1;
                break;
            case 'database':
                stats_bulk['design'] *= 0.7;
                stats_bulk['manage'] *= 1;
                stats_bulk['program'] *= 1;
                stats_bulk['admin'] *= 2;
                break;
            default:
                console.log('error case: ' + kind);
        }
        return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
    }

    static projectPlatform(stats_bulk, platform) {
        let order = Object.keys(stats_bulk).sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

        switch (platform) {
            case 'crossplatform':
                return stats_bulk;
            case 'mobile':
                stats_bulk['design'] *= 2;
                stats_bulk[order[0]] *= 1.5;
                stats_bulk[order[1]] *= 1.7;
                stats_bulk[order[2]] *= 0.7;
                stats_bulk[order[3]] *= 0.8;
                break;
            case 'browser':
                stats_bulk['manage'] *= 2;
                stats_bulk[order[0]] *= 1.5;
                stats_bulk[order[1]] *= 1.5;
                stats_bulk[order[2]] *= 0.7;
                stats_bulk[order[3]] *= 0.7;
                break;
            case 'desktop':
                stats_bulk['program'] *= 2;
                stats_bulk[order[0]] *= 1.3;
                stats_bulk[order[1]] *= 1.2;
                stats_bulk[order[2]] *= 0.8;
                stats_bulk[order[3]] *= 0.7;
                break;
            case 'embedded':
                stats_bulk['admin'] *= 2;
                stats_bulk[order[0]] *= 0.5;
                stats_bulk[order[1]] *= 1;
                stats_bulk[order[2]] *= 1.5;
                stats_bulk[order[3]] *= 2;
                break;
            default:
                console.log('error case: ' + platform);
        }
        return _.mapValues(stats_bulk, function (stat) { return Math.ceil(stat); });
    }
}


export default bulkStyler;