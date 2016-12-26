
import _ from 'lodash';

class Narrator {

    static workerFeelings(worker) {
        // quantum {level: '', value: '', text: ''}
        // level in ['very low', 'lower', 'low', 'normal', 'high', 'higher', 'very high']
        
        let penalties_names = ['workloadPenalty', 'difficultyPenalty', 'educationPenalty', 'collectivePenalty'];
        let penalties = {};

        const formQuantum = (penalty_name, num) => {
            let quantum = {level: '', value: num, text: ''};

            switch (true) {
                case num === -20:
                    quantum.level = 'very low';
                    break;
                case num <= -15:
                    quantum.level = 'lower';
                    break;
                case num <= -5:
                    quantum.level = 'low';
                    break;
                case num < 5:
                    quantum.level = 'normal';
                    break;
                case num < 15:
                    quantum.level = 'high';
                    break;
                case num < 20:
                    quantum.level = 'higher';
                    break;
                case num === 20:
                    quantum.level = 'very high';
                    break;
                default:
                    console.log('error case: ' + num);
            }

            return quantum;
        };

        const aboutHappiness = () => {
            let num = worker.calcEfficiency();
            switch (true) {
                case num < 20: return 'Worker '+worker.name+' hate job.';
                case num < 30: return 'Worker '+worker.name+' almost hate job.';
                case num < 40: return 'Worker '+worker.name+' very dissatisfied with work.';
                case num < 50: return 'Worker '+worker.name+' dissatisfied with work.';
                case num < 60: return 'Worker '+worker.name+' is indifferent to work.';
                case num < 70: return 'Worker '+worker.name+' almost satisfied with work.';
                case num < 80: return 'Worker '+worker.name+' satisfied with work.';
                case num < 90: return 'Worker '+worker.name+' very satisfied with work.';
                case num < 100: return 'Worker '+worker.name+' almost loves work.';
                case num === 100: return 'Worker '+worker.name+' loves work.';
                default:
                    console.log('error case: ' + num);
            }
        };

        const tellers = {
            workloadPenalty: (level) => {
                switch (level) {
                    case'very low': return 'Grow lazy from a lack of goals, ';
                    case 'lower': return 'Dissatisfied by the lack of tasks, ';
                    case 'low': return 'Relaxing by the lack of tasks, ';
                    case 'normal': return 'Pleased quantity of tasks, ';
                    case 'high': return 'Tense by excess of tasks, ';
                    case 'higher': return 'Was exhausted from flow of tasks, ';
                    case 'very high': return 'Stunned by a enormous overflow of tasks, ';
                    default: console.log('error case: ' + level); return ' # Error! # ';
                }
            },
            difficultyPenalty: (level) => {
                switch (level) {
                    case'very low': return 'with impossible complexity. ';
                    case 'lower': return 'with very hard complexity. ';
                    case 'low': return 'with hard complexity. ';
                    case 'normal': return 'with enjoyable complexity. ';
                    case 'high': return 'with easy complexity. ';
                    case 'higher': return 'with very easy complexity. ';
                    case 'very high': return 'with ridiculous complexity. ';
                    default: console.log('error case: ' + level); return ' # Error! # ';
                }
            },
            educationPenalty: (level) => {
                switch (level) {
                    case'very low': return 'Hate the monotonous learning and ';
                    case 'lower': return 'Tired of constant learning and';
                    case 'low': return 'Wants to work more than learning and';
                    case 'normal': return 'Happy with the balance between work and study, and';
                    case 'high': return 'Wants to learn more than working and';
                    case 'higher': return 'Dreams of additional education and ';
                    case 'very high': return 'Hates the monotonous work and';
                    default: console.log('error case: ' + level); return ' # Error! # ';
                }
            },
            collectivePenalty: (level) => {
                let realCollectivePenalty = () => {
                    switch (level) {
                        case'very low': return ' feels depressed by colleagues experience.';
                        case 'lower': return ' feels upset by their low skills compared to colleagues skills.';
                        case 'low': return ' feels himself like follower in a team.';
                        case 'normal': return ' fells comfort in collective.';
                        case 'high': return ' feels himself like leader in a team.';
                        case 'higher': return ' sadly in the team of weaklings.';
                        case 'very high': return ' bored in the team of idiots.';
                        default: console.log('error case: ' + level); return ' # Error! # ';
                    }
                };
                return realCollectivePenalty();

            }
        };

        const aboutStamina = () => {
            let num = worker.stamina;
            switch (true) {
                case num < 10: return ' Packed up suitcase.';
                case num < 100: return ' Thoughts are already on vacation.';
                case num < 200: return ' Bought plane tickets.';
                case num < 300: return ' Selects the travel route.';
                case num < 400: return ' Planning a trip.';
                case num < 500: return ' Thinking about vacation.';
                case num < 600: return ' Dreaming about vacation.';
                case num < 700: return ' It looks normal.';
                case num < 800: return ' Encouraged.';
                case num < 900: return ' Full of energy.';
                case num < 1000: return ' Rested and full of energy.';
                case num === 1000: return ' Fresh from holidays';
                default:
                    console.log('error case: ' + num);
            }
        };

        penalties_names.forEach((penalty_name) => {
            penalties[penalty_name] = formQuantum(penalty_name, worker[penalty_name]());
        });
    //    console.log(penalties);

        let tale = aboutHappiness();

        tale += penalties_names.reduce((string, penalty_name) => {
            return string + ' ' + tellers[penalty_name](penalties[penalty_name].level);
        }, '');

        tale += aboutStamina();

        console.log(tale);
        return tale;
    }

}


export default Narrator;