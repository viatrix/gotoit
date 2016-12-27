import React, { Component } from 'react';

import Creation from './Creation';
import ProjectEndScreen from './ProjectEndScreen';

class PopupsNest extends Component {
    render() {
        const data = this.props.data;

        let end_screen_project = null;
        if (data.projects_end_reports.length > 0) {
            end_screen_project = data.projects_end_reports[0];
        }

        return (
            <div className="hidden popups-nest">
                <div>
                    {(data.stage === 'start') ?
                        <Creation data={this.props.data} />
                        : ''}
                </div>
                <div>
                    {end_screen_project !== null ?
                        <ProjectEndScreen key={end_screen_project.id} project={end_screen_project} data={this.props.data} />
                        : ''}
                </div>
            </div>
        );
    }
}

export default PopupsNest;