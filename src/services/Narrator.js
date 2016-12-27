
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
                case num < 20: return 'Worker '+worker.name+' hate('+num+') job.';
                case num < 30: return 'Worker '+worker.name+' almost hate('+num+') job.';
                case num < 40: return 'Worker '+worker.name+' very dissatisfied('+num+') with work.';
                case num < 50: return 'Worker '+worker.name+' dissatisfied('+num+') with work.';
                case num < 60: return 'Worker '+worker.name+' is indifferent('+num+') to work.';
                case num < 70: return 'Worker '+worker.name+' almost satisfied('+num+') with work.';
                case num < 80: return 'Worker '+worker.name+' satisfied('+num+') with work.';
                case num < 90: return 'Worker '+worker.name+' very satisfied('+num+') with work.';
                case num < 100: return 'Worker '+worker.name+' almost loves('+num+') work.';
                case num === 100: return 'Worker '+worker.name+' loves('+num+') work.';
                default:
                    console.log('error case: ' + num);
            }
        };

        const tellers = {
            workloadPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'Grow lazy from a lack('+penalty.value+') of goals, ';
                    case 'lower': return 'Dissatisfied by the lack('+penalty.value+') of tasks, ';
                    case 'low': return 'Relaxing by the lack('+penalty.value+') of tasks, ';
                    case 'normal': return 'Pleased('+penalty.value+') quantity of tasks, ';
                    case 'high': return 'Tense by excess('+penalty.value+') of tasks, ';
                    case 'higher': return 'Was exhausted from flow('+penalty.value+') of tasks, ';
                    case 'very high': return 'Stunned by a enormous overflow('+penalty.value+') of tasks, ';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            difficultyPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'with impossible('+penalty.value+') complexity. ';
                    case 'lower': return 'with very hard('+penalty.value+') complexity. ';
                    case 'low': return 'with hard('+penalty.value+') complexity. ';
                    case 'normal': return 'with enjoyable('+penalty.value+') complexity. ';
                    case 'high': return 'with easy('+penalty.value+') complexity. ';
                    case 'higher': return 'with very easy('+penalty.value+') complexity. ';
                    case 'very high': return 'with ridiculous('+penalty.value+') complexity. ';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            educationPenalty: (penalty) => {
                switch (penalty.level) {
                    case'very low': return 'Hate the monotonous('+penalty.value+') learning and ';
                    case 'lower': return 'Tired of constant('+penalty.value+') learning and';
                    case 'low': return 'Wants to work more('+penalty.value+') than learning and';
                    case 'normal': return 'Happy with the balance('+penalty.value+') between work and study, and';
                    case 'high': return 'Wants to learn more('+penalty.value+') than working and';
                    case 'higher': return 'Dreams of additional('+penalty.value+') education and ';
                    case 'very high': return 'Hates the monotonous('+penalty.value+') work and';
                    default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                }
            },
            collectivePenalty: (penalty) => {
                let realCollectivePenalty = () => {
                    switch (penalty.level) {
                        case'very low': return ' feels depressed by colleagues('+penalty.value+') experience.';
                        case 'lower': return ' feels upset by their low skills compared('+penalty.value+') to colleagues skills.';
                        case 'low': return ' feels himself like follower('+penalty.value+') in a team.';
                        case 'normal': return ' fells comfort('+penalty.value+') in collective.';
                        case 'high': return ' feels himself like leader('+penalty.value+') in a team.';
                        case 'higher': return ' sadly in the team of weaklings('+penalty.value+').';
                        case 'very high': return ' bored in the team of idiots('+penalty.value+').';
                        default: console.log('error case: ' + penalty.level); return ' # Error! # ';
                    }
                };
                return realCollectivePenalty();

            }
        };

        const aboutStamina = () => {
            let num = worker.stamina;
            switch (true) {
                case num < 10: return ' Packed('+num+') up suitcase.';
                case num < 100: return ' Thoughts('+num+') are already on vacation.';
                case num < 200: return ' Bought('+num+') plane tickets.';
                case num < 300: return ' Selects('+num+') the travel route.';
                case num < 400: return ' Planning('+num+') a trip.';
                case num < 500: return ' Thinking('+num+') about vacation.';
                case num < 600: return ' Dreaming('+num+') about vacation.';
                case num < 700: return ' It looks normal('+num+').';
                case num < 800: return ' Encouraged('+num+').';
                case num < 900: return ' Full('+num+') of energy.';
                case num < 1000: return ' Rested and full('+num+') of energy.';
                case num === 1000: return ' Fresh('+num+') from holidays';
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