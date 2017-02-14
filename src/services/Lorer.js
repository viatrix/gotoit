
import ProjectModel from '../models/ProjectModel';
import player from '../components/Creation';

var hackathons_generated = 0;

class Lorer { // Quest Project Generator

    static afterFirstTraining(project) {
        let bulk = ProjectModel.generate(5, 1);
        return Object.assign(bulk, {
            lore: {name: 'Kothik Kotecki', text: 'Hi! My name is Kothik Kotecki. I’m a head hunter in CatSoft. The training project “' + project.name + '” that you have done last week got good reviews by students from “CatUniversity”. So, my bosses want you to help us with remote education software. Can you help me, '+player.name+'?'},
            complexity: 10,
            complexity_max: 10,
            is_storyline: true,
            reward: bulk.reward + 5000
        });
    }

    static afterFirstPart(project) {
        let bulk = ProjectModel.generate(10, 2);
        return Object.assign(bulk, {
            lore: {name: 'Kothik Kotecki', text: 'Hi there! It’s Kothik Kotecki again. Do you remember me? You have helped us with “Learning project”. You have done the “' + project.name + '” project and we know about it because we... Eh-hm... Our secretary found it in dustbin. I checked it out: “Wow, this shit is not so bad.. If we’ll fix this architecture. Let’s invite this guy to do the module nobody wants to work on?”. The boss agreed. So I need you for some challenge.'},
            complexity: 20,
            complexity_max: 20,
            is_storyline: true,
            reward: bulk.reward + 10000
        });
    }

    static afterFirstModule(project) {
        let bulk = ProjectModel.generate(15, 3);
        return Object.assign(bulk, {
            lore: {name: 'Kothik Kotecki', text: 'Hi, buddy! Your module for the “' + project.name + '” project was good as for a project with such a low budget. So, I have a job for you. This time I need you together with your team because I have got a big project for you! We need a gaming console for the “catiZZard” company. It must be made top-notch though time is running out. Yea, I understand that it sounds unrealistic but you can do it, I’m sure. Give it all of yourself and you will be rewarded like a God.'},
            complexity: 30,
            complexity_max: 30,
            is_storyline: true,
            reward: bulk.reward + 25000
        });
    }


    static afterFirstApplication(project) {
        let bulk = ProjectModel.generate(20, 4);
        return Object.assign(bulk, {
            lore: {name: 'Kothik Kotecki', text: 'Hi, '+player.name+'! I see that you have finished your first full application for the “' + project.name + '” project. My grandma likes it very much. Now she is using it all the time to pick up boys. Hey, do you want to take another project that fits well your guys skills? We got it from the Indians and we almost started to rewrite it but suddenly Bob got sick, Tom broke his hand and even I haven’t been feeling well.. But the project is good! At least you will be paid a lot.'},
            complexity: 40,
            complexity_max: 40,
            is_storyline: true,
            reward: bulk.reward + 50000
        });
    }


    static afterFirstBigDeal(project) {
        let bulk = ProjectModel.generate(50, 4);
        return Object.assign(bulk, {
            lore: {name: 'Kothik Kotecki', text: 'Hi, bro! Your project “' + project.name + '” became very popular. You must be not only an awesome developer but also a good boss. I have a very important and big order for you. Nobody can do it except for you, help me out. I need you to conduct an experiment. You will have several teams which will be doing the same project but using different technologies. I really need to know what is the right way and what is the wrong one. I’ll give you a big budget and lots of time but give me a result in return!'},
            complexity: 50,
            complexity_max: 50,
            is_storyline: true,
            reward: bulk.reward + 100000
        });
    }


    static hackathon() {
        hackathons_generated++;
        let bulk = ProjectModel.generateHackathon(hackathons_generated);

        return Object.assign(bulk, {
            lore: {
                name: 'City Hackers Team',
                text: `Hello, we heard you guys are developing software?
                    Cool developers never miss Hackathon, the best way to gain new experience and be seen.
                    Will you get take involved in this month?`},
            is_storyline: true
        });
    }

}

export default Lorer;
