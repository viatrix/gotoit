import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';

/***
 * Short info:
 * types: 'success', 'warning', 'error', 'info'
 */

//export var message_queue = [];
//export var chatMessage = (name='', text='', type='info') => { message_queue.push({name: name, text: text, type: type}) };

export var chatMessage = (text) => { console.log(text) };

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };

        this.chatMessage = this.chatMessage.bind(this);
    }

    chatMessage(name='', text='', type='info') {
        this.state.messages.push({name: name, text: text, type: type});
    }

    componentDidMount() {
        chatMessage = this.chatMessage;
        this.props.data.helpers.chatMessage = this.chatMessage;
    }

    /*
    checkNew() {
        if (message_queue.length > 0) {
            this.setState({messages: _.concat(this.state.messages, message_queue)});
            message_queue = [];
        } else {
            return false;
        }
    }
    */

    componentDidUpdate() {

        const node = ReactDOM.findDOMNode(this.refs['msg'+(this.state.messages.length-1)]);
        if (node) {
            node.scrollIntoView();
        }

        //this.refs['msg'+(this.state.messages.length-1)].scrollIntoView();
    }

    render() {
        //this.checkNew();

        //objDiv.scrollTop = objDiv.scrollHeight

        return (
            <div className="chat-window slim">
                    {this.state.messages.map((message, key) => {
                        return <div key={key} ref={'msg'+key} className={classNames('alert', 'slim', 'text-left', 'alert-'+[message.type])}>
                            <strong>{message.name}</strong> {message.text}
                        </div>
                    })}
            </div>
        );
    }
}

export default Chat;