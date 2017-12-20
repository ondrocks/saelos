import React, { Component } from 'react';
import { Panel } from '../UI/Panel';
import Progress from "../UI/Progress";
import {connect} from "react-redux";
import { actionCreators } from "../../actions";
import PropTypes from 'prop-types';

let _ = require('lodash');

class ContactPanel extends Component {
    constructor(props) {
        super(props);

        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._setFormState = this._setFormState.bind(this);
        this._toggleBodyClass = this._toggleBodyClass.bind(this);
        this._toggleContactClass = this._toggleContactClass.bind(this);
        this._toggleEditClass = this._toggleEditClass.bind(this);
        this._toggleHistoryClass = this._toggleHistoryClass.bind(this);
        this._getContainerClass = this._getContainerClass.bind(this);

        this.state = {
            contact: props.contact
        }
    }

    _handleFormSubmit() {
        actionCreators.postContact(this.state.formState, this.props.dispatch);

        this.setState({
            formState: {}
        })
    }

    _setFormState(data) {
        this.setState({
            formState: data
        })
    }

    _getContainerClass() {
        return '.contact-row-' + this.props.contact.id;
    }

    _toggleBodyClass() {
        document.querySelector(this._getContainerClass()).classList.toggle('contact-panel-open');

        this._handleFormSubmit();
    }

    _toggleContactClass() {
        document.querySelector(this._getContainerClass()).classList.toggle('contact-contact-panel-open');
    }

    _toggleEditClass() {
        document.querySelector(this._getContainerClass()).classList.toggle('contact-edit-panel-open');
    }

    _toggleHistoryClass() {
        document.querySelector(this._getContainerClass()).classList.toggle('contact-history-panel-open');
    }

    render() {
        return (
            <div className="content-side-wrapper">
                <div className="contact-side-overlay side-overlay" onClick={this._toggleBodyClass} />
                <div className="contact-side side-panel">
                    <Panel>
                        {this.props.contact.id !== 'new' ?
                            <div className="panel-user">
                                <div className="panel-user-content">
                                    {this.props.contact.first_name ? <div className="panel-user-name">{this.props.contact.first_name} {this.props.contact.last_name}</div> : ''}

                                    {this.props.contact.company ? <div className="panel-user-subtitle">{this.props.contact.company.name}</div> : ''}

                                    <div className="panel-user-action" onClick={this._toggleBodyClass}>
                                        <i className="md-icon">close</i>
                                    </div>
                                </div>
                                <div className="panel-user-score">
                                    <Progress size={70}/>
                                </div>
                                <div className="panel-user-available-actions">
                                    <div className="user-action-box" onClick={this._toggleHistoryClass}>
                                        <i className="md-icon">search</i><br />
                                        History
                                    </div>
                                    <div className="user-action-box" onClick={this._toggleEditClass}>
                                        <i className="md-icon">edit</i><br />
                                        Edit
                                    </div>
                                    <div className="user-action-box" onClick={this._toggleContactClass}>
                                        <i className="md-icon">chat_bubble_outline</i><br />
                                        Contact
                                    </div>
                                </div>
                            </div>
                        :
                            <div className="panel-user">
                                <div className="panel-user-content">
                                    <div className="panel-user-name">Create Contact</div>
                                    <div className="panel-user-action" onClick={this._toggleBodyClass}>
                                        <i className="md-icon">close</i>
                                    </div>
                                </div>
                                <div className="panel-user-score">
                                    <Progress size={0}/>
                                </div>
                            </div>
                        }

                        <div className="panel-contact-details">
                            <ContactForm contact={this.props.contact} setFormState={this._setFormState}/>
                        </div>

                        {this.props.contact.id !== 'new' ?
                            <div className="panel-actions">
                                <strong>Recommended Action</strong>
                                <p>Wait <strong>2 days</strong> before taking next step.</p>
                            </div>
                        : ''}
                    </Panel>
                </div>
            </div>
        );
    }
}

class ContactForm extends Component {
    constructor(props) {
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
    }

    _handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        let contactState = this.props.contact;

        // Special handling for custom field state
        if (/custom_fields/.test(name)) {
            name = name + '.value';
        }

        _.set(contactState, name, value);

        this.props.setFormState(contactState)
    }

    render() {
        let stageSelect = <select name="stage">
            <option value="">Please Select</option>
            <option value="1">Stage 1</option>
            <option value="2">Stage 2</option>
            <option value="3">Stage 3</option>
            <option value="4">Stage 4</option>
        </select>;

        let customFields = Object.keys(this.props.contact.custom_fields).map((key, index) => {
            let thisField = this.props.contact.custom_fields[key];
            let input = '';

            switch (thisField.type) {
                case 'text':
                    input = <input type="text" name={"custom_fields." + thisField.alias} onChange={this._handleInputChange} defaultValue={thisField.value} />
                    break;
                case 'select':
                    let options = Object.keys(thisField.options).map((option, i) => {
                        return <option key={i} value={option}>{thisField.options[option]}</option>
                    });

                    input = <select name={"custom_fields." + thisField.alias} onChange={this._handleInputChange}>
                        {options}
                    </select>
            }


            return (
                <div key={index} className="input-container">
                    <label>{thisField.label}</label>
                    {input}
                </div>
            )
        });

        return (
            <form id="contact-details-form">
                <div className="panel-contact-details-column">
                    {this.props.contact.id === 'new' ?
                        <div className="input-container">
                            <label>Name</label>
                            <input type="text" name="first_name" placeholder="First Name" onChange={this._handleInputChange} />
                            <input type="text" name="last_name" placeholder="Last Name" onChange={this._handleInputChange} />
                        </div>
                    : ''}
                    <div className="input-container">
                        <label>Phone</label>
                        <input type="text" name="phone" placeholder="Phone" defaultValue={this.props.contact.phone} onChange={this._handleInputChange} />
                    </div>

                    <div className="input-container">
                        <label>Email</label>
                        <input type="text" name="email" placeholder="Email" defaultValue={this.props.contact.email} onChange={this._handleInputChange} />
                    </div>

                    <div className="input-container">
                        <label>Address</label>
                        <input type="text" name="address1" placeholder="Address 1" defaultValue={this.props.contact.address1} onChange={this._handleInputChange} />
                        <input type="text" name="address2" placeholder="Address 2" defaultValue={this.props.contact.address2} onChange={this._handleInputChange} />
                        <input type="text" name="city" placeholder="City" defaultValue={this.props.contact.city} onChange={this._handleInputChange} />
                        <input type="text" name="state" placeholder="State" defaultValue={this.props.contact.state} onChange={this._handleInputChange} />
                        <input type="text" name="zip" placeholder="Zip" defaultValue={this.props.contact.zip} onChange={this._handleInputChange} />
                    </div>

                    {this.props.contact.company ?
                        <div className="input-container">
                            <label>Company</label>
                            {this.props.contact.id === 'new' ? <input type="text" name="company.name" placeholder="Company Name" onChange={this._handleInputChange} /> : ''}
                            <input type="text" name="company.address1" placeholder="Address 1" defaultValue={this.props.contact.company.address1} onChange={this._handleInputChange} />
                            <input type="text" name="company.address2" placeholder="Address 2" defaultValue={this.props.contact.company.address2} onChange={this._handleInputChange} />
                            <input type="text" name="company.city" placeholder="City" defaultValue={this.props.contact.company.city} onChange={this._handleInputChange} />
                            <input type="text" name="company.state" placeholder="State" defaultValue={this.props.contact.company.state} onChange={this._handleInputChange} />
                            <input type="text" name="company.zip" placeholder="Zip" defaultValue={this.props.contact.company.zip} onChange={this._handleInputChange} />
                        </div>
                        : ''}
                </div>
                <div className="panel-contact-details-column">
                    <label>Stage</label>
                    {stageSelect}

                    <label>Next Step</label>
                    Send updated sales information

                    <label>Interests</label>
                    Maven, Maestro, Mautic Cloud

                    <label>Last Interaction</label>
                    <p>Output phone call with Alex W. on Nov 18 with a rep score of 6.</p>

                    <label>Value</label>
                    <p>$12,500 which contributes 4% to total pipeline.</p>

                    {customFields}
                </div>
            </form>
        )
    }
}

ContactForm.propTypes = {
    contact: PropTypes.object.isRequired,
    setFormState: PropTypes.func.isRequired
}

export default connect()(ContactPanel)
