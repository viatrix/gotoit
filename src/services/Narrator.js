
import _ from 'lodash';

class Narrator {

    static workerFeelings(worker, widthNumbers = false) {
        // quantum {level: '', value: '', text: ''}
        // level in ['very low', 'lower', 'low', 'normal', 'high', 'higher', 'very high']

        let penalties_names = ['workloadPenalty', 'difficultyPenalty', 'educationPenalty', 'collectivePenalty'];
        let penalties = {};

        const drawNum = (number, level = 'normal') => {
            if (widthNumbers) {
                return '('+number+')';
            }
            return '';
        };

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
                case num < 20: return 'Worker '+worker.name+' hates'+drawNum(num)+' their job.';
                case num < 30: return 'Worker '+worker.name+' almost hates'+drawNum(num)+' their job.';
                case num < 40: return 'Worker '+worker.name+' is very dissatisfied'+drawNum(num)+' with their job.';
                case num < 50: return 'Worker '+worker.name+' is dissatisfied'+drawNum(num)+' with their job.';
                case num < 60: return 'Worker '+worker.name+' is indifferent'+drawNum(num)+' to their job.';
                case num < 70: return 'Worker '+worker.name+' is almost satisfied'+drawNum(num)+' with their job.';
                case num < 80: return 'Worker '+worker.name+' is satisfied'+drawNum(num)+' with their job.';
                case num < 90: return 'Worker '+worker.name+' is very satisfied'+drawNum(num)+' with their job.';
                case num < 100: return 'Worker '+worker.name+' almost loves'+drawNum(num)+' their job.';
                case num === 100: return 'Worker '+worker.name+' loves'+drawNum(num)+' their job.';
                default:
                    console.log('error case: ' + num);
            }
        };

        const tellers = {
            workloadPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'Grows lazy due to lack'+drawNum(penalty.value)+' of goals, ';
                    case 'lower': return 'Dissatisfied by the lack'+drawNum(penalty.value)+' of tasks, ';
                    case 'low': return 'Relaxed by the lack'+drawNum(penalty.value)+' of tasks, ';
                    case 'normal': return 'Pleased by'+drawNum(penalty.value)+' quantity of tasks, ';
                    case 'high': return 'Stressed by excess'+drawNum(penalty.value)+' of tasks, ';
                    case 'higher': return 'Was exhausted from flow'+drawNum(penalty.value)+' of tasks, ';
                    case 'very high': return 'Stunned by enormous overflow'+drawNum(penalty.value)+' of tasks, ';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            difficultyPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'with impossible'+drawNum(penalty.value)+' complexity. ';
                    case 'lower': return 'with very hard'+drawNum(penalty.value)+' complexity. ';
                    case 'low': return 'with hard'+drawNum(penalty.value)+' complexity. ';
                    case 'normal': return 'with enjoyable'+drawNum(penalty.value)+' complexity. ';
                    case 'high': return 'with easy'+drawNum(penalty.value)+' complexity. ';
                    case 'higher': return 'with very easy'+drawNum(penalty.value)+' complexity. ';
                    case 'very high': return 'with ridiculous'+drawNum(penalty.value)+' complexity. ';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            educationPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'Hates the monotonous'+drawNum(penalty.value)+' learning and ';
                    case 'lower': return 'Tired of constant'+drawNum(penalty.value)+' learning and';
                    case 'low': return 'Wants to work more'+drawNum(penalty.value)+' than learn and';
                    case 'normal': return 'Happy with the balance'+drawNum(penalty.value)+' between work and study, and';
                    case 'high': return 'Wants to learn more'+drawNum(penalty.value)+' than work and';
                    case 'higher': return 'Dreams of additional'+drawNum(penalty.value)+' education and ';
                    case 'very high': return 'Hates the monotonous'+drawNum(penalty.value)+' work and';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            collectivePenalty: (penalty) => {
                let realCollectivePenalty = () => {
                    switch (penalty.level) {
                        case'very low': return ' feels depressed by '+drawNum(penalty.value)+' the level of experience of the colleagues.';
                        case 'lower': return ' feels upset by their low skills compared'+drawNum(penalty.value)+' to the skills of colleagues.';
                        case 'low': return ' feels like a follower'+drawNum(penalty.value)+' in the team.';
                        case 'normal': return ' feels comfortably'+drawNum(penalty.value)+' in the team.';
                        case 'high': return ' feels like a leader'+drawNum(penalty.value)+' in the team.';
                        case 'higher': return ' sad in the team of weaklings'+drawNum(penalty.value)+'.';
                        case 'very high': return ' bored in the team of idiots'+drawNum(penalty.value)+'.';
                        default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                    }
                };
                return realCollectivePenalty();

            }
        };

        const aboutStamina = () => {
            let num = worker.stamina;
            switch (true) {
                case num < 24: return ' Packed'+drawNum(num)+' up their suitcase.';
                case num < 100: return ' Thoughts'+drawNum(num)+' are already on vacation.';
                case num < 200: return ' Bought'+drawNum(num)+' plane tickets.';
                case num < 300: return ' Selects'+drawNum(num)+' the travel route.';
                case num < 400: return ' Planning'+drawNum(num)+' a trip.';
                case num < 500: return ' Thinking'+drawNum(num)+' about vacation.';
                case num < 600: return ' Dreaming'+drawNum(num)+' about vacation.';
                case num < 700: return ' Encouraged'+drawNum(num)+' and ready to work.';
                case num < 800: return ' Full'+drawNum(num)+' of energy.';
                case num < 900: return ' Rested and full'+drawNum(num)+' of energy.';
                case num <= 1000: return ' Fresh'+drawNum(num)+' from holidays';
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
            return string + ' ' + tellers[penalty_name](penalties[penalty_name]);
        }, '');

        tale += aboutStamina();

      //  console.log(tale); // BUT! FIX repeatable calls
        return tale;
    }

}


export default Narrator;
