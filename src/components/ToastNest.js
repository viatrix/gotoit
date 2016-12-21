import React, { Component } from 'react';
import _ from 'lodash';

import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class ToastNest extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
        this.addAction = this.addAction.bind(this);
        this.clearActions = this.clearActions.bind(this);
    }

    clearMessages() {
        this.refs.messages.clear();
    }

    addMessage(text) {
        this.refs.messages.success(text, ``, {
            closeButton: false,
            preventDuplicates: false,
            timeOut: 2000,
            extendedTimeOut: 1000
        });
    }

    clearActions() {
        this.refs.actions.clear();
    }

    addAction(text, options) {
        this.refs.actions.success(text, ``, Object.assign({
            closeButton: true,
            preventDuplicates: false,
            timeOut: 30000,
            extendedTimeOut: 10000
        }, options));
    }

    componentDidMount() {
        this.props.data.helpers.addMessage = this.addMessage;
        this.props.data.helpers.addAction = this.addAction;
    }

    render() {
        return (
            <div className="toast-nest">
                <div>
                    <ToastContainer key="messages" ref="messages"
                                    toastMessageFactory={ToastMessageFactory}
                                    className="toast-bottom-right" />
                </div>
                <div>
                    <ToastContainer key="actions" ref="actions"
                                    toastMessageFactory={ToastMessageFactory}
                                    className="toast-bottom-left" />
                </div>
            </div>
        );
    }
}

export default ToastNest;