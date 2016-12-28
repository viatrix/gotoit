import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import SimpleModal from './SimpleModal';
import StatsBar from './StatsBar';
import bulkStyler from '../services/bulkStyler';

import WorkerModel from '../models/WorkerModel';

import {player_backgrounds, player_specialities, technologies, skills_1} from '../data/knowledge';

class Creation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suggest_name: WorkerModel.genName(),
            selected_background: _.sample(_.keys(player_backgrounds)), //'comprehensive',
            selected_speciality: _.sample(_.keys(player_specialities)), //'university',
        };

        this.embark = this.embark.bind(this);
    }

    embark() {
        console.log('embrk');


        let data = this.props.data;
        data.money += player_backgrounds[this.state.selected_background].money
        let stats = JSON.parse(JSON.stringify(skills_1));
        stats = bulkStyler.playerSpeciality(stats, this.state.selected_speciality);
        stats = bulkStyler.playerBackground(stats, this.state.selected_background);

        let worker = WorkerModel.generatePlayer();

        worker.stats = stats;
        worker.name = this.state.suggest_name;

        data.workers[0] = worker; //: [WorkerModel.generatePlayer()]

        data.stage = 'game';
        data.projects_known_technologies = data.projects_known_technologies.concat(player_backgrounds[this.state.selected_background].start_tech);
       // data.projects_known_technologies = data.projects_known_technologies.concat(player_specialities[this.state.selected_speciality].start_tech);
        this.refs.creation.closePortal();

        if (this.state.selected_background === 'coworker') {
            this.props.data.helpers.hireEmployer(WorkerModel.generate(6));
            this.props.data.helpers.upOffice(2); // this.props.data.office = new OfficeModel(2);
        }
    }

    componentDidMount() {
        this.refs.creation.openPortal();
    }

    render() {
        const data = this.props.data;
        //const worker = data.workers[0];

        let stats = bulkStyler.playerBackground(
                    bulkStyler.playerSpeciality(JSON.parse(JSON.stringify(skills_1)),
                        this.state.selected_speciality),
                        this.state.selected_background);

        const stats_data = _.mapValues(stats, (val, key) => {
            return {name: key, val: stats[key]};
        });

        return (
                <div>
                    {(data.stage === 'start') ?
                        <Portal ref="creation">
                            <SimpleModal>
                                <h3 className="text-center">
                                    Choose <input type="text" name="background" className="form-inline"
                                                  value={this.state.suggest_name}
                                                  onChange={(event) => {
                                                      this.setState({suggest_name: event.target.value})
                                                  }}
                                                  onKeyPress={(event) => {
                                                      event.target.style.width = ((event.target.value.length + 2) * 14) + 'px';
                                                  }}
                                /> Background
                                </h3>
                                <div className="panel panel-info">
                                    <div className="flex-container-row">
                                        {Object.keys(player_backgrounds).map((background) => {
                                            return <div key={background} className="flex-element">
                                                <div className="radio">
                                                    <label className="slim">
                                                        <h3 className="text-center">
                                                            <input type="radio" name="background" value={background}
                                                                   checked={this.state.selected_background === background}
                                                                   onChange={(event) => {
                                                                       this.setState({selected_background: event.target.value})
                                                                   }}/>
                                                            {player_backgrounds[background].name}
                                                        </h3>
                                                        <p>{player_backgrounds[background].text}</p>
                                                        <p>Start tech: {technologies[player_backgrounds[background].start_tech].name}</p>
                                                    </label>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="panel panel-success">
                                    <div className="flex-container-row">
                                        {Object.keys(player_specialities).map((speciality) => {
                                            return <div key={speciality} className="flex-element">
                                                <div className="radio">
                                                    <label className="slim">
                                                        <h3 className="text-center">
                                                            <input type="radio" name="speciality" value={speciality}
                                                                   checked={this.state.selected_speciality === speciality}
                                                                   onChange={(event) => {
                                                                       this.setState({selected_speciality: event.target.value})
                                                                   }}/>
                                                            {player_specialities[speciality].name}
                                                        </h3>
                                                    </label>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="panel panel-warning">
                                    <h4 className="text-center fat">
                                        <p className="fat">Your start money: {player_backgrounds[this.state.selected_background].money}
                                        $. Your start skills:</p>
                                        <StatsBar stats={stats_data} data={this.props.data}/>
                                    </h4>
                                </div>
                                <div className="text-center">
                                    <button className="big btn-success btn-lg" onClick={this.embark}>Embark</button>
                                </div>
                            </SimpleModal>
                        </Portal>
                        : ''}
                </div>
        );
    }
}

export default Creation;