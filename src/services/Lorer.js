
import ProjectModel from '../models/ProjectModel';

class Lorer { // Quest Project Generator

    static afterFirstTraining(project) {
        let bulk = ProjectModel.generate(5, 1);
        return Object.assign(bulk, {
            lore: {name: 'Donald Purmt', text: 'Well ' + project.name + ' project. What about some complex for me?'},
            complexity: 10,
            complexity_max: 10,
            is_storyline: true,
            reward: bulk.reward + 5000
        });
    }

    static afterFirstPart(project) {
        let bulk = ProjectModel.generate(10, 2);
        return Object.assign(bulk, {
            lore: {name: 'Donald Purmt', text: 'Well ' + project.name + ' project. What about some complex for me?'},
            complexity: 20,
            complexity_max: 20,
            is_storyline: true,
            reward: bulk.reward + 10000
        });
    }

    static afterFirstModule(project) {
        let bulk = ProjectModel.generate(15, 3);
        return Object.assign(bulk, {
            lore: {name: 'Donald Purmt', text: 'Well ' + project.name + ' project. What about some complex for me?'},
            complexity: 30,
            complexity_max: 30,
            is_storyline: true,
            reward: bulk.reward + 25000
        });
    }


    static afterFirstApplication(project) {
        let bulk = ProjectModel.generate(20, 4);
        return Object.assign(bulk, {
            lore: {name: 'Donald Purmt', text: 'Well ' + project.name + ' project. What about some complex for me?'},
            complexity: 40,
            complexity_max: 40,
            is_storyline: true,
            reward: bulk.reward + 50000
        });
    }


    static afterFirstBigDeal(project) {
        let bulk = ProjectModel.generate(50, 4);
        return Object.assign(bulk, {
            lore: {name: 'Donald Purmt', text: 'Well ' + project.name + ' project. What about some complex for me?'},
            complexity: 50,
            complexity_max: 50,
            is_storyline: true,
            reward: bulk.reward + 100000
        });
    }

}

export default Lorer;