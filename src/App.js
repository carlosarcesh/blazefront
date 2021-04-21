import React from "react";
import axios from "axios";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {filter} from "lodash";

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './App.css';

const apiCustomersPath = 'https://blazeback.herokuapp.com/api/customers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            customers: [],
            customersFiltered: null,
            id: null,
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            birthDate: null,
            wordFilter: null,
            dateFilter: null,
            modalType: 'create'
        }

        this.onRowSelect = this.onRowSelect.bind(this);
    }

    componentDidMount() {
        this.getCustomers();
    }

    getCustomers() {
        this.setState({loading: true});
        this.filterTable();
        axios.get(apiCustomersPath)
            .then(customers => this.setState({customers: customers.data.data, loading: false}))
            .catch(error => {
                alert(error);
                this.setState({loading: false});
            });
    }

    createCustomer() {
        this.setState({loading: true});
        const {firstName, lastName, email, phoneNumber, birthDate} = this.state;
        axios.post(apiCustomersPath, {firstName, lastName, email, phoneNumber, birthDate})
            .then(response => {
                if (response.data.code === '000') {
                    alert(`Customer ${firstName} was created successfully!`);
                    this.getCustomers();
                } else {
                    alert(response.data.message);
                    this.setState({loading: false});
                }
            })
            .catch(error => {
                alert(error);
                this.setState({loading: false});
            });
    }

    updateCustomer() {
        this.setState({loading: true});
        const {id, firstName, lastName, email, phoneNumber, birthDate} = this.state;
        axios.put(apiCustomersPath, {id, firstName, lastName, email, phoneNumber, birthDate})
            .then(response => {
                if (response.data.code === '000') {
                    alert(`Customer ${firstName} was updated successfully!`);
                    this.getCustomers();
                } else {
                    alert(response.data.message);
                    this.setState({loading: false});
                }
            })
            .catch(error => {
                alert(error);
                this.setState({loading: false});
            });
    }

    filterTable() {
        let {wordFilter, dateFilter, customers} = this.state;
        this.setState({
            customersFiltered: filter(customers, o => {
                return (o.firstName.toLowerCase().includes(wordFilter) ||
                    o.lastName.toLowerCase().includes(wordFilter) ||
                    o.email.toLowerCase().includes(wordFilter) ||
                    o.phoneNumber.toLowerCase().includes(wordFilter) ||
                    o.birthDate.includes(wordFilter)) &&
                    (dateFilter !== null && dateFilter !== '' ? o.birthDate.slice(0, -3) === dateFilter : true)
            })
        });
    }

    onRowSelect(row, isSelected, e) {
        const {id} = row;
        const {firstName, lastName, email, phoneNumber, birthDate} = this.state;

        this.setState({id,
            firstName: firstName || row.firstName,
            lastName: lastName || row.lastName,
            email: email || row.lastName,
            phoneNumber: phoneNumber || row.phoneNumber,
            birthDate: birthDate || row.birthDate
        });
    }

    renderFilters() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="form-group">
                                <label htmlFor="search" className="form-label">Search</label>
                                <input type="text" name="search" className="form-control"
                                       onChange={event => this.setState({wordFilter: event.target.value}, () => this.filterTable())}/>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="form-group">
                                <label htmlFor="search" className="form-label">Birth Date</label>
                                <input type="month" name="search" className="form-control"
                                       onChange={event => this.setState({dateFilter: event.target.value}, () => this.filterTable())}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTable() {
        const {customersFiltered, customers} = this.state;
        const selectRowProp = {
            mode: 'radio',
            bgColor: 'lightgray',
            clickToSelect: true,
            onSelect: this.onRowSelect,
        };

        return (
            <BootstrapTable data={customersFiltered || customers} pagination selectRow={selectRowProp} version='4'>
                <TableHeaderColumn isKey dataField='id' hidden>Customer ID</TableHeaderColumn>
                <TableHeaderColumn dataField='firstName' dataSort>First Name</TableHeaderColumn>
                <TableHeaderColumn dataField='lastName' dataSort>Last Name</TableHeaderColumn>
                <TableHeaderColumn dataField='email' dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn dataField='phoneNumber' dataSort>Phone Number</TableHeaderColumn>
                <TableHeaderColumn dataField='birthDate' dataSort>Birth Date</TableHeaderColumn>
            </BootstrapTable>
        );
    }

    renderForm(type) {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="form-group">
                        <label htmlFor="firstname" className="form-label">First Name</label>
                        <input type="text" name="firstname" className="form-control" defaultValue={this.state.firstName}
                               onChange={e => this.setState({firstName: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" className="form-label">Last Name</label>
                        <input type="text" name="lastname" className="form-control" defaultValue={this.state.lastName}
                               onChange={e => this.setState({lastName: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" defaultValue={this.state.email}
                               onChange={e => this.setState({email: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" name="phone" className="form-control" defaultValue={this.state.phoneNumber}
                               onChange={e => this.setState({phoneNumber: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthdate" className="form-label">Birth Date</label>
                        <input type="date" name="birthdate" className="form-control" defaultValue={this.state.birthDate}
                               onChange={e => this.setState({birthDate: e.target.value})}/>
                    </div>
                    <hr/>
                    <button className="btn btn-primary"
                            onClick={e => {
                                if(type === 'create') {
                                    this.createCustomer();
                                } else {
                                    this.updateCustomer();
                                }
                            }}>{type === 'create' ? 'Create' : 'Update'}</button>
                </div>
            </div>
        );
    }

    renderModal() {
        const type = this.state.modalType;
        return (
            <div className="modal fade" id="formModal" tabIndex="-1" aria-labelledby="formModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">
                                {type === 'create' ? 'Create' : 'Update'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close">{''}</button>
                        </div>
                        <div className="modal-body">
                            {this.renderForm(type)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <h1 className="text-center">Customers</h1>
                </header>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {this.renderFilters()}
                            <hr/>
                        </div>
                        <div className="col-lg-12">
                            <button className="btn btn-primary mb-5 me-1" onClick={e => this.setState({modalType: 'create'})}
                                    data-bs-toggle="modal" data-bs-target="#formModal">Create Customer
                            </button>
                            <button className="btn btn-danger mb-5" onClick={e => {
                                this.setState({modalType: 'update'})
                            }}
                                    data-bs-toggle="modal" data-bs-target="#formModal">Modify Customer
                            </button>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
                {this.renderModal()}
            </React.Fragment>
        );
    }
}

export default App;
