
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
                case num < 20: return 'Worker '+worker.name+' hate'+drawNum(num)+' job.';
                case num < 30: return 'Worker '+worker.name+' almost hate'+drawNum(num)+' job.';
                case num < 40: return 'Worker '+worker.name+' very dissatisfied'+drawNum(num)+' with work.';
                case num < 50: return 'Worker '+worker.name+' dissatisfied'+drawNum(num)+' with work.';
                case num < 60: return 'Worker '+worker.name+' is indifferent'+drawNum(num)+' to work.';
                case num < 70: return 'Worker '+worker.name+' almost satisfied'+drawNum(num)+' with work.';
                case num < 80: return 'Worker '+worker.name+' satisfied'+drawNum(num)+' with work.';
                case num < 90: return 'Worker '+worker.name+' very satisfied'+drawNum(num)+' with work.';
                case num < 100: return 'Worker '+worker.name+' almost loves'+drawNum(num)+' work.';
                case num === 100: return 'Worker '+worker.name+' loves'+drawNum(num)+' work.';
                default:
                    console.log('error case: ' + num);
            }
        };

        const tellers = {
            workloadPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'Grow lazy from a lack'+drawNum(penalty.value)+' of goals, ';
                    case 'lower': return 'Dissatisfied by the lack'+drawNum(penalty.value)+' of tasks, ';
                    case 'low': return 'Relaxing by the lack'+drawNum(penalty.value)+' of tasks, ';
                    case 'normal': return 'Pleased'+drawNum(penalty.value)+' quantity of tasks, ';
                    case 'high': return 'Tense by excess'+drawNum(penalty.value)+' of tasks, ';
                    case 'higher': return 'Was exhausted from flow'+drawNum(penalty.value)+' of tasks, ';
                    case 'very high': return 'Stunned by a enormous overflow'+drawNum(penalty.value)+' of tasks, ';
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
                    case'very low': return 'Hate the monotonous'+drawNum(penalty.value)+' learning and ';
                    case 'lower': return 'Tired of constant'+drawNum(penalty.value)+' learning and';
                    case 'low': return 'Wants to work more'+drawNum(penalty.value)+' than learning and';
                    case 'normal': return 'Happy with the balance'+drawNum(penalty.value)+' between work and study, and';
                    case 'high': return 'Wants to learn more'+drawNum(penalty.value)+' than working and';
                    case 'higher': return 'Dreams of additional'+drawNum(penalty.value)+' education and ';
                    case 'very high': return 'Hates the monotonous'+drawNum(penalty.value)+' work and';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            collectivePenalty: (penalty) => {
                let realCollectivePenalty = () => {
                    switch (penalty.level) {
                        case'very low': return ' feels depressed by colleagues'+drawNum(penalty.value)+' experience.';
                        case 'lower': return ' feels upset by their low skills compared'+drawNum(penalty.value)+' to colleagues skills.';
                        case 'low': return ' feels himself like follower'+drawNum(penalty.value)+' in a team.';
                        case 'normal': return ' fells comfort'+drawNum(penalty.value)+' in collective.';
                        case 'high': return ' feels himself like leader'+drawNum(penalty.value)+' in a team.';
                        case 'higher': return ' sadly in the team of weaklings'+drawNum(penalty.value)+'.';
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
                case num < 24: return ' Packed'+drawNum(num)+' up suitcase.';
                case num < 100: return ' Thoughts'+drawNum(num)+' are already on vacation.';
                case num < 200: return ' Bought'+drawNum(num)+' plane tickets.';
                case num < 300: return ' Selects'+drawNum(num)+' the travel route.';
                case num < 400: return ' Planning'+drawNum(num)+' a trip.';
                case num < 500: return ' Thinking'+drawNum(num)+' about vacation.';
                case num < 600: return ' Dreaming'+drawNum(num)+' about vacation.';
                case num < 700: return ' Encouraged'+drawNum(num)+' and ready for a work.';
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