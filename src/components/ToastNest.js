import React, { Component } from 'react';
import _ from 'lodash';

import {ToastContainer, ToastMessage} from "react-toastr";

import { chatMessage } from "./Chat";

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

export var addMessage = (text) => { console.log(text) };
export var addAction = (text) => { console.log(text) };
export var addNotification = (text) => { console.log(text) };

/***
 * Short info:
 * types: 'success', 'warning', 'error', 'info'
 */



class ToastNest extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
        this.addAction = this.addAction.bind(this);
        this.clearActions = this.clearActions.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }

    clearMessages() {
        this.refs.messages.clear();
    }

    addMessage(text, options, type='info') {
        chatMessage('', text, type);

        this.refs.messages[type](text, ``, Object.assign({
            closeButton: false,
            preventDuplicates: false,
            timeOut: 1000,
            extendedTimeOut: 500
        }, options));
    }

    clearActions() {
        this.refs.actions.clear();
    }

    addAction(text, options, type='info') {
        this.refs.actions[type](text, ``, Object.assign({
            closeButton: true,
            preventDuplicates: false,
            timeOut: 30000,
            extendedTimeOut: 5000
        }, options));
    }

    addNotification(text, options, type='info') {
       addAction(text, options, type);
       chatMessage('', text, type);
    }

    componentDidMount() {
        addMessage = this.addMessage;
        this.props.data.helpers.addMessage = this.addMessage;
        addAction = this.addAction;
        this.props.data.helpers.addAction = this.addAction;
        addNotification = this.addNotification;
        this.props.data.helpers.addNotification = this.addNotification;
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
