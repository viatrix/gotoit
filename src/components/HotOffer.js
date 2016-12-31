import React, { Component } from 'react';
import Portal from 'react-portal';

import SimpleModal from './SimpleModal';
import ProjectOfferBlock from './ProjectOfferBlock';


class HotOffer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //   end_screen_project: null
        };

    }

    componentDidMount() {
        this.refs.hot_offer.openPortal();
    }

    render() {
        const data = this.props.data;
        let project = this.props.project;

        return (
            <div>
                <Portal closeOnEsc ref="hot_offer">
                    <SimpleModal>
                        <div>
                            <div className="moat">
                                <h3>{project.lore.name}</h3>
                                <p>
                                    {project.lore.text}
                                </p>
                            </div>
                            <div className="moat slim_top">
                                <ProjectOfferBlock candidate={project} data={data} type='hot' />
                            </div>
                        </div>
                    </SimpleModal>
                </Portal>
            </div>
        );
    }
}

export default HotOffer;